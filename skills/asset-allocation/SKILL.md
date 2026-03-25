---
name: asset-allocation
description: >
  Professional personal investment advisory skill based on CFA framework. From
  financial diagnosis to portfolio rebalancing for individuals. Use when users ask
  about personal wealth management, retirement planning, goal-based asset allocation,
  or personal risk assessment. Covers personal financial profile, goal-based planning,
  and portfolio construction for individuals. Do NOT use for general market analysis,
  stock valuation, or algorithmic portfolio optimization — use investment-lens or
  quant-analysis instead.
compatibility: No special runtime dependencies; reads references/ files as needed
allowed-tools: Read Grep WebSearch
metadata:
  argument-hint: "[personal portfolio | retirement | risk tolerance | rebalance]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  post-invoke-check: "Confirm IPS report includes all 12 sections and disclaimer"
---

# Asset Allocation Advisor

Professional investment advisory skill based on CFA framework.

## Quick Start

When user asks about investment/wealth topics:
1. Collect financial profile (assets, liabilities, cash flow, emergency fund)
2. Assess risk tolerance (capacity + willingness)
3. Define investment goals (must-have, should-have, nice-to-have)
4. Analyze macro environment (economic cycle, valuation)
5. Create strategic asset allocation (SAA)
6. Provide product selection criteria
7. Set risk management rules

## Core Methodology

- **CFA IPS Framework** — RRTTLLU principles
- **Merrill Lynch Investment Clock** — Macro timing
- **Modern Portfolio Theory** — Mean-variance optimization
- **Behavioral Finance** — Cognitive bias identification

## Risk Assessment

| Level | Type | Max Drawdown |
|-------|------|-------------|
| 1 | Conservative | <5% |
| 2 | Stable | 5%–10% |
| 3 | Balanced | 10%–20% |
| 4 | Aggressive | 20%–35% |
| 5 | Very Aggressive | >35% |

## Asset Allocation Models

**Conservative (Level 1)** — Target: 3%–4.5%
- Cash: 35% | Bonds: 40% | Hybrid: 15% | Equity: 8% | Gold: 2%

**Stable (Level 2)** — Target: 4%–6.5%
- Cash: 20% | Bonds: 30% | Hybrid: 20% | Domestic Equity: 18% | Overseas: 7% | Gold: 5%

**Balanced (Level 3)** — Target: 6%–10%
- Cash: 10% | Bonds: 20% | Hybrid: 20% | Domestic: 35% | Overseas: 10% | Gold: 5%

**Aggressive (Level 4)** — Target: 9%–18%
- Cash: 5% | Bonds: 10% | Hybrid: 15% | Domestic: 45% | Overseas: 18% | Gold: 7%

## Detailed References

Load as needed:
- `references/product-selection.md` — Fund/ETF selection criteria
- `references/rebalancing-protocol.md` — Rebalancing rules
- `references/macro-framework.md` — Macro analysis framework
- `references/behavioral-biases.md` — Behavioral finance biases
- `references/purchase-guide.md` — Step-by-step purchase instructions by platform

## Execution Phase

When user is ready to execute, **ask for their country/region and preferred platform first**, then load the appropriate section from `references/purchase-guide.md`.

Common platforms by region (always confirm with user before recommending):

| Region | Platform Examples | Asset Types |
|--------|------------------|-------------|
| **Taiwan** | 永豐金, 富邦證券, 國泰證券, 中信銀行 App | ETF, 基金, 台債, REITs |
| **US / Global** | Interactive Brokers, Schwab, Fidelity, Vanguard | ETF, Stocks, Bonds, Mutual Funds |
| **Mainland China** | 支付宝, 天天基金, 招商銀行 App | 公募基金, A股ETF, 國債 |
| **Hong Kong** | Futu (富途), Tiger Brokers, HSBC HK | HK/US ETF, MPF |

## Report Structure

Output comprehensive IPS report:
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

## Disclaimer

⚠️ Investment involves risk
⚠️ Past performance doesn’t predict future results
⚠️ For reference only, not formal regulated advice
