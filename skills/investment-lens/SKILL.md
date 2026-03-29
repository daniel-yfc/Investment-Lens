---
name: investment-lens
description: Use this skill when the task requires qualitative investment analysis for a single stock, ETF, index, or crypto asset; portfolio diagnostics and rebalancing; personal retirement or goal-based allocation; or monitoring and classifying existing investment signals. Do NOT use for quantitative modelling (use quant-analysis), price/quote refreshes (use update-quote), or formatting completed analysis into reports (use alphaear-reporter).
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

Classify the task before analysis, then load the mode file.

| Mode | Use for | Load |
|------|---------|------|
| **A — Security Analysis** | Single stocks, ETFs, indices, crypto, qualitative valuation | `references/modes/mode-a-security-analysis.md` |
| **B — Portfolio Diagnostics** | Portfolio review, rebalancing, concentration, All-Seasons mapping | `references/modes/mode-b-portfolio-diagnostics.md` |
| **C — Personal Allocation** | Retirement allocation, goal-based allocation, CFA IPS framework | `references/modes/mode-c-personal-allocation.md` |
| **D — Signal Monitoring** | Monitoring existing signals, assessing Strengthened / Weakened / Falsified / Unchanged | `references/modes/mode-d-signal-monitoring.md` |

Load **only** the mode file for the current task.

---

## Available Scripts

Run with `uv run scripts/<file>.py` or `python scripts/<file>.py`.

- **`scripts/fin_agent.py`** — Main pipeline controller: FinResearcher → FinAnalyst → Signal Tracking. Used by Mode D.

See `scripts/SCRIPTS.md` for full script index and usage.

---

## Gotchas

- `fin_agent.py` is a library module (no CLI entry point). Invoke it via the agentic pipeline described in `references/PROMPTS.md`, not as a standalone command.
- `scripts/` uses relative imports (`from .utils.database_manager import ...`). Run from the `scripts/` directory or set `PYTHONPATH` accordingly.
- The `sanitize_signal_output` method in `FinUtils` drops tickers it cannot verify against the local DB. If the DB is empty, all impact tickers will be stripped. Populate DB with `alphaear-news` first.
- Mode C output must always include the IPS disclaimer. Do not omit even if user requests brevity.
- Mode D "Unchanged" is a valid classification; do not default to "Weakened" when evidence is thin.

---

## Step 0 — Data Integrity Gate

Before analysis:
1. Check whether holdings or portfolio inputs include `value_date`.
2. If stale (≥2 trading days), warn clearly and recommend `update-quote` first.
3. If user chooses to proceed on stale data, mark output as reference-only.

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

If the user wants a formatted research note or coverage report:
- Complete the analysis here first.
- Then pass to `alphaear-reporter` with target format specified.

---

## Core References

Always available regardless of mode:
- `references/quant-handoff.md` — escalation protocol to quant-analysis
- `references/asset-classification.md` — CFI-based asset bucketing

Templates:
- `assets/portfolio-template.md`
- `assets/allocation-template.md`

## Reference Loading Instructions

**CRITICAL CONTEXT WARNING:** This skill contains large reference files. To prevent context window overflow, **DO NOT load all references upfront**. Only load the specific reference file when actively executing the step that requires it.
- `asset-classification.md`: Load ONLY when specifically performing tasks related to this file.
- `market-asset-analysis.md`: Load ONLY when specifically performing tasks related to this file.
- `all-seasons-portfolio.md`: Load ONLY when specifically performing tasks related to this file.
