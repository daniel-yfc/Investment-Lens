# Mode C — Personal Allocation

Load this file when the task involves retirement allocation, goal-based asset
allocation, or risk-tolerance-based asset mix for an individual user.

> All content from the former `asset-allocation` skill is now fully inlined here.
> No external skill directory references required.

---

## When to Use Mode C

- Retirement planning and withdrawal-phase allocation.
- Goal-based allocation (education fund, property purchase, etc.).
- Risk-tolerance assessment and risk-level mapping.
- Personal IPS (Investment Policy Statement) creation.
- First-time allocation guidance.
- Rebalancing plan for a personal portfolio.

## Also Read (supplementary, load if directly relevant)

| Reference | When to load |
|-----------|-------------|
| `references/personal-allocation.md` | For full RRTTLLU IPS methodology and allocation templates |
| `references/product-selection.md` | When recommending specific ETFs, funds, or instruments |
| `references/purchase-guide.md` | For platform-specific execution guidance (Taiwan, US, HK) |
| `references/rebalancing-protocol.md` | When defining or reviewing a rebalancing plan |

---

## Required User Inputs

If incomplete, collect all before proceeding:

- **Time horizon** — years to target event or retirement
- **Base currency** — primary currency of assets and liabilities
- **Income stability** — employment type, income predictability
- **Liquidity need** — near-term cash requirements
- **Risk tolerance** — capacity and willingness to bear loss
- **Existing holdings** — current portfolio if any
- **Target use of capital** — income, growth, preservation, or mixed

---

## Risk Level Framework

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
9. Apply product selection criteria (see Also Read: `product-selection.md`).
10. Set rebalancing rules (see Also Read: `rebalancing-protocol.md`).
11. Build IPS report (12 sections, see below).
12. Define monitoring plan.

---

## Product Selection Criteria (Summary)

**Equity ETFs / Funds:**
- Prefer low-cost index funds (TER < 0.5% for broad market).
- For Taiwan: ETFs listed on TWSE preferred (0050, 006208, 00929, etc.).
- For US/Global: Vanguard / iShares / Schwab core ETF range.
- Avoid leveraged or inverse ETFs in long-term allocation.

**Bond ETFs / Funds:**
- Match duration to investment horizon.
- For inflation protection: TIPS or equivalent.
- For Taiwan: government bond ETFs or high-grade corporate.

**Alternatives:**
- Gold: physical ETF (e.g., GLD, 00635U.TW) up to allocation limit.
- REITs: only in tax-advantaged accounts where possible.

> For full product lists and platform execution details, load `references/product-selection.md` and `references/purchase-guide.md`.

---

## Rebalancing Rules (Summary)

- **Threshold**: rebalance when any asset class drifts >5% from target.
- **Calendar**: annual review minimum; semi-annual if portfolio > NT$3M.
- **Cash flow**: direct new contributions to underweight assets first.
- **Tax-aware**: prefer selling appreciated bonds over equities in taxable accounts.
- **Emergency reserve**: maintain 3–6 months expenses in cash; never rebalance below this floor.

> For full protocol, load `references/rebalancing-protocol.md`.

---

## Macro Framework (Merrill Lynch Investment Clock)

| Phase | GDP | Inflation | Favoured Assets |
|-------|-----|-----------|----------------|
| Recovery | Rising | Falling | Equities, REITs |
| Expansion | Rising | Rising | Commodities, equities |
| Slowdown | Falling | Rising | Bonds, cash |
| Contraction | Falling | Falling | Bonds, gold |

Apply macro phase to tilt tactical allocation +/−5% from SAA target.

---

## Behavioural Biases to Check

Before finalising the IPS, flag if any of these are present:
- **Recency bias**: overweighting recent performance.
- **Home bias**: excessive allocation to domestic market.
- **Loss aversion**: setting drawdown tolerance below stated willingness.
- **Overconfidence**: return expectations above long-run historical averages.
- **Anchoring**: fixating on purchase price rather than current fundamentals.

---

## Platform Execution (Summary)

| Region | Platform Examples | Asset Types |
|--------|------------------|-------------|
| Taiwan | 永豐金, 富邦證券, 國泰證券, 中信銀行 App | ETF, 基金, 台債, REITs |
| US / Global | Interactive Brokers, Schwab, Fidelity, Vanguard | ETF, Stocks, Bonds, Mutual Funds |
| Hong Kong | Futu (富途), Tiger Brokers, HSBC HK | HK/US ETF, MPF |

> For step-by-step Taiwan / IBKR execution instructions, load `references/purchase-guide.md`.

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

## Disclaimer Requirement

Every Mode C output must include:

> *This output is an analytical framework based on the CFA IPS methodology and
> general educational guidance. It is not individualised regulated financial advice.
> Investment involves risk. Past performance does not predict future results.
> Consult a licensed financial advisor before making allocation decisions.*
