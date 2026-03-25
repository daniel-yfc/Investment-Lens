---
name: quant-analysis-output-schema
description: quant-analysis 標準輸出欄位定義，供 investment-lens reintegration 使用
version: 1.0
last_updated: 2026-03-25
---

# Quant Analysis — Output Schema

## Purpose

This file defines the standard output structure for `quant-analysis`. Results should
always be returned in this format to enable consistent reintegration by `investment-lens`
or direct presentation to the user.

---

## Standard Output Structure

```json
{
  "analysis_type": "[model_type as defined in input-schema]",
  "objective": "[restated from input]",
  "valid_as_of": "YYYY-MM-DD",
  "inputs_used": {
    "tickers": ["..."],
    "weights": [0.0],
    "base_currency": "...",
    "lookback_period": "...",
    "benchmark": "...",
    "risk_free_proxy": "...",
    "confidence_interval": 0.95,
    "return_frequency": "daily",
    "constraints": "..."
  },
  "assumptions": [
    "[List every assumption made, including defaults applied]"
  ],
  "summary_statistics": {
    "annualized_return": null,
    "annualized_volatility": null,
    "sharpe_ratio": null,
    "max_drawdown": null,
    "calmar_ratio": null,
    "skewness": null,
    "kurtosis": null
  },
  "model_output": {
    "var": null,
    "cvar": null,
    "optimized_weights": null,
    "factor_exposures": null,
    "scenario_results": null,
    "equity_curve": null,
    "other": null
  },
  "risk_findings": [
    "[Plain-language summary of key risk findings]"
  ],
  "limitations": [
    "[Explicit list of data or model limitations]"
  ],
  "reintegration_note": "[One paragraph for investment-lens: what the quant output implies for the investment view, framed as a quantitative implication, not a final recommendation]"
}
```

---

## Field Definitions

### `summary_statistics`

| Field | Unit | Notes |
|-------|------|-------|
| `annualized_return` | % | Arithmetic or geometric; state which |
| `annualized_volatility` | % | Annualized standard deviation of returns |
| `sharpe_ratio` | ratio | (Return − Risk-Free) / Volatility |
| `max_drawdown` | % | Peak-to-trough maximum loss |
| `calmar_ratio` | ratio | Annualized Return / Max Drawdown |
| `skewness` | float | Negative = left-skewed (tail risk) |
| `kurtosis` | float | Excess kurtosis; > 0 = fat tails |

### `model_output` — by analysis type

**VaR / CVaR**:
```json
{
  "var": {"value": -0.08, "confidence": 0.95, "horizon_days": 252},
  "cvar": {"value": -0.13, "confidence": 0.95, "horizon_days": 252}
}
```

**Optimization**:
```json
{
  "optimized_weights": [
    {"ticker": "0050.TW", "weight": 0.35},
    {"ticker": "00720B.TW", "weight": 0.40},
    {"ticker": "VOO", "weight": 0.25}
  ],
  "efficient_frontier_note": "[Optional: describe location on efficient frontier]"
}
```

**Factor Exposure**:
```json
{
  "factor_exposures": [
    {"factor": "Market (Beta)", "loading": 0.92, "t_stat": 18.4, "significant": true},
    {"factor": "Size (SMB)", "loading": -0.15, "t_stat": -1.2, "significant": false},
    {"factor": "Value (HML)", "loading": 0.08, "t_stat": 0.7, "significant": false}
  ],
  "alpha": {"annualized": 0.012, "t_stat": 0.9, "significant": false},
  "r_squared": 0.88
}
```

**Monte Carlo**:
```json
{
  "scenario_results": {
    "simulations_run": 10000,
    "horizon_years": 30,
    "percentile_10": -0.15,
    "percentile_25": 0.22,
    "percentile_50": 0.85,
    "percentile_75": 1.80,
    "percentile_90": 3.20,
    "probability_of_ruin": 0.04
  }
}
```

---

## Reintegration Note Guidelines

The `reintegration_note` field is the bridge back to `investment-lens`. Write it as:

- One short paragraph.
- Start with: "The quantitative analysis suggests..." or "Based on the model output..."
- State what the numbers imply for the investment view.
- Do not make a final investment recommendation — that is `investment-lens`'s role.
- Flag if the quantitative output contradicts the qualitative thesis.
- Flag any major limitations that should affect how much weight to place on the result.

**Example**:
> The quantitative analysis suggests the current portfolio carries a 1-year VaR of
> approximately 18% at the 95% confidence level, driven primarily by equity concentration.
> CVaR in the worst 5% of scenarios averages −27%, indicating meaningful left-tail risk.
> This is consistent with the qualitative assessment that the portfolio is overweight
> growth assets relative to its stated moderate risk tolerance. The main limitation is
> the 3-year lookback, which does not capture a full interest-rate cycle.

---

## Mandatory Output Rules

- Always populate `assumptions` with every assumption made, including defaults.
- Always populate `limitations` with at least one item.
- Always include `valid_as_of` in the output.
- Never leave `reintegration_note` empty when the output is destined for `investment-lens`.
- Round `summary_statistics` to 2 decimal places for percentages, 2–3 for ratios.
- If a field is not applicable to the analysis type, set to `null` explicitly (do not omit).
