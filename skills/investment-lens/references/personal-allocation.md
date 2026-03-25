## `skills/investment-lens/references/personal-allocation.md`

# Personal Allocation Reference

## When to use this reference

Load this file when the user's task involves:
- Retirement portfolio construction.
- Goal-based asset allocation.
- Time-horizon-driven asset mix.
- Withdrawal rate planning.
- Risk-tolerance-based rebalancing.

Do not use this file for market diagnosis, security selection, or portfolio concentration analysis.
Those belong to the portfolio diagnostics flow in the main SKILL.md.

---

## Input requirements

Before applying any allocation framework, confirm:

| Field | Required | Notes |
|---|---|---|
| `time_horizon` | Yes | In years. Under 3 = short, 3–10 = medium, over 10 = long. |
| `base_currency` | Yes | TWD, USD, HKD, etc. |
| `income_stability` | Yes | Stable / variable / retired / pre-retirement. |
| `liquidity_need` | Yes | Estimated months of liquid emergency reserve. |
| `risk_tolerance` | Yes | Conservative / moderate / growth / aggressive. |
| `existing_holdings` | Recommended | Ticker, weight, cost basis where available. |
| `target_objective` | Yes | Retirement income / capital growth / capital preservation / bequest. |
| `withdrawal_start` | If applicable | Years until first systematic withdrawal. |
| `monthly_withdrawal_amount` | If applicable | Expected monthly drawdown in base currency. |

If any required field is missing, ask before proceeding.

---

## Allocation frameworks

### 1. Lifecycle glide path

For users with long time horizons, allocate based on:

```
Equity weight ≈ 110 − Age  (conservative)
Equity weight ≈ 120 − Age  (moderate)
Equity weight ≈ 130 − Age  (growth-oriented)
```

Remaining allocation splits between bonds, alternatives, and cash.
Glide down equity exposure by 1–2% per year as withdrawal approaches.

**Do not apply this formula mechanically.** Adjust for income stability, existing pension income, and bequest intent.

### 2. Risk-tolerance buckets

Use three buckets based on time horizon and purpose:

| Bucket | Purpose | Assets | Horizon |
|---|---|---|---|
| Safety | Emergency, near-term spending | Cash, short bond, money market | 0–2 years |
| Income | Medium-term stability | Investment grade bond, dividend equity | 2–7 years |
| Growth | Long-term accumulation | Broad equity, alternatives | 7+ years |

Bucket sizing depends on:
- Monthly withdrawal amount.
- Income stability.
- Sequence-of-return risk tolerance.

### 3. All-Seasons mapping

When using the All-Seasons framework for personal allocation:

| Asset category | Target weight |
|---|---|
| Equity | 30% |
| Long bond | 40% |
| Medium bond | 15% |
| Gold | 7.5% |
| Commodities | 7.5% |

Report deviation for each category. Flag if any single category deviates by more than 5 percentage points.

Use `references/all-seasons-portfolio.md` for detailed diagnostic logic.

### 4. Taiwan-specific considerations

**NHI Supplemental Premium (二代健保補充保費)**:
- Triggered when a single dividend payment exceeds NT$20,000.
- Premium = (Single dividend − NT$20,000) × 2.11%.
- Consider splitting dividend-generating holdings across accounts where appropriate.

**Dividend tax decision**:
- Integration method: Net = D × (1 − Tax Rate) + D × 8.5%
- Separate 28% method: Net = D × (1 − 28%)
- Always compare both methods using the user's marginal tax bracket before recommending.

**Overseas income threshold**:
- Overseas income YTD threshold: NT$7,500,000.
- Report utilisation rate whenever eToro or foreign income holdings are present.

---

## Output rules

When producing a personal allocation output:

1. Lead with the suggested allocation mix by category, not by individual security.
2. State the framework and assumptions used.
3. Flag any trade-offs explicitly (e.g., higher income now vs. lower growth long-term).
4. Recommend a review trigger rather than a fixed review calendar (e.g., "Review if life situation changes or if equity deviation exceeds 10 percentage points").
5. Always end with: "This analysis is a structured framework. It is not individualized regulated investment advice."

---

## Gotchas

- Lifecycle glide paths assume the user has no pension or annuity income. Adjust down equity exposure if stable pension income already covers baseline needs.
- Bucket strategies can create false security if the growth bucket is too volatile for the user's actual risk tolerance. Test against a realistic drawdown scenario.
- All-Seasons is a diversification framework, not a return-maximization strategy. Manage user expectations accordingly.
- For TWD-based users, currency risk in USD-denominated ETFs (VOO, QQQ) is real and should be disclosed when allocation weight exceeds 30%.
