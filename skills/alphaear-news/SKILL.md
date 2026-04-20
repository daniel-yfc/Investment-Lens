---
name: alphaear-news
description: Use this skill when live financial news must be fetched or ingested
  into the local database before search, sentiment scoring, or investment analysis.
  Use it for fetching headlines from Reuters, Bloomberg, FT, CNBC, Nikkei, WSJ,
  or Polymarket market data. Do not use it to query already-stored news (use
  alphaear-search engine='local'), to score sentiment (use alphaear-sentiment),
  or to retrieve market price data (use alphaear-stock).
allowed-tools:
- Read
- Write
- Bash
metadata:
  argument-hint: '[source_id | count | ''all sources'']'
  version: '1.1'
  language: zh-tw
  last-updated: '2026-04-21'
  effort: low
  user-invocable: 'true'
  compatibility: Requires requests, loguru, scripts/database_manager.py
---
# AlphaEar News Skill

## Purpose

This skill is the **ingest layer** for live financial news.

```
[Internet: Reuters / Bloomberg / FT / CNBC / Nikkei / WSJ ...]
        ↓  alphaear-news fetches & writes
[local daily_news DB]
        ↓  alphaear-search (engine='local') queries
[Analysis / investment-lens / alphaear-reporter]
```

**This skill writes. `alphaear-search` reads.**
Do not confuse the two directions.

## Do Not Use

- To query already-stored news → use `alphaear-search (engine='local')`.
- For sentiment scoring → use `alphaear-sentiment`.
- For OHLCV price data → use `alphaear-stock`.

## Capabilities

### 1. Fetch Hot News & Trends

Use `scripts/news_tools.py` via `NewsNowTools`:

- `fetch_hot_news(source_id, count)` — fetch from one source, write to DB.
  - Valid `source_id` values: see `references/sources.md`.
  - Examples: `reuters`, `bloomberg`, `ft`, `cnbc`, `nikkei`, `wsj`.
- `get_unified_trends(sources)` — aggregate top headlines from multiple sources.

Both methods persist fetched items to the `daily_news` table in the local DB.
If a source is unreachable or returns non-200, log the failure, skip that source, and continue with remaining sources.

### 2. Prediction Markets

Use `scripts/news_tools.py` via `PolymarketTools`:

- `get_market_summary(limit)` — formatted report of active Polymarket contracts.

## Available Scripts

- `scripts/news_tools.py` — `NewsNowTools` (fetch/write news) and `PolymarketTools` (prediction markets). Non-interactive; pass `source_id` and `count` as arguments.

## Dependencies

- `requests`, `loguru`
- `scripts/database_manager.py` — writes to `daily_news` table
