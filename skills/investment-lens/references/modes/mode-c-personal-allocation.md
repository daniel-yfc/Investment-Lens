# Mode C — Personal Allocation

Load this file when the task involves retirement allocation, goal-based asset allocation,
or risk-tolerance-based asset mix for an individual user.

---

## When to Use Mode C

- Retirement allocation planning
- Goal-based allocation (education, home purchase, etc.)
- Risk-tolerance-based asset mix
- Withdrawal-awareness and time-horizon framing
- First-time allocation guidance

## References to Load

| Reference | When to load |
|-----------|-------------|
| `references/personal-allocation.md` | Always — core framework for Mode C |
| `assets/allocation-template.md` | As output template for structured allocation output |

## Required User Inputs

If the user provides incomplete personal constraints, request all of the following before proceeding:

- **Time horizon** — years to target event or retirement
- **Base currency** — primary currency of assets and liabilities
- **Income stability** — employment type, income predictability
- **Liquidity need** — near-term cash requirements
- **Risk tolerance** — capacity and willingness to bear loss
- **Existing holdings** — current portfolio if any
- **Target use of capital** — income, growth, preservation, or mixed

## Core Analysis Steps

1. Translate user goals into asset-allocation logic.
2. Prioritize suitability, liquidity, time horizon, and survivability over return-chasing.
3. Distinguish strategic allocation from tactical views.
4. Explain trade-offs clearly — there is no single perfect allocation.
5. Use `assets/allocation-template.md` to structure output.

## Disclaimer Requirement

Every Mode C output must include this statement:

> *This output is an analytical framework and general educational guidance.
> It is not individualized regulated financial advice.
> Consult a licensed financial advisor before making allocation decisions.*

Omit only if the user has explicitly provided full required context AND the jurisdiction
does not require the disclaimer.
