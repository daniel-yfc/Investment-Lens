---
name: alphaear-news
description: Fetch hot finance news, unified trends, and prediction market data from global sources. Use when the user needs real-time financial news, trend reports from international and regional finance sources (Reuters, Bloomberg, FT, CNBC, Nikkei Asia, WSJ, etc.), or Polymarket finance prediction data. Regional sources (e.g. WallstreetCN, Nikkei Asia) may be included for geographic context.
---

# AlphaEar News Skill

## Overview

Fetch real-time hot news from global finance sources, generate unified trend reports, and retrieve Polymarket prediction data.

## Capabilities

### 1. Fetch Hot News & Trends

Use `scripts/news_tools.py` via `NewsNowTools`.

-   **Fetch News**: `fetch_hot_news(source_id, count)`
    -   See [sources.md](references/sources.md) for valid `source_id`s (e.g., `reuters`, `bloomberg`, `nikkei`).
-   **Unified Report**: `get_unified_trends(sources)`
    -   Aggregates top news from multiple global sources.

### 2. Fetch Prediction Markets

Use `scripts/news_tools.py` via `PolymarketTools`.

-   **Market Summary**: `get_market_summary(limit)`
    -   Returns a formatted report of active global prediction markets.

## Dependencies

-   `requests`, `loguru`
-   `scripts/database_manager.py` (Local DB)
