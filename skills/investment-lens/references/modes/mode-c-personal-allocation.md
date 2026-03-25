# Mode C — Personal Allocation

Load this file when the task involves retirement allocation, goal-based asset
allocation, or risk-tolerance-based asset mix for an individual user.

This mode absorbs all content from the deprecated `asset-allocation` skill.

---

## When to Use Mode C

- Retirement planning and withdrawal-phase allocation.
- Goal-based allocation (education fund, property purchase, etc.).
- Risk-tolerance assessment and risk-level mapping.
- Personal IPS (Investment Policy Statement) creation.
- First-time allocation guidance.
- Rebalancing plan for a personal portfolio.

## References to Load

| Reference | When to load |
|-----------|--------------|
| `references/personal-allocation.md` | Always — core framework for Mode C |
| `references/product-selection.md` | Fund/ETF selection criteria |
| `references/rebalancing-protocol.md` | Rebalancing rules |
| `references/macro-framework.md` | Macro analysis framework |
| `references/behavioral-biases.md` | Behavioural finance biases |
| `references/purchase-guide.md` | Platform-specific execution guide |
| `assets/allocation-template.md` | Output template |

---

## Required User Inputs

If incomplete, request all before proceeding:

- **Time horizon** — years to target event or retirement
- **Base currency** — primary currency of assets and liabilities
- **Income stability** — employment type, income predictability
- **Liquidity need** — near-term cash requirements
- **Risk tolerance** — capacity and willingness to bear loss
- **Existing holdings** — current portfolio if any
- **Target use of capital** — income, growth, preservation, or mixed

---

## Risk Level Framework (CFA IPS)

| Level | Type | Max Drawdown | Return Target |
|-------|------|-------------|---------------|
| 1 | Conservative | <5% | 3%–4.5% |
| 2 | Stable | 5%–10% | 4%–6.5% |
| 3 | Balanced | 10%–20% | 6%–10% |
| 4 | Aggressive | 20%–35% | 9%–18% |
| 5 | Very Aggressive | >35% | >18% |

---

## Model Allocation Portfolios

**Level 1 — Conservative**
Cash 35% | Bonds 40% | Hybrid 15% | Equity 8% | Gold 2%

**Level 2 — Stable**
Cash 20% | Bonds 30% | Hybrid 20% | Domestic Equity 18% | Overseas 7% | Gold 5%

**Level 3 — Balanced**
Cash 10% | Bonds 20% | Hybrid 20% | Domestic 35% | Overseas 10% | Gold 5%

**Level 4 — Aggressive**
Cash 5% | Bonds 10% | Hybrid 15% | Domestic 45% | Overseas 18% | Gold 7%

---

## Core Analysis Steps (RRTTLLU)

1. **Return** requirement: target return to meet goals.
2. **Risk** tolerance: capacity (financial) + willingness (psychological).
3. **Time** horizon: single-stage vs multi-stage.
4. **Tax** considerations: jurisdiction-specific.
5. **Liquidity** needs: near-term and emergency reserve.
6. **Legal / regulatory**: applicable constraints.
7. **Unique** circumstances: personal, ethical, or structural constraints.

Then:
8. Translate into Strategic Asset Allocation (SAA).
9. Apply product selection criteria from `references/product-selection.md`.
10. Set rebalancing rules from `references/rebalancing-protocol.md`.
11. Build IPS report (12 sections, see below).
12. Define monitoring plan.

---

## IPS Report Structure (12 sections)

1. Client Financial Profile
2. Risk Assessment
3. Investment Goals
4. Macro Analysis
5. Strategic Asset Allocation
6. Product Selection Criteria
7. Execution Plan
8. Growth Projection
9. Stress Testing
10. Risk Management Rules
11. Investment Discipline
12. Monitoring Plan

---

## Platform Execution

When user is ready to execute, **ask for their country/region and preferred platform first**,
then load the appropriate section from `asset-allocation/references/purchase-guide.md`.

| Region | Platform Examples | Asset Types |
|--------|------------------|-------------|
| Taiwan | 永豐金, 富邦證券, 國泰證券, 中信銀行 App | ETF, 基金, 台債, REITs |
| US / Global | Interactive Brokers, Schwab, Fidelity, Vanguard | ETF, Stocks, Bonds, Mutual Funds |
| Hong Kong | Futu (富途), Tiger Brokers, HSBC HK | HK/US ETF, MPF |

---

## Disclaimer Requirement

Every Mode C output must include:

> *This output is an analysis per CFA IPS methodology and shall not constitute a financial advice.
> Investment involves risk. Consult before making decisions.*
