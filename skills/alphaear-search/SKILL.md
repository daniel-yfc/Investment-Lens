---
name: alphaear-search
description: Web search and local RAG retrieval for finance context. Queries DuckDuckGo,
  Jina, or local news DB. Do NOT use for fetching new live news (use alphaear-news)
  or structured stock price data.
allowed-tools:
- Read
- Bash
metadata:
  argument-hint: '[search query | ''local: ...'' | engine: jina | ddg | local]'
  version: '2.1'
  language: zh-tw
  last-updated: '2026-04-20'
  effort: low
  user-invocable: 'true'
  compatibility: Requires duckduckgo-search, requests, scripts/database_manager.py,
    scripts/hybrid_search.py
---
# AlphaEar Search Skill

## Purpose

Two distinct functions under one skill:

| Mode | Engine | Data source | Use when |
|------|--------|-------------|----------|
| Web search | `jina` or `ddg` | Live internet | Need current finance information from the web |
| Local retrieval | `local` | `daily_news` SQLite DB | Need to query content already ingested by `alphaear-news` |

**Critical distinction:**
- `engine='local'` is a **read-only query** against the local DB. It only returns content that `alphaear-news` has already fetched and stored. If the DB is empty or stale, run `alphaear-news` first.
- Web engines (`jina`, `ddg`) fetch **live internet content** and do not write to the local DB.

## Do Not Use

- For structured OHLCV price data → use `alphaear-stock`.
- For fetching new live news and storing it → use `alphaear-news`.
- For Baidu search → removed; not supported.

## Capabilities

Use `scripts/search_tools.py` via `SearchTools`:

- `search(query, engine, max_results)` — returns JSON summary string.
  - `engine`: `'jina'` | `'ddg'` | `'local'`
- `search_list(query, engine, max_results)` — returns `List[Dict]`.
- `aggregate_search(query)` — combines `jina` + `ddg` results (web only). Use only when a single engine returns insufficient results.

For local retrieval only:
- `scripts/hybrid_search.py` — BM25 + semantic hybrid search over `daily_news` DB.

## Smart Cache (Web Engines)

Before fetching live, check if a recent cached result is reusable.
Use the **Search Cache Relevance Prompt** in `references/PROMPTS.md` (section: `## Search Cache Relevance Prompt`).
If `references/PROMPTS.md` is unavailable, apply this fallback rule: reuse cached result if it is less than 30 minutes old and the query terms are an exact or near-exact match.

## Gotchas

- `engine='local'` returns empty results if `alphaear-news` has not run yet. Always check DB freshness before reporting “no results found”.
- `jina` reader can time out on heavy pages (PDFs, large financial portals). Fall back to `ddg` if Jina returns error or empty.
- `aggregate_search` doubles API calls. Use only when a single engine is insufficient.
- The local DB is an SQLite file. Concurrent writes from `alphaear-news` and concurrent reads from this skill can cause `database is locked` errors. Retry once with a 500 ms delay; if the second attempt also fails, raise the error to the user — do not return empty results silently.
- BM25 + semantic hybrid search requires embedding model to be loaded. First call is slow (~2–5 s). Subsequent calls use cached embeddings.

## Dependencies

- `duckduckgo-search`, `requests`
- `scripts/database_manager.py` — search cache + `daily_news` DB access
- `scripts/hybrid_search.py` — local BM25/semantic retrieval
