import os
import hashlib
import json
import re
import requests
import time
import threading
from typing import List, Dict, Optional, Any
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.baidusearch import BaiduSearchTools
from datetime import datetime
from .database_manager import DatabaseManager
from .content_extractor import ContentExtractor
from .hybrid_search import LocalNewsSearch

# Default search cache TTL (seconds). Override via SEARCH_CACHE_TTL env var.
DEFAULT_SEARCH_TTL = int(os.getenv("SEARCH_CACHE_TTL", "3600"))  # default: 1 hour


class JinaSearchEngine:
    """Wrapper for Jina Search API (s.jina.ai)."""

    JINA_SEARCH_URL = "https://s.jina.ai/"

    # Rate-limit configuration
    _rate_limit_no_key = 10  # max requests per minute without API key
    _rate_window = 60.0
    _min_interval = 2.0
    _request_times = []
    _last_request_time = 0.0
    _lock = threading.Lock()

    def __init__(self):
        self.api_key = os.getenv("JINA_API_KEY", "").strip()
        self.has_api_key = bool(self.api_key)
        if self.has_api_key:
            logger.info("✅ Jina Search API key configured")

    @classmethod
    def _wait_for_rate_limit(cls, has_api_key: bool) -> None:
        """Block until the next request is within rate limits."""
        if has_api_key:
            time.sleep(0.3)
            return

        with cls._lock:
            current_time = time.time()
            cls._request_times = [t for t in cls._request_times if current_time - t < cls._rate_window]

            if len(cls._request_times) >= cls._rate_limit_no_key:
                oldest = cls._request_times[0]
                wait_time = cls._rate_window - (current_time - oldest) + 1.0
                if wait_time > 0:
                    logger.warning(f"⏳ Jina Search rate limit, waiting {wait_time:.1f}s...")
                    time.sleep(wait_time)
                    current_time = time.time()
                    cls._request_times = [t for t in cls._request_times if current_time - t < cls._rate_window]

            time_since_last = current_time - cls._last_request_time
            if time_since_last < cls._min_interval:
                time.sleep(cls._min_interval - time_since_last)

            cls._request_times.append(time.time())
            cls._last_request_time = time.time()

    def search(self, query: str, max_results: int = 5) -> List[Dict]:
        """
        Execute a search via the Jina Search API.

        Args:
            query: Search query string.
            max_results: Maximum number of results to return.

        Returns:
            List of result dicts, each containing title, url, and content.
        """
        if not query:
            return []

        logger.info(f"🔍 Jina Search: {query}")
        self._wait_for_rate_limit(self.has_api_key)

        headers = {
            "Accept": "application/json",
            "X-Retain-Images": "none",
        }

        if self.has_api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        try:
            import urllib.parse
            encoded_query = urllib.parse.quote(query)
            url = f"{self.JINA_SEARCH_URL}{encoded_query}"

            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 429:
                logger.warning("⚠️ Jina Search rate limited (429), waiting 30s...")
                time.sleep(30)
                return self.search(query, max_results)

            if response.status_code != 200:
                logger.warning(f"Jina Search failed (Status {response.status_code})")
                return []

            try:
                data = response.json()
            except json.JSONDecodeError:
                # Plain-text fallback
                data = {"data": [{"title": "Search Result", "url": "", "content": response.text}]}

            results = []
            items = data.get("data", []) if isinstance(data, dict) else data
            if not isinstance(items, list):
                items = [items] if items else []

            for i, item in enumerate(items[:max_results]):
                if isinstance(item, dict):
                    results.append({
                        "title": item.get("title", f"Result {i+1}"),
                        "url": item.get("url", ""),
                        "href": item.get("url", ""),  # compatibility alias
                        "content": item.get("content", item.get("description", "")),
                        "body": item.get("content", item.get("description", "")),  # compatibility alias
                    })
                elif isinstance(item, str):
                    results.append({"title": f"Result {i+1}", "url": "", "content": item})

            logger.info(f"✅ Jina Search returned {len(results)} results")
            return results

        except requests.exceptions.Timeout:
            logger.error("Jina Search timeout")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"Jina Search request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Jina Search unexpected error: {e}")
            return []


class SearchTools:
    """
    Multi-engine search library with caching and content enrichment.

    Supported engines:
      - jina  : Jina Search (LLM-friendly output; requires JINA_API_KEY for higher rate limits)
      - ddg   : DuckDuckGo (recommended for English / international queries)
      - baidu : Baidu (optional; relevant only for Simplified-Chinese / mainland China queries)
      - local : Local RAG search against the daily_news database

    Engine selection priority: jina (if JINA_API_KEY set) → ddg → baidu (fallback only)
    Note: Baidu is included as a last-resort fallback and is not recommended for
    Taiwan or international users. It can be disabled by setting DISABLE_BAIDU=1.
    """

    def __init__(self, db: DatabaseManager):
        self.db = db

        jina_api_key = os.getenv("JINA_API_KEY", "").strip()
        self._jina_enabled = bool(jina_api_key)

        # Baidu can be disabled via environment variable for non-CN deployments
        baidu_disabled = os.getenv("DISABLE_BAIDU", "").strip().lower() in ("1", "true", "yes")

        self._engines = {
            "ddg": DuckDuckGoTools(),
            "local": LocalNewsSearch(db)
        }

        if not baidu_disabled:
            self._engines["baidu"] = BaiduSearchTools()

        if self._jina_enabled:
            self._engines["jina"] = JinaSearchEngine()
            logger.info("🚀 Jina Search engine enabled (JINA_API_KEY configured)")

        self._default_engine = "jina" if self._jina_enabled else "ddg"

    def _generate_hash(self, query: str, engine: str, max_results: int) -> str:
        return hashlib.md5(f"{engine}:{query}:{max_results}".encode()).hexdigest()

    def search(self, query: str, engine: str = None, max_results: int = 5, ttl: Optional[int] = None) -> str:
        """
        Execute a web search using the specified engine. Results are cached.

        Args:
            query: Search query string (e.g. "NVIDIA earnings" or "光伏行業政策").
            engine: Engine to use. Options:
                    "jina"  - Jina Search (LLM-friendly; requires JINA_API_KEY for full rate limits),
                    "ddg"   - DuckDuckGo (recommended for English / international queries),
                    "baidu" - Baidu (optional; for Simplified-Chinese / mainland China queries),
                    "local" - Local historical news search (vector + BM25 hybrid).
                    Default: "jina" if JINA_API_KEY is set, otherwise "ddg".
            max_results: Number of results to return (default: 5).
            ttl: Cache TTL in seconds. Uses SEARCH_CACHE_TTL env var or 3600s by default.
                 Set to 0 to force a fresh fetch.

        Returns:
            String representation of search results including titles, snippets, and URLs.
        """
        if engine is None:
            engine = self._default_engine

        if engine not in self._engines:
            return f"Error: Unsupported engine '{engine}'. Available: {list(self._engines.keys())}"

        query_hash = self._generate_hash(query, engine, max_results)
        effective_ttl = ttl if ttl is not None else DEFAULT_SEARCH_TTL

        # Attempt cache read (skip for local engine which is its own store)
        if engine != "local":
            cache = self.db.get_search_cache(query_hash, ttl_seconds=effective_ttl if effective_ttl > 0 else None)
            if cache and effective_ttl != 0:
                logger.info(f"ℹ️ Cache hit for: {query} ({engine})")
                return cache['results']

        logger.info(f"📡 Searching {engine} for: {query}")
        try:
            tool = self._engines[engine]
            if engine == "jina":
                jina_results = tool.search(query, max_results=max_results)
                results = [
                    {"title": r.get("title", ""), "href": r.get("url", ""), "body": r.get("content", "")}
                    for r in jina_results
                ]
            elif engine == "ddg":
                results = tool.duckduckgo_search(query, max_results=max_results)
            elif engine == "baidu":
                results = tool.baidu_search(query, max_results=max_results)
            elif engine == "local":
                local_results = tool.search(query, top_n=max_results)
                results = [
                    {"title": r.get("title"), "href": r.get("url", "local"), "body": r.get("content", "")}
                    for r in local_results
                ]
            else:
                results = "Search not implemented for this engine."

            results_str = str(results)
            if engine != "local":
                self.db.save_search_cache(query_hash, query, engine, results_str)
            return results_str

        except Exception as e:
            # Fallback chain: jina → ddg → baidu
            if engine == "jina":
                logger.warning(f"⚠️ Jina search failed, falling back to ddg: {query} ({e})")
                try:
                    return self.search(query, engine="ddg", max_results=max_results, ttl=ttl)
                except Exception as e2:
                    logger.error(f"❌ DDG fallback also failed for {query}: {e2}")
            elif engine == "ddg" and "baidu" in self._engines:
                logger.warning(f"⚠️ DDG search failed, falling back to baidu: {query} ({e})")
                try:
                    return self.search(query, engine="baidu", max_results=max_results, ttl=ttl)
                except Exception as e2:
                    logger.error(f"❌ Baidu fallback also failed for {query}: {e2}")

            logger.error(f"❌ Search failed for {query}: {e}")
            return f"Error occurred during search: {str(e)}"

    def search_list(self, query: str, engine: str = None, max_results: int = 5, ttl: Optional[int] = None, enrich: bool = True) -> List[Dict]:
        """
        Execute a search and return structured results as List[Dict].
        Each dict contains: title, href (or url), body (or snippet).

        Args:
            engine: Search engine (default: configured default engine, Jina preferred).
            enrich: Whether to fetch full article content and compute sentiment (default: True).
        """
        if engine is None:
            engine = self._default_engine

        if engine not in self._engines:
            logger.error(f"Unsupported engine: {engine}")
            return []

        enrich_suffix = ":enriched" if enrich else ""
        query_hash = self._generate_hash(query, engine + enrich_suffix, max_results)
        effective_ttl = ttl if ttl is not None else DEFAULT_SEARCH_TTL

        # Attempt cache read
        cache = self.db.get_search_cache(query_hash, ttl_seconds=effective_ttl if effective_ttl > 0 else None)
        if cache and effective_ttl != 0:
            try:
                cached_data = json.loads(cache['results'])
                if isinstance(cached_data, list):
                    logger.info(f"ℹ️ Structured cache hit for: {query}")
                    return cached_data
            except Exception:
                pass

        # Smart cache check delegated to agent via PROMPTS.md

        logger.info(f"📡 Searching {engine} (structured) for: {query}")
        try:
            tool = self._engines[engine]
            results = []
            if engine == "jina":
                jina_results = tool.search(query, max_results=max_results)
                for r in jina_results:
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("url", ""),
                        "href": r.get("url", ""),
                        "body": r.get("content", ""),
                        "content": r.get("content", ""),
                        "source": "Jina Search"
                    })
            elif engine == "ddg":
                results = tool.duckduckgo_search(query, max_results=max_results)
            elif engine == "baidu":
                results = tool.baidu_search(query, max_results=max_results)
            elif engine == "local":
                local_results = tool.search(query, top_n=max_results)
                results = [
                    {
                        "title": r.get("title"),
                        "url": r.get("url", "local"),
                        "body": r.get("content", "")[:500],
                        "source": f"Local ({r.get('source', 'db')})",
                        "publish_time": r.get("publish_time")
                    }
                    for r in local_results
                ]

            # Parse JSON string responses (Baidu may return JSON string)
            if isinstance(results, str) and engine not in ["local", "jina"]:
                try:
                    results = json.loads(results)
                except Exception:
                    pass

            # Normalise to unified schema
            normalized_results = []
            if isinstance(results, list):
                for i, r in enumerate(results, 1):
                    title = r.get('title', '')
                    url = r.get('href') or r.get('url') or r.get('link', '')
                    content = r.get('body') or r.get('snippet') or r.get('abstract', '')

                    if title and url:
                        normalized_results.append({
                            "id": self._generate_hash(url + query, "search_item", i),
                            "rank": i,
                            "title": title,
                            "url": url,
                            "content": content,
                            "original_snippet": content,
                            "source": f"Search ({engine})",
                            "publish_time": datetime.now().isoformat(),
                            "crawl_time": datetime.now().isoformat(),
                            "meta_data": {"query": query, "engine": engine}
                        })

            elif isinstance(results, str) and results:
                normalized_results.append({"title": query, "url": "", "content": results, "source": engine})

            # Content enrichment and sentiment scoring
            # Jina Search already returns LLM-friendly content; skip additional crawling.
            skip_content_enrichment = (engine == "jina")

            if enrich and normalized_results:
                logger.info(f"🕸️ Enriching {len(normalized_results)} results...")
                extractor = ContentExtractor()

                if not hasattr(self, 'sentiment_tool') or self.sentiment_tool is None:
                    from .sentiment_tools import SentimentTools
                    self.sentiment_tool = SentimentTools(self.db)

                for item in normalized_results:
                    if item.get("url"):
                        try:
                            if skip_content_enrichment and len(item.get("content", "")) > 100:
                                full_content = item["content"]
                            else:
                                full_content = extractor.extract_with_jina(item["url"], timeout=60)

                            if full_content and len(full_content) > 100:
                                item["content"] = full_content
                                text_to_analyze = f"{item['title']} {full_content[:500]}"
                                sent_result = self.sentiment_tool.analyze_sentiment(text_to_analyze)
                                score = sent_result.get('score', 0.0)
                                item["sentiment_score"] = float(score)
                                logger.info(f"  ✅ Enriched: {item['title'][:20]}... (Sentiment: {score:.2f})")
                            else:
                                logger.info(f"  ⚠️ Short/failed content for {item['url']}, using snippet for sentiment.")
                                text_to_analyze = f"{item['title']} {item['content']}"
                                sent_result = self.sentiment_tool.analyze_sentiment(text_to_analyze)
                                score = sent_result.get('score', 0.0)
                                item["sentiment_score"] = float(score)

                        except Exception as e:
                            logger.warning(f"Failed to enrich {item['url']}: {e}. Using snippet.")
                            text_to_analyze = f"{item['title']} {item['content']}"
                            sent_result = self.sentiment_tool.analyze_sentiment(text_to_analyze)
                            score = sent_result.get('score', 0.0)
                            item["sentiment_score"] = float(score)

            if normalized_results:
                self.db.save_search_cache(query_hash, query, engine, normalized_results)

            return normalized_results

        except Exception as e:
            # Fallback chain: jina → ddg → baidu
            if engine == "jina":
                logger.warning(f"⚠️ Jina search_list failed, falling back to ddg: {query} ({e})")
                try:
                    return self.search_list(query, engine="ddg", max_results=max_results, ttl=ttl, enrich=enrich)
                except Exception as e2:
                    logger.error(f"❌ DDG fallback (search_list) also failed for {query}: {e2}")
            elif engine == "ddg" and "baidu" in self._engines:
                logger.warning(f"⚠️ DDG search_list failed, falling back to baidu: {query} ({e})")
                try:
                    return self.search_list(query, engine="baidu", max_results=max_results, ttl=ttl, enrich=enrich)
                except Exception as e2:
                    logger.error(f"❌ Baidu fallback (search_list) also failed for {query}: {e2}")

            logger.error(f"❌ Structured search failed for {query}: {e}")
            return []

    def list_similar_queries(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Find previously cached queries similar to the current one.
        The agent can use this to decide whether to reuse a cached result
        (evaluated via the Search Cache Relevance Prompt in PROMPTS.md).
        """
        return self.db.find_similar_queries(query, limit=limit)

    def aggregate_search(self, query: str, engines: Optional[List[str]] = None, max_results: int = 5) -> str:
        """
        Search across multiple engines simultaneously and aggregate results.

        Args:
            query: Search query string.
            engines: List of engines to use (default: ["ddg", "baidu"] if baidu enabled,
                     otherwise ["ddg"]). Baidu is included only when DISABLE_BAIDU is not set.
            max_results: Results per engine.

        Returns:
            Aggregated results grouped by engine.
        """
        if engines is None:
            engines = [e for e in ["ddg", "baidu"] if e in self._engines]
        aggregated_results = []
        for engine in engines:
            res = self.search(query, engine=engine, max_results=max_results)
            aggregated_results.append(f"--- Results from {engine.upper()} ---\n{res}")

        return "\n\n".join(aggregated_results)
