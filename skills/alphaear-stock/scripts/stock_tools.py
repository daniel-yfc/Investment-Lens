from datetime import datetime, timedelta
from typing import List, Dict, Optional
import yfinance as yf
import pandas as pd
import re
import sqlite3
from loguru import logger
from .database_manager import DatabaseManager

# ---------------------------------------------------------------------------
# Exchange suffix routing table
# ---------------------------------------------------------------------------
# Maps short exchange hints to the Yahoo Finance ticker suffix.
# Used by search_ticker() when resolving ambiguous names.
EXCHANGE_SUFFIX: Dict[str, str] = {
    "TW": ".TW",    # Taiwan Stock Exchange
    "TWO": ".TWO",  # Taiwan OTC
    "HK": ".HK",    # Hong Kong
    "JP": ".T",     # Tokyo
    "KR": ".KS",    # Korea (KOSPI)
    "KQ": ".KQ",    # Korea (KOSDAQ)
    "SG": ".SI",    # Singapore
    "AU": ".AX",    # Australia
    "UK": ".L",     # London
    "DE": ".DE",    # Frankfurt / Xetra
    "FR": ".PA",    # Paris
    "CA": ".TO",    # Toronto
    "IN": ".NS",    # NSE India
}

# Common name-to-ticker aliases for fast resolution without DB lookup.
NAME_ALIASES: Dict[str, str] = {
    "TSMC": "2330.TW",
    "MEDIATEK": "2454.TW",
    "TENCENT": "0700.HK",
    "ALIBABA": "9988.HK",
    "MEITUAN": "3690.HK",
    "SAMSUNG": "005930.KS",
    "TOYOTA": "7203.T",
    "SONY": "6758.T",
    "SOFTBANK": "9984.T",
    "APPLE": "AAPL",
    "MICROSOFT": "MSFT",
    "TESLA": "TSLA",
    "NVIDIA": "NVDA",
    "ALPHABET": "GOOGL",
    "AMAZON": "AMZN",
    "META": "META",
}


def _strip_suffix(ticker: str) -> str:
    """Remove exchange suffix (e.g. '.TW', '.HK') for cache key normalisation."""
    return re.sub(r'\.[A-Z]{1,3}$', '', ticker.upper())


def _normalise_ticker(ticker: str) -> str:
    """Ensure ticker is uppercase and trimmed."""
    return ticker.strip().upper()


def _fetch_yfinance(
    ticker: str,
    start_date: str,
    end_date: str,
) -> pd.DataFrame:
    """
    Fetch OHLCV data from Yahoo Finance for any supported global ticker.

    Args:
        ticker: Full ticker with exchange suffix where required (e.g. '2330.TW').
        start_date: Inclusive start date in 'YYYY-MM-DD' format.
        end_date: Inclusive end date in 'YYYY-MM-DD' format.

    Returns:
        DataFrame with columns: date, open, close, high, low, volume, change_pct.
        Returns empty DataFrame if no data is available.
    """
    end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
    raw = yf.Ticker(ticker).history(
        start=start_date,
        end=end_dt.strftime("%Y-%m-%d"),
        auto_adjust=True,
    )

    if raw.empty:
        logger.warning(f"yfinance returned no data for {ticker}")
        return pd.DataFrame()

    df = raw.reset_index()
    date_col = "Date" if "Date" in df.columns else df.columns[0]

    df = df.rename(columns={
        date_col: "date_raw",
        "Open": "open",
        "Close": "close",
        "High": "high",
        "Low": "low",
        "Volume": "volume",
    })

    df["date"] = pd.to_datetime(df["date_raw"]).dt.strftime("%Y-%m-%d")
    df["change_pct"] = df["close"].pct_change().mul(100).fillna(0).round(4)

    cols = ["date", "open", "close", "high", "low", "volume", "change_pct"]
    return df[[c for c in cols if c in df.columns]]


class StockTools:
    """
    Global stock data tools — OHLCV retrieval with local SQLite caching.

    All market data is sourced via yfinance, which covers:
    - US equities (plain tickers, e.g. AAPL)
    - Taiwan: .TW / .TWO
    - Hong Kong: .HK
    - Japan: .T
    - Korea: .KS / .KQ
    - Singapore: .SI
    - Europe: .L, .DE, .PA, etc.
    - And all other Yahoo Finance-supported exchanges.

    For non-US tickers, always include the exchange suffix.
    """

    def __init__(self, db: DatabaseManager, auto_seed: bool = True):
        """
        Args:
            db: DatabaseManager instance.
            auto_seed: Seed the alias table from NAME_ALIASES on first run.
        """
        self.db = db
        if auto_seed:
            self._seed_aliases()

    # ------------------------------------------------------------------
    # Alias seeding
    # ------------------------------------------------------------------

    def _seed_aliases(self):
        """Populate stock_list with well-known aliases if the table is empty."""
        cursor = self.db.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM stock_list")
        if cursor.fetchone()[0] > 0:
            return
        rows = [
            {"code": ticker, "name": name.title()}
            for name, ticker in NAME_ALIASES.items()
        ]
        df = pd.DataFrame(rows)
        self.db.save_stock_list(df)
        logger.info(f"Seeded {len(rows)} alias entries into stock_list.")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def search_ticker(
        self,
        query: str,
        exchange_hint: Optional[str] = None,
        limit: int = 5,
    ) -> List[Dict]:
        """
        Search for a stock by name or code.

        Args:
            query: Partial or full name/code, e.g. 'TSMC', '2330', 'Apple'.
            exchange_hint: Optional exchange key from EXCHANGE_SUFFIX, e.g. 'TW', 'HK'.
                           When provided, raw numeric codes are auto-suffixed.
            limit: Maximum number of results to return.

        Returns:
            List of dicts with keys 'code' and 'name'.
        """
        clean = re.sub(r'\.(TW|TWO|HK|T|KS|KQ|SI|AX|L|DE|PA|TO|NS)$', '', query.strip(), flags=re.IGNORECASE)

        # Name alias fast path
        alias_key = clean.upper()
        if alias_key in NAME_ALIASES:
            ticker = NAME_ALIASES[alias_key]
            return [{"code": ticker, "name": alias_key.title()}]

        # Database fuzzy search
        results = self.db.search_stock(clean, limit)

        # If no DB results and query looks like a numeric code, apply exchange suffix
        if not results and re.match(r'^\d{4,6}$', clean):
            suffix = EXCHANGE_SUFFIX.get((exchange_hint or "").upper(), "")
            resolved = f"{clean}{suffix}" if suffix else clean
            return [{"code": resolved, "name": resolved}]

        # Fallback: treat alphanumeric queries as US tickers
        if not results and re.match(r'^[A-Za-z]{1,5}$', clean):
            return [{"code": clean.upper(), "name": clean.upper()}]

        return results

    def get_stock_price(
        self,
        ticker: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        force_sync: bool = False,
    ) -> pd.DataFrame:
        """
        Retrieve historical OHLCV data for a ticker.

        Data is served from the local SQLite cache where available.
        Stale or missing ranges trigger a yfinance fetch and cache update.

        Args:
            ticker: Full ticker symbol including exchange suffix for non-US markets.
                    Examples: 'AAPL', '2330.TW', '0700.HK', '7203.T'.
            start_date: Start date in 'YYYY-MM-DD'. Defaults to 90 days ago.
            end_date: End date in 'YYYY-MM-DD'. Defaults to today.
            force_sync: If True, bypass cache and fetch fresh data.

        Returns:
            DataFrame with columns: date, open, close, high, low, volume, change_pct.
        """
        now = datetime.now()
        if not end_date:
            end_date = now.strftime("%Y-%m-%d")
        if not start_date:
            start_date = (now - timedelta(days=90)).strftime("%Y-%m-%d")

        ticker = _normalise_ticker(ticker)
        cache_key = ticker  # Use full ticker (with suffix) as the cache key

        df_db = self.db.get_stock_prices(cache_key, start_date, end_date)

        need_sync = force_sync or df_db.empty
        if not need_sync and not df_db.empty:
            db_latest = pd.to_datetime(df_db["date"].max())
            req_latest = pd.to_datetime(end_date)
            if (req_latest - db_latest).days > 2:
                need_sync = True

        if need_sync:
            logger.info(f"Syncing {ticker} from yfinance ({start_date} to {end_date})...")
            try:
                df_remote = _fetch_yfinance(ticker, start_date, end_date)
                if not df_remote.empty:
                    self.db.save_stock_prices(cache_key, df_remote)
                    return self.db.get_stock_prices(cache_key, start_date, end_date)
                else:
                    logger.warning(f"No data returned by yfinance for {ticker}.")
            except sqlite3.Error as e:
                logger.error(f"Database error while caching {ticker}: {e}")
            except Exception as e:
                logger.error(f"Unexpected error fetching {ticker}: {e}")

        return df_db


def get_stock_summary(ticker: str, db: DatabaseManager) -> str:
    """
    Generate a brief price summary report for a given ticker.

    Args:
        ticker: Full ticker symbol (e.g. 'AAPL', '2330.TW').
        db: DatabaseManager instance.

    Returns:
        Markdown-formatted summary string.
    """
    tools = StockTools(db)
    df = tools.get_stock_price(ticker)

    if df.empty:
        return f"No price data available for {ticker}."

    latest = df.iloc[-1]
    period_change = (
        (latest["close"] - df.iloc[0]["close"]) / df.iloc[0]["close"]
    ) * 100

    lines = [
        f"## {ticker} — Price Summary",
        f"- **Period**: {df.iloc[0]['date']} → {latest['date']}",
        f"- **Latest close**: {latest['close']:.4f}",
        f"- **Period return**: {period_change:+.2f}%",
        f"- **High / Low**: {df['high'].max():.4f} / {df['low'].min():.4f}",
        "",
        "### Recent sessions",
        "```",
        df.tail(5)[["date", "close", "change_pct", "volume"]].to_string(index=False),
        "```",
    ]
    return "\n".join(lines)
