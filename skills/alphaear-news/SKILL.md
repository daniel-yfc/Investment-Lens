---
name: alphaear-news
description: >
  Fetch hot finance news, unified trends, and prediction market data from global
  sources. Use when the user needs real-time financial news, trend reports from
  international and regional finance sources (Reuters, Bloomberg, FT, CNBC,
  Nikkei Asia, WSJ, etc.), or Polymarket finance prediction data. Do NOT use
  for sentiment analysis or stock price retrieval — use alphaear-sentiment or
  alphaear-stock instead.
compatibility: Requires requests, loguru, internet access to news APIs, scripts/database_manager.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[news fetch | trend report | Polymarket | source_id]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar News Skill

## Overview

Fetch real-time hot news from global finance sources, generate unified trend reports, and retrieve Polymarket prediction data.

## Capabilities

### 1. Fetch Hot News & Trends

Use `scripts/news_tools.py` via `NewsNowTools`.

- `fetch_hot_news(source_id, count)`: Fetch news from a specific source.
  - See [references/sources.md](references/sources.md) for valid `source_id`s (e.g., `reuters`, `bloomberg`, `nikkei`).
- `get_unified_trends(sources)`: Aggregate top news from multiple global sources.

### 2. Fetch Prediction Markets

Use `scripts/news_tools.py` via `PolymarketTools`.

- `get_market_summary(limit)`: Returns a formatted report of active global prediction markets.

## Dependencies

- `requests`, `loguru`
- `scripts/database_manager.py` (local DB cache)
