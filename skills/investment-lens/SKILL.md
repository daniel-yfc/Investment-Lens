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
allowed-tools: Read Grep WebSearch
metadata:
  argument-hint: "[ticker | portfolio-csv | portfolio review | retirement allocation]"
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

This skill is the main decision and interpretation layer. It is responsible for converting raw holdings, market context, and user objectives into an actionable investment view.

## Do not use

Do not use this skill for:
- Quote refreshes, FX refreshes, or updating `value_date`; use `update-quote`.
- Programmatic portfolio optimization, Monte Carlo simulation, GARCH, VaR/CVaR engines, factor regressions, or statistical backtesting; use `quant-analysis`.
- Non-investment tasks.

## Mode selection

Classify the task into one of these modes before analysis:

### Mode A — Security analysis
Use for:
- Single stocks.
- ETFs and indices.
- Crypto assets.
- Qualitative valuation and thesis review.

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
Use for:
- Portfolio review.
- Rebalancing logic.
- Concentration checks.
- All-Seasons mapping.
- Allocation drift analysis.

Load as needed:
- `references/asset-classification.md`
- `references/all-seasons-portfolio.md`
- `assets/portfolio-template.md`
- `references/market-bias-checklist.md`

### Mode C — Personal allocation
Use for:
- Retirement allocation.
- Goal-based allocation.
- Risk-tolerance-based asset mix.
- Withdrawal-awareness and time-horizon framing.

Load:
- `references/personal-allocation.md`
- `assets/allocation-template.md`

If the user gives incomplete personal constraints, request:
- Time horizon.
- Base currency.
- Income stability.
- Liquidity need.
- Risk tolerance.
- Existing holdings.
- Target use of capital.

## Step 0 — Data integrity gate

Before analysis:
1. Check whether holdings or portfolio inputs include `value_date`.
2. If data is stale, warn clearly.
3. If quotes need refresh, instruct use of `update-quote` before proceeding.
4. If the user chooses to proceed on stale data, mark the analysis clearly as reference-only.

This skill reads and interprets data. It does not modify files or refresh prices.

## Step 1 — Input normalization

Normalize user input into one of these structures:
- `security_request`
- `portfolio_request`
- `personal_allocation_request`

Minimum fields:
- Ticker or holdings list.
- Base currency.
- Valid-as-of date if available.
- User objective.
- Time horizon where relevant.

If the request is ambiguous, ask clarifying questions before analysis.

## Step 2 — Core analysis

### For security analysis
- Identify the relevant asset class and context.
- Frame the thesis using the appropriate philosophy or market lens.
- Separate thesis, counter-thesis, and key risks.
- Use scenario framing for valuation-sensitive outputs.

### For portfolio diagnostics
- Evaluate concentration, diversification, regime exposure, and drift.
- Map holdings into portfolio buckets using CFI and portfolio rules.
- Identify rebalance pressure, unintended bets, and exposure gaps.

### For personal allocation
- Translate user goals into asset-allocation logic.
- Prioritize suitability, liquidity, time horizon, and survivability over return-chasing.
- Distinguish between strategic allocation and tactical views.
- Explain trade-offs clearly rather than pretending there is a single perfect allocation.

## Step 3 — Quant handoff decision

Escalate to `quant-analysis` only if the task explicitly requires:
- Mean-variance optimization.
- Black-Litterman.
- Risk parity or ERC.
- VaR or CVaR modeling.
- Monte Carlo simulation.
- Factor modeling or regression.
- Volatility modeling or econometrics.
- Programmatic backtesting.

When escalating, create a structured request with:
- Objective.
- Tickers or holdings.
- Weights if available.
- Benchmark.
- Base currency.
- Lookback period.
- Risk-free proxy.
- Required model type.

Then read:
- `references/quant-handoff.md`

After receiving quantitative outputs, integrate them into the final interpretation. Do not let statistical output replace judgment automatically.

## Step 4 — Bias and risk discipline

Before finalizing:
- Run the relevant bias checklist.
- State key risks explicitly.
- Define monitoring conditions.
- When appropriate, define exactly three measurable kill conditions.

Minimum output:
- Red flags.
- Yellow flags.
- Green confirmations.

## Step 5 — Output rules

Every output must:
- Lead with the recommendation or core judgment.
- State confidence level.
- State what the conclusion is valid as of.
- Separate facts, assumptions, and interpretation.
- Distinguish long-term allocation advice from short-term market views.
- If personal allocation is discussed, state that the output is an analytical framework, not individualized regulated advice unless the user has provided the full required context.

## References

Core references:
- `references/asset-classification.md`
- `references/all-seasons-portfolio.md`
- `references/valuation-models.md`
- `references/personal-allocation.md`
- `references/quant-handoff.md`

Templates:
- `assets/portfolio-template.md`
- `assets/allocation-template.md`