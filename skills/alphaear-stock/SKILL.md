---
name: alphaear-stock
description: Search A-Share/HK/US finance stock tickers and retrieve raw historical stock price data (OHLCV). Use only when the user explicitly requests raw historical price data, specific stock codes, or raw daily price changes. Do NOT use for qualitative investment analysis, deep-dive earnings reviews, or evaluating a stock's buy/sell/hold potential (use investment-lens instead).
---

# AlphaEar Stock Skill

## Overview

Search A-Share/HK/US stock tickers and retrieve historical price data (OHLCV).

## Capabilities

### 1. Stock Search & Data

Use `scripts/stock_tools.py` via `StockTools`.

-   **Search**: `search_ticker(query)`
    -   Fuzzy search by code or name (e.g., "Moutai", "600519").
    -   Returns: List of `{code, name}`.
-   **Get Price**: `get_stock_price(ticker, start_date, end_date)`
    -   Returns DataFrame with OHLCV data.
    -   Dates format: "YYYY-MM-DD".

## Dependencies

-   `pandas`, `requests`, `akshare`, `yfinance`
-   `scripts/database_manager.py` (stock tables)
