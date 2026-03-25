# Mode B — Portfolio Diagnostics

Load this file when the task involves portfolio review, rebalancing, concentration checks,
All-Seasons mapping, or allocation drift analysis.

---

## When to Use Mode B

- Portfolio review from CSV or holdings list
- Rebalancing logic and recommendations
- Concentration and diversification checks
- All-Seasons / risk-parity allocation mapping
- Allocation drift analysis
- Unintended bets and exposure gap identification

## References to Load (as needed)

| Reference | When to load |
|-----------|-------------|
| `references/asset-classification.md` | Always — needed to bucket holdings correctly |
| `references/all-seasons-portfolio.md` | For All-Seasons / risk-parity mapping |
| `assets/portfolio-template.md` | As output template for structured holdings review |
| `references/market-bias-checklist.md` | Before finalizing any portfolio view |

## Core Analysis Steps

1. Normalize holdings into standard portfolio request format.
2. Map each holding into an asset-classification bucket.
3. Evaluate concentration, diversification, and regime exposure.
4. Identify rebalance pressure, unintended bets, and exposure gaps.
5. Compare current allocation to target or benchmark framework (e.g., All-Seasons).
6. Output structured recommendations with flag levels (red / yellow / green).

## Data Integrity Gate

Before analysis:
- Check whether holdings include `value_date`.
- If stale, warn clearly and recommend running `update-quote` first.
- If user proceeds on stale data, mark output as reference-only.

## Quant Handoff Trigger

Escalate to `quant-analysis` if the task requires mean-variance optimization, risk parity,
VaR/CVaR, or factor modeling. See `references/quant-handoff.md`.
