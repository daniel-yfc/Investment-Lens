---
name: quant-analysis
description: >
  Use this skill only when the user, or investment-lens, explicitly requires
  Python/Jupyter-based quantitative finance analysis. This includes portfolio
  optimization, econometric modeling, factor analysis, volatility modeling, risk
  estimation, Value-at-Risk, Conditional VaR, Monte Carlo simulation, and
  statistical backtesting. Do NOT use for qualitative investment interpretation,
  portfolio diagnostics that can be handled conceptually, report writing, quote
  refreshes, or general narrative market commentary.
compatibility: Requires Python 3.9+, pandas, numpy, scipy, statsmodels, arch, riskfolio-lib; Jupyter notebook environment recommended
allowed-tools: Read Grep Bash(python*) Bash(jupyter*)
metadata:
  argument-hint: "[VaR | optimization | regression | Monte Carlo | backtest]"
  version: "1.1"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
  post-invoke-check: "Return structured quant output for reintegration into investment-lens"
---

# Quant Analysis

## Purpose

Specialized quantitative engine for the broader investment workflow. Runs formal quantitative analysis and returns structured results for interpretation by `investment-lens`.

## Do Not Use

- Basic qualitative stock analysis.
- Narrative valuation framing.
- General portfolio commentary without statistical requirements.
- Report writing or investor communication.
- Quote refreshes.

## Trigger Conditions

Use only when the task explicitly requires one or more of:
portfolio optimization, VaR/CVaR, Monte Carlo simulation, risk decomposition,
factor regressions, volatility modeling, time-series analysis, backtesting,
or statistical validation.

## Gotchas

- Always state the lookback period explicitly. Changing from 1Y to 3Y data can flip VaR results by 30–40%.
- `riskfolio-lib` optimisation silently drops assets with zero variance. Check for zero-vol assets before running.
- GARCH models require >100 observations to be reliable. Reject requests with shorter series.
- CVaR at 99% from <500 daily observations has very high estimation error — state this limitation.
- Return structured output with `reintegration_note` field. `investment-lens` will not reintegrate without it.

## Required Input Schema

Expect or construct:
- `objective`, `tickers`, `portfolio_weights`, `base_currency`
- `benchmark`, `lookback_period`, `risk_free_proxy`
- `model_type`, `constraints`, `valid_as_of`

If required inputs are missing, ask for them or state assumptions clearly.

Load `references/input-schema.md` for full schema detail.

## Supported Analysis Modes

### Mode A — Risk Analysis
Historical volatility, drawdown, VaR/CVaR, stress framing, correlation and concentration diagnostics.

### Mode B — Optimization
Mean-variance, Black-Litterman, risk parity, equal risk contribution, constraint-aware construction.

### Mode C — Statistical Modeling
Factor exposure, rolling regression, event studies, GARCH-family volatility, econometric validation.

### Mode D — Simulation and Backtesting
Monte Carlo, strategy comparison, parameter sensitivity, historical backtests with stated limitations.

## Execution Rules

**Always:** state assumptions before results; use explicit lookback periods; state data limitations; return structured outputs; distinguish descriptive from predictive statistics.

**Never:** present model output as certainty; hide parameter choices; extrapolate beyond model scope without warning.

## Output Schema

Return results in this structure:
```
analysis_type | objective | inputs_used | assumptions
summary_statistics | model_output | risk_findings
limitations | valid_as_of | reintegration_note
```

Where relevant, include: `optimized_weights`, `var`, `cvar`, `beta`, `factor_exposures`, `drawdown`, `scenario_results`.

Load `references/output-schema.md` for full schema detail.

## Integration Back to investment-lens

When used as sub-analysis engine:
- Return conclusions in structured form with `reintegration_note`.
- Avoid final portfolio/investment recommendations unless explicitly requested.
- Leave interpretive judgment to `investment-lens`.
- Phrase implications as: “Quantitative implication.” / “Model-based indication.” / “Statistical signal.”

## References

Load when needed:
- `references/input-schema.md`
- `references/output-schema.md`
- `references/model-selection.md`
