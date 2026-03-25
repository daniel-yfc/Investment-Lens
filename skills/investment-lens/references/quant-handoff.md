
## `skills/investment-lens/references/quant-handoff.md`

# Quant Analysis Handoff Protocol

## Purpose

This file defines when and how to hand off work to `quant-analysis`, and how to
reintegrate quantitative results back into the main investment-lens conclusion.

Do not activate `quant-analysis` unless the task explicitly requires one of the
conditions listed below.

---

## Trigger conditions for handoff

Escalate to `quant-analysis` only when the user or context explicitly requires:

| Trigger | Examples |
|---|---|
| Portfolio optimization | Mean-variance, Black-Litterman, risk parity, ERC |
| Risk estimation | VaR, CVaR, conditional drawdown |
| Simulation | Monte Carlo, scenario stress |
| Statistical modeling | Factor regression, Fama-MacBeth, GARCH, event study |
| Programmatic backtesting | Strategy performance vs. benchmark |
| Time-series econometrics | Rolling regression, autocorrelation, structural break |

If the task can be addressed with conceptual reasoning, do not escalate.

---

## Handoff request schema

When creating a handoff request, construct the following fields:

```json
{
  "objective": "Describe the specific analytical goal",
  "model_type": "optimization | var | monte_carlo | factor | backtest | other",
  "tickers": ["AAPL", "2330.TW"],
  "portfolio_weights": [0.4, 0.6],
  "base_currency": "USD | TWD | HKD",
  "benchmark": "SPY | 0050.TW | custom",
  "lookback_period": "3Y | 5Y | 10Y | custom",
  "risk_free_proxy": "US 3M T-bill | TW 1Y government bond | other",
  "constraints": "describe any constraints e.g. max weight 30%, no leverage",
  "confidence_interval": "0.95 | 0.99",
  "scenario_description": "optional — describe stress scenario if relevant",
  "valid_as_of": "YYYY-MM-DD"
}
```

---

## Reintegration rules

When `quant-analysis` returns results, apply these rules before using them in the
final output:

1. **Do not let model output replace judgment.** Statistical findings are one input
   among several, not the final decision.

2. **State all model assumptions** that came back from `quant-analysis` before
   presenting results.

3. **Translate model language into plain language.** Users should not need to
   understand GARCH or CVaR to follow the recommendation.

4. **Surface limitations explicitly.** If the model used a short lookback, state
   that results may not capture a full market cycle.

5. **Link back to the qualitative thesis.** If the quant result contradicts the
   qualitative reading, say so explicitly and let the user weigh both.

---

## Reintegration output format

After receiving quant results, structure the final output as:

```
## Quantitative findings
[Plain-language summary of model output]

## Assumptions used
[Lookback, risk-free rate, benchmark, constraints, confidence interval]

## What the model suggests
[Optimized weights / risk estimate / statistical finding]

## Limitations
[Data limitations, model constraints, out-of-sample caveat]

## How this affects the investment view
[Integration with qualitative thesis from investment-lens]
```

---

## Gotchas

- VaR underestimates tail risk by construction. Always pair with CVaR or a stress
  narrative.
- Mean-variance optimization is highly sensitive to expected return inputs. If the
  user provides no return views, flag that the output is driven almost entirely by
  the covariance matrix.
- Backtests overfit. Clearly state that historical performance does not imply future
  results, especially when the strategy was designed using the same historical period.
- For TWD-based portfolios, use Taiwan 1-year government bond yield as the risk-free
  rate default. For USD portfolios, use US 3-month T-bill.
