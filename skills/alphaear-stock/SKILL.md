---
name: alphaear-stock
description: >
  Search A-Share/HK stock tickers (via akshare) and US stock tickers (via yfinance),
  and retrieve raw historical price data (OHLCV). Use only when the user explicitly
  requests raw historical price data, specific stock codes, or raw daily price changes.
  Do NOT use for qualitative investment analysis, earnings deep-dives, or buy/sell/hold
  evaluation — use investment-lens instead.
compatibility: Requires pandas, requests, akshare (A-Share/HK), yfinance (US), scripts/database_manager.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[ticker | stock name | 'price AAPL 2024-01-01 2024-12-31']"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar Stock Skill

## Overview

Search A-Share/HK/US stock tickers and retrieve historical OHLCV price data.

- **A-Share / HK**: powered by `akshare`
- **US equities**: powered by `yfinance`

## Capabilities

### 1. Stock Search & Data

Use `scripts/stock_tools.py` via `StockTools`.

- `search_ticker(query)`: Fuzzy search by code or name (e.g., `"Moutai"`, `"600519"`).
  - Returns: `List[{code, name}]`
- `get_stock_price(ticker, start_date, end_date)`: Returns DataFrame with OHLCV data.
  - Date format: `"YYYY-MM-DD"`

## Dependencies

- `pandas`, `requests`, `akshare`, `yfinance`
- `scripts/database_manager.py` (stock tables)
