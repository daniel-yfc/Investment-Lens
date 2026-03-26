---
name: alphaear-news
description: Fetch and ingest live financial news from global sources into the local
  database.
allowed-tools:
- Read
- Bash
metadata:
  argument-hint: '[news fetch | trend report | Polymarket | source_id]'
  version: '2.0'
  language: zh-tw
  last-updated: '2026-03-26'
  effort: low
  user-invocable: 'true'
  downstream-skill: alphaear-search (engine='local')
  compatibility: Requires requests, loguru, internet access to news APIs, scripts/database_manager.py
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

### 2. Prediction Markets

Use `scripts/news_tools.py` via `PolymarketTools`:

- `get_market_summary(limit)` — formatted report of active Polymarket contracts.

## Dependencies

- `requests`, `loguru`
- `scripts/database_manager.py` — writes to `daily_news` table
