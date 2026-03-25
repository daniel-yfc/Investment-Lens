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

## Do Not Use

- Quote refreshes, FX refreshes, or updating `value_date` → use `update-quote`.
- Programmatic portfolio optimization, Monte Carlo simulation, GARCH, VaR/CVaR engines, factor regressions, or statistical backtesting → use `quant-analysis`.
- Non-investment tasks.

---

## Mode Selection

Classify the task into one mode before analysis, then load the corresponding mode file for full instructions and reference list.

| Mode | Use for | Load |
|------|---------|------|
| **A — Security Analysis** | Single stocks, ETFs, indices, crypto, qualitative valuation | `references/modes/mode-a-security-analysis.md` |
| **B — Portfolio Diagnostics** | Portfolio review, rebalancing, concentration, All-Seasons mapping | `references/modes/mode-b-portfolio-diagnostics.md` |
| **C — Personal Allocation** | Retirement allocation, goal-based allocation, risk-tolerance mix | `references/modes/mode-c-personal-allocation.md` |

Load **only** the mode file for the current task. Each mode file contains the specific reference list and step-by-step instructions for that mode.

---

## Step 0 — Data Integrity Gate

Before analysis:
1. Check whether holdings or portfolio inputs include `value_date`.
2. If data is stale, warn clearly.
3. If quotes need refresh, instruct use of `update-quote` before proceeding.
4. If user chooses to proceed on stale data, mark the analysis as reference-only.

This skill reads and interprets data. It does not modify files or refresh prices.

## Step 1 — Input Normalization

Normalize user input into one of:
- `security_request`
- `portfolio_request`
- `personal_allocation_request`

Minimum fields: ticker or holdings list, base currency, valid-as-of date, user objective, time horizon where relevant.

If the request is ambiguous, ask clarifying questions before analysis.

## Step 2 — Core Analysis

Follow the mode-specific instructions loaded in Mode Selection above.

## Step 3 — Quant Handoff Decision

Escalate to `quant-analysis` only if the task explicitly requires mean-variance optimization, Black-Litterman, risk parity, VaR/CVaR, Monte Carlo, factor modeling, or backtesting.

When escalating, read `references/quant-handoff.md` and create a structured handoff request.

After receiving quantitative outputs, integrate them into the final interpretation. Do not let statistical output replace judgment automatically.

## Step 4 — Bias and Risk Discipline

Before finalizing:
- Run the relevant bias checklist (see mode file for which one).
- State key risks explicitly.
- Define monitoring conditions.
- When appropriate, define exactly three measurable kill conditions.

Minimum output: red flags, yellow flags, green confirmations.

## Step 5 — Output Rules

Every output must:
- Lead with the recommendation or core judgment.
- State confidence level.
- State what the conclusion is valid as of.
- Separate facts, assumptions, and interpretation.
- Distinguish long-term allocation advice from short-term market views.
- For personal allocation: state that the output is an analytical framework, not individualized regulated advice.

---

## Core References

Always available regardless of mode:
- `references/quant-handoff.md` — escalation protocol to quant-analysis
- `references/asset-classification.md` — CFI-based asset bucketing

Templates:
- `assets/portfolio-template.md`
- `assets/allocation-template.md`
