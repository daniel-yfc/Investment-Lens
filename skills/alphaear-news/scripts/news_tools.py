import requests
from requests.exceptions import RequestException, Timeout
import json
import time
from datetime import datetime
from typing import List, Dict, Optional
from loguru import logger
from .database_manager import DatabaseManager
from .content_extractor import ContentExtractor

class NewsNowTools:
    """全球熱點新聞取得工具 — 接入 NewsNow API 與 Jina 內容提取"""
    
    BASE_URL = "https://newsnow.busiyi.world"
    SOURCES = {
        # 全球金融類
        "reuters":      "Reuters",
        "bloomberg":    "Bloomberg Markets",
        "ft":           "Financial Times",
        "wsj":          "Wall Street Journal",
        "cnbc":         "CNBC",
        "seekingalpha": "Seeking Alpha",
        "wallstreetcn": "華爾街見聞",
        # 全球科技／綜合類
        "hackernews":   "Hacker News",
        "techcrunch":   "TechCrunch",
        "theverge":     "The Verge",
        "economist":    "The Economist",
        "bbc_business": "BBC Business",
        # 亞太區域類
        "nikkei":       "Nikkei Asia",
        "scmp":         "South China Morning Post",
        "cls":          "財聯社",
        "xueqiu":       "雪球熱榜",
    }

    def __init__(self, db: DatabaseManager):
        self.db = db
        self.user_agent = (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        )
        self.extractor = ContentExtractor()
        # 簡易記憶體快取: source_id -> {"time": timestamp, "data": []}
        self._cache = {}

    def fetch_hot_news(self, source_id: str, count: int = 15, fetch_content: bool = False) -> List[Dict]:
        """
        從指定新聞源取得熱點新聞清單（支援 5 分鐘快取）。
        """
        cache_key = f"{source_id}_{count}"
        cached = self._cache.get(cache_key)
        now = time.time()
        
        if cached and (now - cached["time"] < 300):
            logger.info(f"⚡ 使用快取新聞 {source_id}（已快取 {int(now - cached['time'])} 秒）")
            return cached["data"]

        try:
            url = f"{self.BASE_URL}/api/s?id={source_id}"
            response = requests.get(url, headers={"User-Agent": self.user_agent}, timeout=30)
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])[:count]
                processed_items = []
                for i, item in enumerate(items, 1):
                    item_url = item.get("url", "")
                    content = ""
                    if fetch_content and item_url:
                        content = self.extractor.extract_with_jina(item_url) or ""
                    
                    processed_items.append({
                        "id": item.get("id") or f"{source_id}_{int(time.time())}_{i}",
                        "source": source_id,
                        "rank": i,
                        "title": item.get("title", ""),
                        "url": item_url,
                        "content": content,
                        "publish_time": item.get("publish_time"),
                        "meta_data": item.get("extra", {})
                    })
                
                self._cache[cache_key] = {"time": now, "data": processed_items}
                logger.info(f"✅ 已取得並快取 {source_id} 新聞")
                
                self.db.save_daily_news(processed_items)
                return processed_items
            else:
                logger.error(f"NewsNow API 錯誤：{response.status_code}")
                if cached:
                    logger.warning(f"⚠️ API 失敗，使用過期快取 {source_id}")
                    return cached["data"]
                return []
        except Timeout:
            logger.error(f"取得 {source_id} 新聞逾時")
            if cached:
                logger.warning(f"⚠️ 逾時，使用過期快取 {source_id}")
                return cached["data"]
            return []
        except RequestException as e:
            logger.error(f"取得 {source_id} 新聞發生網路錯誤：{e}")
            if cached:
                logger.warning(f"⚠️ 網路失敗，使用過期快取 {source_id}")
                return cached["data"]
            return []
        except json.JSONDecodeError:
            logger.error(f"解析 NewsNow {source_id} JSON 回應失敗")
            return []
        except Exception as e:
            logger.error(f"取得 {source_id} 新聞發生未預期錯誤：{e}")
            return []

    def fetch_news_content(self, url: str) -> Optional[str]:
        """
        使用 Jina Reader 擷取指定 URL 的網頁正文內容。
        
        Args:
            url: 需要擷取內容的完整網頁 URL，必須以 http:// 或 https:// 開頭。
        
        Returns:
            擷取的網頁正文內容（Markdown 格式），失敗時回傳 None。
        """
        return self.extractor.extract_with_jina(url)

    def get_unified_trends(self, sources: Optional[List[str]] = None) -> str:
        """
        取得多平台綜合熱點報告，自動彙整多個全球新聞源的熱門內容。
        
        Args:
            sources: 要掃描的新聞源清單。可選值按類別：
                **全球金融類**: "reuters", "bloomberg", "ft", "wsj", "cnbc", "seekingalpha", "wallstreetcn"
                **全球科技／綜合類**: "hackernews", "techcrunch", "theverge", "economist", "bbc_business"
                **亞太區域類**: "nikkei", "scmp", "cls", "xueqiu"
        
        Returns:
            格式化的 Markdown 熱點彙整報告，包含各平台 Top 10 熱點標題與連結。
        """
        sources = sources or ["reuters", "bloomberg", "hackernews"]
        all_news = []
        for src in sources:
            all_news.extend(self.fetch_hot_news(src))
            time.sleep(0.2)
        
        if not all_news:
            return "❌ 未能取得熱點資料"
            
        report = f"# 即時全球熱點彙整 ({datetime.now().strftime('%Y-%m-%d %H:%M')})\n\n"
        for src in sources:
            src_name = self.SOURCES.get(src, src)
            report += f"### 🔥 {src_name}\n"
            src_news = [n for n in all_news if n['source'] == src]
            for n in src_news[:10]:
                report += f"- {n['title']} ([連結]({n['url']}))\n"
            report += "\n"
            
        return report


class PolymarketTools:
    """Polymarket 全球預測市場資料工具 — 取得熱門預測市場以反映公眾情緒與預期"""
    
    BASE_URL = "https://gamma-api.polymarket.com"
    
    def __init__(self, db: DatabaseManager):
        self.db = db
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    
    def get_active_markets(self, limit: int = 20) -> List[Dict]:
        """
        取得活躍的全球預測市場，用於分析公眾情緒與預期。
        
        預測市場資料可反映：
        - 公眾對重大事件的預期機率
        - 市場情緒與風險偏好
        - 熱門議題的關注度
        
        Args:
            limit: 取得的市場數量，預設 20 個。
        
        Returns:
            包含預測市場資訊的清單，每個市場包含：
            - question: 預測問題
            - outcomes: 可能的結果
            - outcomePrices: 各結果的機率價格
            - volume: 交易量
        """
        try:
            response = requests.get(
                f"{self.BASE_URL}/markets",
                params={"active": "true", "closed": "false", "limit": limit},
                headers={"User-Agent": self.user_agent, "Accept": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                markets = response.json()
                result = []
                for m in markets:
                    result.append({
                        "id": m.get("id"),
                        "question": m.get("question"),
                        "slug": m.get("slug"),
                        "outcomes": m.get("outcomes"),
                        "outcomePrices": m.get("outcomePrices"),
                        "volume": m.get("volume"),
                        "liquidity": m.get("liquidity"),
                    })
                logger.info(f"✅ 取得 {len(result)} 個預測市場")
                return result
            else:
                logger.warning(f"⚠️ Polymarket API 回傳 {response.status_code}")
                return []
        except Timeout:
            logger.error("取得 Polymarket 市場逾時")
            return []
        except RequestException as e:
            logger.error(f"取得 Polymarket 市場發生網路錯誤：{e}")
            return []
        except json.JSONDecodeError:
            logger.error("解析 Polymarket JSON 回應失敗")
            return []
        except Exception as e:
            logger.error(f"取得 Polymarket 市場發生未預期錯誤：{e}")
            return []
    
    def get_market_summary(self, limit: int = 10) -> str:
        """
        取得預測市場摘要報告，用於了解當前全球熱門議題與公眾預期。
        
        Args:
            limit: 取得的市場數量
            
        Returns:
            格式化的預測市場報告
        """
        markets = self.get_active_markets(limit)
        if not markets:
            return "❌ 無法取得 Polymarket 資料"
        
        report = f"# 🔮 Polymarket 全球熱門預測 ({datetime.now().strftime('%Y-%m-%d %H:%M')})\n\n"
        for i, m in enumerate(markets, 1):
            question = m.get("question", "Unknown")
            prices = m.get("outcomePrices", [])
            volume = m.get("volume", 0)
            
            report += f"**{i}. {question}**\n"
            if prices:
                report += f"   機率：{prices}\n"
            if volume:
                report += f"   交易量：${float(volume):,.0f}\n"
            report += "\n"
        
        return report
