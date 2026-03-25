---
name: investment-lens
description: >
  Use this skill for qualitative and conceptual investment analysis of single
  stocks, ETFs, indices, and cryptocurrencies; portfolio diagnostics and
  rebalancing review; personal/retirement allocation (CFA IPS framework);
  and monitoring existing investment signals against new market information.
  Use when the user asks for ticker analysis, portfolio review, All-Seasons
  mapping, concentration checks, qualitative valuation, retirement allocation,
  goal-based allocation, or signal status updates. Do NOT use for raw quote
  refreshes or value_date updates (use update-quote). Do NOT use for Python
  quantitative modelling, portfolio optimisation, Monte Carlo, VaR/CVaR, or
  factor regressions (use quant-analysis). Do NOT use for output formatting
  into research notes or reports (use alphaear-reporter).
compatibility: Allowed-tools: Read Grep WebSearch
allowed-tools: Read Grep WebSearch
metadata:
  argument-hint: "[ticker | portfolio-csv | retirement allocation | signal update]"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  post-invoke-check: "Confirm bias checklist applied; Mode C: IPS disclaimer present; Mode D: classification justified"
---

# Investment Lens

## Purpose

Primary qualitative investment analysis hub. Covers:
- Single-stock, ETF, index, crypto analysis.
- Portfolio diagnostics and rebalancing.
- Personal allocation and retirement-oriented planning.
- Investment signal monitoring and status updates.

## Do Not Use

| Task | Use instead |
|------|------------|
| Refresh prices / update `value_date` in CSV | `update-quote` |
| Quantitative modelling (Monte Carlo, VaR, factor regression) | `quant-analysis` |
| Format analysis into research notes / reports | `alphaear-reporter` |
| Fetch live news | `alphaear-news` |
| Retrieve local news DB | `alphaear-search (engine='local')` |
| Raw OHLCV historical price data | `alphaear-stock` |

---

## Mode Selection

Classify the task before analysis, then load the mode file for full instructions and reference list.

| Mode | Use for | Load |
|------|---------|------|
| **A — Security Analysis** | Single stocks, ETFs, indices, crypto, qualitative valuation | `references/modes/mode-a-security-analysis.md` |
| **B — Portfolio Diagnostics** | Portfolio review, rebalancing, concentration, All-Seasons mapping | `references/modes/mode-b-portfolio-diagnostics.md` |
| **C — Personal Allocation** | Retirement allocation, goal-based allocation, CFA IPS framework, risk-tolerance mix | `references/modes/mode-c-personal-allocation.md` |
| **D — Signal Monitoring** | Monitoring existing signals, assessing Strengthened / Weakened / Falsified / Unchanged | `references/modes/mode-d-signal-monitoring.md` |

Load **only** the mode file for the current task.

---

## Step 0 — Data Integrity Gate

Before analysis:
1. Check whether holdings or portfolio inputs include `value_date`.
2. If stale (≥2 trading days), warn clearly and recommend `update-quote` first.
3. If user chooses to proceed on stale data, mark output as reference-only.

This skill reads and interprets data. It does not refresh prices or modify CSV files.

## Step 1 — Input Normalisation

Normalise input to one of:
- `security_request` → Mode A
- `portfolio_request` → Mode B
- `personal_allocation_request` → Mode C
- `signal_update_request` → Mode D

Minimum required fields: ticker or holdings, base currency, valid-as-of date, user objective, time horizon (where relevant).

If ambiguous, ask one clarifying question before proceeding.

## Step 2 — Core Analysis

Follow mode-specific instructions from the loaded mode file.

## Step 3 — Quant Handoff Decision

Escalate to `quant-analysis` only if the task explicitly requires:
mean-variance optimisation, Black-Litterman, risk parity, VaR/CVaR, Monte Carlo, factor modelling, or backtesting.

When escalating, read `references/quant-handoff.md` and create a structured handoff request.

After receiving quantitative outputs, integrate them into the final interpretation.
Do not let statistical output replace judgment automatically.

## Step 4 — Bias and Risk Discipline

Before finalising:
- Run the relevant bias checklist (specified in mode file).
- State key risks explicitly.
- Define monitoring conditions.
- When appropriate, define three measurable kill conditions.

Minimum output: red flags, yellow flags, green confirmations.

## Step 5 — Output Rules

Every output must:
- Lead with recommendation or core judgment.
- State confidence level.
- State valid-as-of date.
- Separate facts, assumptions, and interpretation.
- Distinguish long-term allocation from short-term market views.
- Mode C: include IPS disclaimer (not regulated financial advice).
- Mode D: state which classification was assigned and why.

## Step 6 — Report Handoff (optional)

If the user wants a formatted research note, investor brief, or initiating coverage report:
- Complete the analysis here first.
- Then pass the output to `alphaear-reporter` with the target format specified.

---

## Core References

Always available regardless of mode:
- `references/quant-handoff.md` — escalation protocol to quant-analysis
- `references/asset-classification.md` — CFI-based asset bucketing

Templates:
- `assets/portfolio-template.md`
- `assets/allocation-template.md`
