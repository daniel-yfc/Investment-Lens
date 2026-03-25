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
allowed-tools: Read Grep
metadata:
  argument-hint: "[VaR | optimization | regression | Monte Carlo | backtest]"
  effort: "high"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
  post-invoke-check: "Return structured quant output for reintegration"
---

# Quant Analysis

## Purpose

Use this skill as the specialized quantitative engine for the broader investment workflow.

This skill does not replace the main investment judgment layer. Its job is to run formal quantitative analysis and return structured results that can be interpreted by `investment-lens`.

## Do not use

Do not use this skill for:
- Basic qualitative stock analysis.
- Narrative valuation framing.
- General portfolio commentary without statistical requirements.
- Report writing or investor communication.
- Quote refreshes.

## Trigger conditions

Use this skill only when the task explicitly requires one or more of:
- Portfolio optimization.
- VaR or CVaR.
- Monte Carlo simulation.
- Risk decomposition.
- Factor regressions.
- Volatility modeling.
- Time-series analysis.
- Backtesting.
- Statistical validation of a portfolio or security claim.

If the task can be answered by conceptual analysis, do not activate this skill.

## Required input schema

Expect or construct the following fields:
- `objective`
- `tickers`
- `portfolio_weights`
- `base_currency`
- `benchmark`
- `lookback_period`
- `risk_free_proxy`
- `model_type`
- `constraints`
- `valid_as_of`

If required inputs are missing, ask for them or state the assumptions clearly.

## Supported analysis modes

### Mode A — Risk analysis
Use for:
- Historical volatility.
- Drawdown.
- VaR and CVaR.
- Stress framing.
- Correlation and concentration diagnostics.

### Mode B — Optimization
Use for:
- Mean-variance optimization.
- Black-Litterman.
- Risk parity.
- Equal risk contribution.
- Constraint-aware portfolio construction.

### Mode C — Statistical modeling
Use for:
- Factor exposure analysis.
- Rolling regression.
- Event studies.
- GARCH-family volatility modeling.
- Econometric validation.

### Mode D — Simulation and backtesting
Use for:
- Monte Carlo simulation.
- Strategy comparison.
- Parameter sensitivity tests.
- Historical backtests with clearly stated limitations.

## Execution rules

Always:
- State assumptions before results.
- Use explicit lookback periods.
- State data limitations.
- Return structured outputs.
- Distinguish descriptive statistics from predictive claims.

Never:
- Present model output as certainty.
- Hide parameter choices.
- Extrapolate beyond the model’s scope without warning.

## Output schema

Return results in this structure:

- `analysis_type`
- `objective`
- `inputs_used`
- `assumptions`
- `summary_statistics`
- `model_output`
- `risk_findings`
- `limitations`
- `valid_as_of`

Where useful, include:
- `optimized_weights`
- `var`
- `cvar`
- `beta`
- `factor_exposures`
- `drawdown`
- `scenario_results`

## Integration back to investment-lens

When this skill is used as a sub-analysis engine:
- Return conclusions in structured form.
- Avoid final portfolio or investment recommendations unless explicitly requested.
- Leave the final interpretive judgment to `investment-lens`.

If a recommendation is unavoidable, phrase it as:
- “Quantitative implication.”
- “Model-based indication.”
- “Statistical signal.”
Not as a standalone final investment decision.

## References

Read when needed:
- `references/input-schema.md`
- `references/output-schema.md`
- `references/model-selection.md`