---
name: alphaear-stock
description: >
  Retrieve raw historical OHLCV price data for global stocks and ETFs via
  yfinance. Use only when the task explicitly requires a historical price
  series (open, high, low, close, volume) for analysis, charting, backtesting,
  or quantitative modelling inputs. Supports all major exchanges via Yahoo
  Finance ticker suffixes (US plain, Taiwan .TW/.TWO, HK .HK, Japan .T,
  Korea .KS, Singapore .SI, Europe .L/.DE/.PA, etc.).
  Do NOT use to refresh current portfolio prices or update value_date in a CSV
  — use update-quote for that. Do NOT use for qualitative investment analysis
  or buy/sell/hold judgment — use investment-lens for that.
compatibility: Requires pandas, yfinance, scripts/database_manager.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[ticker | 'price AAPL 2024-01-01 2024-12-31' | '2330.TW']"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar Stock Skill

## Purpose

Fetch raw historical OHLCV price data from Yahoo Finance for any globally
listed stock or ETF. Data is cached locally in SQLite to avoid redundant fetches.

**This skill provides data only. It does not analyse, recommend, or refresh CSV portfolios.**

## Boundary with `update-quote`

| Dimension | `alphaear-stock` | `update-quote` |
|-----------|-----------------|----------------|
| **Purpose** | Provide historical OHLCV series for analysis/modelling | Refresh current prices in a portfolio CSV |
| **Output** | DataFrame (date, open, high, low, close, volume, change_pct) | Updated CSV with recalculated TWD values + new `value_date` |
| **Writes to CSV?** | ❌ No | ✅ Yes |
| **Updates `value_date`?** | ❌ No | ✅ Yes |
| **Typical caller** | `investment-lens`, `quant-analysis`, `alphaear-predictor` | User directly, or after `investment-lens` flags stale data |

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
  - Date format: `'YYYY-MM-DD'`.
  - Defaults: 90 days to today.

## Dependencies

- `pandas`, `yfinance`
- `scripts/database_manager.py` — local SQLite cache
