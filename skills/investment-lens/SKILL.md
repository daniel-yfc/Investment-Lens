---
name: investment-lens
description: >
  Use this skill for qualitative and conceptual investment analysis of single stocks,
  ETFs, indices, cryptocurrencies, portfolio diagnostics, rebalancing review, and
  personal allocation guidance. Use when the user asks for ticker analysis, portfolio
  review, All-Seasons mapping, concentration checks, qualitative valuation framing,
  retirement allocation, or goal-based asset allocation. Do NOT use for raw quote
  refreshes or value_date updates (use update-quote), or for Python/Jupyter-based
  quantitative modeling, portfolio optimization, econometrics, Monte Carlo simulation,
  or advanced statistical risk modeling (use quant-analysis).
compatibility: No special runtime dependencies; reads references/ and assets/ as needed
allowed-tools: Read Grep WebSearch
metadata:
  argument-hint: "[ticker | portfolio-csv | portfolio review | retirement allocation]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  post-invoke-check: "Confirm bias and allocation checklist were applied"
---

# Investment Lens

## Purpose

Use this skill as the primary investment-analysis hub for:
- Single-stock analysis.
- ETF, index, and crypto review.
- Portfolio diagnostics and rebalancing.
- Personal allocation and retirement-oriented asset allocation.

This skill is the main decision and interpretation layer. It converts raw holdings, market context, and user objectives into an actionable investment view.

## Do not use

- Quote refreshes, FX refreshes, or updating `value_date` → use `update-quote`.
- Programmatic portfolio optimization, Monte Carlo simulation, GARCH, VaR/CVaR engines, factor regressions, or statistical backtesting → use `quant-analysis`.
- Non-investment tasks.

## Mode selection

Classify the task into one of these modes before analysis:

### Mode A — Security analysis
For single stocks, ETFs, indices, crypto, qualitative valuation.

Load as needed:
- `references/asset-classification.md`
- `references/tech-earnings-deepdive.md`
- `references/market-asset-analysis.md`
- `references/investing-philosophies.md`
- `references/investing-philosophies-ref.md`
- `references/valuation-models.md`
- `references/macro-liquidity.md`
- `references/bias-checklist.md`
- `references/market-bias-checklist.md`

### Mode B — Portfolio diagnostics
For portfolio review, rebalancing, concentration checks, All-Seasons mapping, drift analysis.

Load as needed:
- `references/asset-classification.md`
- `references/all-seasons-portfolio.md`
- `assets/portfolio-template.md`
- `references/market-bias-checklist.md`

### Mode C — Personal allocation
For retirement allocation, goal-based allocation, risk-tolerance-based asset mix.

Load:
- `references/personal-allocation.md`
- `assets/allocation-template.md`

If the user gives incomplete personal constraints, request: time horizon, base currency, income stability, liquidity need, risk tolerance, existing holdings, target use of capital.

## Step 0 — Data integrity gate

1. Check whether holdings/portfolio inputs include `value_date`.
2. If data is stale, warn clearly.
3. If quotes need refresh, instruct use of `update-quote` before proceeding.
4. If user chooses to proceed on stale data, mark analysis clearly as reference-only.

## Step 1 — Input normalization

Normalize user input into one of:
- `security_request`
- `portfolio_request`
- `personal_allocation_request`

Minimum fields: ticker or holdings list, base currency, valid-as-of date, user objective, time horizon.

## Step 2 — Core analysis

### For security analysis
- Identify asset class and context. Frame thesis. Separate thesis, counter-thesis, and risks. Use scenario framing.

### For portfolio diagnostics
- Evaluate concentration, diversification, regime exposure, drift. Map into portfolio buckets. Identify rebalance pressure.

### For personal allocation
- Translate user goals into asset-allocation logic. Prioritize suitability, liquidity, time horizon. Explain trade-offs.

## Step 3 — Quant handoff decision

Escalate to `quant-analysis` only if the task explicitly requires: mean-variance optimization, Black-Litterman, risk parity, VaR/CVaR, Monte Carlo, factor modeling, or backtesting.

When escalating, create a structured request with: objective, tickers, weights, benchmark, base currency, lookback period, risk-free proxy, model type.

Then read: `references/quant-handoff.md`

## Step 4 — Bias and risk discipline

Before finalizing: run relevant bias checklist, state key risks, define monitoring conditions, define three measurable kill conditions.

Minimum output: Red flags, Yellow flags, Green confirmations.

## Step 5 — Output rules

Every output must:
- Lead with the recommendation or core judgment.
- State confidence level and valid-as-of date.
- Separate facts, assumptions, and interpretation.
- Distinguish long-term allocation advice from short-term views.
- If personal allocation discussed, state output is an analytical framework, not regulated advice.

## References

Core:
- `references/asset-classification.md`
- `references/all-seasons-portfolio.md`
- `references/valuation-models.md`
- `references/personal-allocation.md`
- `references/quant-handoff.md`

Templates:
- `assets/portfolio-template.md`
- `assets/allocation-template.md`
