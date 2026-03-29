---
name: alphaear-stock
description: Use this skill when raw historical OHLCV price data for a stock or ETF is needed for analysis, validation, or downstream quantitative modelling. Use it for date-ranged price retrieval for any globally listed equity or ETF. Do not use it for refreshing portfolio CSV prices (use update-quote), for live news (use alphaear-news), or for investment interpretation (use investment-lens).
---

# AlphaEar Stock Skill

## Purpose

Fetch raw historical OHLCV price data from Yahoo Finance for any globally listed stock or ETF.
Data is cached locally in SQLite to avoid redundant fetches.

**This skill provides data only. It does not analyse, recommend, or refresh CSV portfolios.**

## Boundary with `update-quote`

| Dimension | `alphaear-stock` | `update-quote` |
|-----------|-----------------|----------------|
| **Purpose** | Historical OHLCV series for analysis/modelling | Refresh current prices in a portfolio CSV |
| **Output** | DataFrame (date, open, high, low, close, volume, change_pct) | Updated CSV with recalculated TWD values + new `value_date` |
| **Writes to CSV?** | ❌ No | ✅ Yes |
| **Updates `value_date`?** | ❌ No | ✅ Yes |

## Ticker Format

| Market | Format | Example |
|--------|--------|---------| 
| US equities | Plain | `AAPL`, `TSLA` |
| Taiwan (TWSE) | `.TW` | `2330.TW` |
| Taiwan (OTC) | `.TWO` | `6443.TWO` |
| Hong Kong | `.HK` | `0700.HK` |
| Japan | `.T` | `7203.T` |
| South Korea | `.KS` | `005930.KS` |
| UK | `.L` | `SHEL.L` |
| Germany | `.DE` | `SAP.DE` |
| Singapore | `.SI` | `D05.SI` |

## API

Use `scripts/stock_tools.py` via `StockTools`:

- `search_ticker(query, exchange_hint)` — fuzzy search by name or code.
  - `exchange_hint`: optional string, e.g. `'TW'`, `'HK'`, `'JP'`.
  - Returns: `List[{code, name}]`
- `get_stock_price(ticker, start_date, end_date)` — returns DataFrame.
  - Ticker must include exchange suffix for non-US markets.
  - Date format: `'YYYY-MM-DD'`. Defaults: 90 days to today.

## Available Scripts

- `scripts/stock_tools.py` — main entry point via `StockTools` class. Non-interactive; pass all arguments as parameters.

## Gotchas

- Yahoo Finance rate-limits aggressive fetching. Space calls > 0.5 s apart. If `429` is returned, wait 10 s and retry once.
- Taiwan OTC tickers use `.TWO`, **not** `.TW`. Common mistake: `6443.TW` returns empty; correct is `6443.TWO`.
- `yfinance` silently returns empty DataFrame for delisted or invalid tickers instead of raising an error. Always check `df.empty` before proceeding.
- SQLite cache may return stale data if the cached entry is from a prior trading session. Check cache timestamp against `valid_as_of` before using cached results in live analysis.
- `change_pct` in the returned DataFrame is calculated as day-over-day close. It is **not** adjusted for dividends or splits unless `auto_adjust=True` is passed (default: off).

## Dependencies

- `pandas`, `yfinance`
- `scripts/database_manager.py` — local SQLite cache
