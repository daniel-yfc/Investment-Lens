---
name: quant-analysis-input-schema
description: quant-analysis 標準輸入欄位定義
version: 1.0
last_updated: 2026-03-25
---

# Quant Analysis — Input Schema

## Purpose

This file defines the standard input fields for `quant-analysis`. When receiving
a handoff from `investment-lens` or a direct user request, construct input using
this schema before beginning analysis.

---

## Core Input Fields

```json
{
  "objective": {
    "type": "string",
    "required": true,
    "description": "Describe the specific analytical goal in plain language.",
    "example": "Estimate 1-year VaR at 95% confidence for a TWD-denominated equity portfolio."
  },
  "model_type": {
    "type": "enum",
    "required": true,
    "values": ["var", "cvar", "drawdown", "optimization", "black_litterman", "risk_parity", "factor", "rolling_regression", "garch", "event_study", "monte_carlo", "backtest", "correlation", "other"],
    "description": "Primary model or method to be applied."
  },
  "tickers": {
    "type": "array of strings",
    "required": true,
    "description": "List of ticker symbols. Use standard exchange suffixes where applicable.",
    "example": ["0050.TW", "VOO", "00720B.TW", "BTC-USD"]
  },
  "portfolio_weights": {
    "type": "array of floats",
    "required": false,
    "description": "Current or target portfolio weights corresponding to tickers. Must sum to 1.0. If omitted, equal-weight is assumed.",
    "example": [0.40, 0.30, 0.20, 0.10]
  },
  "base_currency": {
    "type": "enum",
    "required": true,
    "values": ["TWD", "USD", "EUR", "HKD", "AUD", "GBP", "JPY", "other"],
    "description": "Base currency for all portfolio calculations and reporting."
  },
  "benchmark": {
    "type": "string",
    "required": false,
    "description": "Benchmark ticker or index for comparison.",
    "example": "0050.TW, SPY, MSCI World"
  },
  "lookback_period": {
    "type": "string",
    "required": true,
    "description": "Historical data period for analysis.",
    "format": "[N]Y for years, [N]M for months, or ISO date range YYYY-MM-DD:YYYY-MM-DD",
    "example": "5Y"
  },
  "risk_free_proxy": {
    "type": "string",
    "required": false,
    "description": "Risk-free rate proxy. Defaults to Taiwan 1Y gov bond for TWD, US 3M T-bill for USD.",
    "example": "TW 1Y government bond, US 3M T-bill"
  },
  "confidence_interval": {
    "type": "float",
    "required": false,
    "default": 0.95,
    "description": "Confidence level for VaR, CVaR calculations.",
    "valid_range": [0.90, 0.99]
  },
  "constraints": {
    "type": "string",
    "required": false,
    "description": "Plain-language description of any portfolio constraints.",
    "example": "Max single position 30%. No leverage. No short selling. TWD-hedged only."
  },
  "return_frequency": {
    "type": "enum",
    "required": false,
    "default": "daily",
    "values": ["daily", "weekly", "monthly"],
    "description": "Frequency of return data to use."
  },
  "scenario_description": {
    "type": "string",
    "required": false,
    "description": "For stress tests or scenario analysis, describe the scenario.",
    "example": "2022 rate-hike environment: 10Y UST yield rises 300bps over 12 months."
  },
  "user_views": {
    "type": "array of objects",
    "required": false,
    "description": "For Black-Litterman only. List of user views with confidence.",
    "example": [
      {"asset": "0050.TW", "view": "outperform", "magnitude": 0.05, "confidence": 0.70},
      {"asset": "00720B.TW", "view": "underperform", "magnitude": 0.02, "confidence": 0.50}
    ]
  },
  "valid_as_of": {
    "type": "date",
    "required": true,
    "format": "YYYY-MM-DD",
    "description": "The date as of which input data is current. Used to validate data freshness."
  }
}
```

---

## Validation Rules

| Rule | Check |
|------|-------|
| `portfolio_weights` must sum to 1.0 | Reject if deviation > 0.001 |
| `tickers` and `portfolio_weights` must have same length | Reject if mismatch |
| `confidence_interval` must be between 0.90 and 0.99 | Reject otherwise |
| `valid_as_of` must not be in the future | Warn if data may be stale |
| `lookback_period` must meet minimum for model type | See `references/model-selection.md` |

---

## Missing Field Handling

| Field | If Missing |
|-------|------------|
| `portfolio_weights` | Assume equal weight; state assumption explicitly |
| `benchmark` | Omit benchmark comparison from output |
| `risk_free_proxy` | Use default for `base_currency`; state assumption |
| `confidence_interval` | Default to 0.95; state assumption |
| `return_frequency` | Default to daily; state assumption |
| `constraints` | Assume unconstrained; state assumption |
| `scenario_description` | Skip scenario analysis |
| `user_views` | Required for Black-Litterman; request if missing |

Always state all assumptions used before presenting results.
