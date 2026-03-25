---
name: alphaear-stock
description: >
  Search global stock tickers and retrieve raw historical OHLCV price data.
  Supports all major exchanges via yfinance (US, TW, HK, JP, KR, EU, etc.).
  Use only when the user explicitly requests raw historical price data, specific
  stock codes, or raw daily price changes. Do NOT use for qualitative investment
  analysis, earnings deep-dives, or buy/sell/hold evaluation — use investment-lens
  instead.
compatibility: Requires pandas, yfinance, requests, scripts/database_manager.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[ticker | stock name | 'price AAPL 2024-01-01 2024-12-31']"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar Stock Skill

## Overview

Search global stock tickers and retrieve historical OHLCV price data.
All markets are handled via **yfinance**, which supports global exchanges through
standard Yahoo Finance ticker suffixes.

## Ticker Format

| Market | Format | Example |
|--------|--------|---------|
| US equities | Plain | `AAPL`, `TSLA` |
| Taiwan (TWSE) | `.TW` | `2330.TW` |
| Taiwan (OTC) | `.TWO` | `6443.TWO` |
| Hong Kong | `.HK` | `0700.HK`, `00700.HK` |
| Japan | `.T` | `7203.T` |
| South Korea | `.KS` | `005930.KS` |
| UK | `.L` | `SHEL.L` |
| Germany | `.DE` | `SAP.DE` |
| Singapore | `.SI` | `D05.SI` |

For tickers without a suffix, yfinance defaults to US markets.

## Capabilities

### 1. Stock Search & Data

Use `scripts/stock_tools.py` via `StockTools`.

- `search_ticker(query, exchange_hint)`: Fuzzy search by name or code.
  - `exchange_hint`: optional string, e.g. `"TW"`, `"HK"`, `"JP"` — used to resolve ambiguous names.
  - Returns: `List[{code, name}]`
- `get_stock_price(ticker, start_date, end_date)`: Returns DataFrame with OHLCV + `change_pct`.
  - Date format: `"YYYY-MM-DD"`
  - Ticker must include exchange suffix for non-US markets.

## Dependencies

- `pandas`, `yfinance`, `requests`
- `scripts/database_manager.py` (local SQLite cache)
