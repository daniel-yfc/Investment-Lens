---
name: investment-lens
description: >
  Qualitative and conceptual multi-asset investment analysis for individual stocks (AAPL, TSMC, 2330),
  ETFs and indices (VOO, 0050, QQQ), cryptocurrencies (BTC, ETH), and
  portfolio/allocation diagnostics. Applies ISO 10962:2021 CFI classification,
  All-Seasons framework mapping, Pre-Mortem risk assessment, and 6-philosophy
  routing. Triggers on: ticker analysis, portfolio review, allocation diagnosis,
  qualitative valuation questions, rebalancing decisions. Does NOT trigger on: raw quote
  update requests (use /update-quote), pure FX conversion,
  personal CFA/retirement goal planning (use asset-allocation),
  programmatic Python/Jupyter optimization (use quant-analysis),
  Excel-based DCF models (use dcf-model), or non-investment queries.
argument-hint: "[ticker | portfolio-csv | 'portfolio review']"
effort: high
user-invocable: true
disable-model-invocation: false
allowed-tools: Read, Grep, WebSearch
hooks:
  post-invoke:
    - description: "Confirm bias-checklist.md was executed for every analysis"
---

# Investment Lens v3.1 — Core Execution Framework

## STEP 0 — Data Integrity Gate (MANDATORY, non-skippable)

Before any analysis begins, execute the following checks in sequence. Do not proceed to Step 1 until all gates pass or the user explicitly acknowledges the risk.

**Gate 0-A: value_date Freshness Check**

Read the `value_date` field from any CSV input. Apply the staleness matrix:

| Days since value_date | Status | Required Action |
|----------------------|--------|-----------------|
| ≤ 1 trading day | ✅ Fresh | Proceed |
| 2–3 trading days | 🟡 Stale | Notify user, offer to proceed |
| 4–7 trading days | 🟠 Expired | Warn: "Recommend running `/update-quote` first. Proceed anyway?" |
| > 7 trading days | 🔴 Critical | HARD BLOCK: Prepend all conclusions with `⚠️ BASED ON STALE DATA (>7 days). FOR REFERENCE ONLY.` |

**CRITICAL CONSTRAINT**: This skill reads and analyses CSVs. It does NOT modify CSVs, update prices, or write back `value_date`. All quote refresh operations are exclusively handled by `/update-quote`.

**Gate 0-B: CFI Code Conflict Resolution**

When a holding's text "asset class" field conflicts with its CFI code, **CFI code wins**. Log the conflict as: `[CFI Override] Ticker X: text label '[Y]' overridden by CFI '[Z]' → mapped to All-Seasons category '[W]'`.

**Gate 0-C: eToro Smart Portfolio Deconstruction**

Before any All-Seasons mapping, deconstruct eToro portfolios:
- **The-Chameleon** (`CIOGMU`): Split per latest monthly report — default: ~70% Equity (SPY5.L) + ~30% Gold (WGLD.L)
- **Target2030-FT** (`CIOIMU` / `CIOGMU`): Apply 2026 glide path — default: ~25% Equity / ~75% Bonds. Flag Capital Guarantee status as `[UNCONFIRMED]` if not explicitly stated in input.
- **Momentum-LS** (`CIOGLU`): Classify as Alternative/Low-Correlation. Net market exposure = unknown until monthly report; default to 0% directional exposure.

---

## STEP 1 — Input Classification & Routing

Load `references/asset-classification.md` now. Use it to verify CFI codes and resolve ambiguous tickers.

Execute the routing decision tree:

```
User Input
│
├─ Single stock ticker (e.g., NVDA, 2330, GOOG)
│    ├─ Load: references/tech-earnings-deepdive.md
│    ├─ Load: references/investing-philosophies.md
│    ├─ Load: references/valuation-models.md
│    ├─ IF macro is Key Force: Load references/macro-liquidity.md
│    ├─ IF US deep-value analysis: Load references/us-value-investing.md
│    └─ AFTER analysis: MANDATORY references/bias-checklist.md
│
├─ ETF / Index / Fund ticker (e.g., VOO, 0050, QQQ, 00720B)
│    ├─ Load: references/market-asset-analysis.md
│    ├─ Load: references/investing-philosophies-ref.md
│    ├─ Load: references/valuation-models.md
│    ├─ IF macro is Key Force: Load references/macro-liquidity.md
│    └─ AFTER analysis: MANDATORY references/market-bias-checklist.md
│
├─ Crypto (BTC, ETH)
│    ├─ Load: references/btc-bottom-model.md
│    └─ AFTER analysis: MANDATORY references/bias-checklist.md
│
├─ Portfolio / All-Seasons / Retirement / Allocation (CSV or text description)
│    ├─ Load: references/all-seasons-portfolio.md
│    ├─ Load: references/asset-classification.md (already loaded at Step 0)
│    ├─ IF input incomplete or ambiguous: Show assets/portfolio-template.md Format C
│    └─ AFTER analysis: MANDATORY references/market-bias-checklist.md
│
└─ Ambiguous input
     └─ Show: assets/portfolio-template.md Format C — ask user to clarify
```

---

## STEP 2 — Precision Financial Calculations (Anti-Hallucination Lock)

For all quantitative outputs, apply the following locked formulas. Never approximate or paraphrase these calculations.

**HHI Concentration Index** (for portfolio holdings):

$$\text{HHI} = \sum_{i=1}^{n} s_i^2$$

where $$s_i$$ is the percentage weight of holding $$i$$ expressed as a decimal (e.g., 30% = 0.30). Output range: 0 to 1. Thresholds: <0.15 = diversified; 0.15–0.25 = moderate concentration; >0.25 = highly concentrated.

**Sharpe Ratio**:

$$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$

where $$R_p$$ = portfolio return, $$R_f$$ = risk-free rate (use Taiwan 1-year government bond yield as default for TWD portfolios; US 3-month T-bill for USD portfolios), $$\sigma_p$$ = annualised standard deviation of portfolio returns. Always state the $$R_f$$ assumption explicitly.

**Taiwan NHI Supplemental Premium** (二代健保補充保費):

$$\text{Premium} = (\text{Single Dividend} - NT\$20{,}000) \times 2.11\%$$

Only triggered when a single dividend payment exceeds NT$20,000. Zero if below threshold.

**PEG Ratio**:

$$\text{PEG} = \frac{P/E}{\text{EPS Growth Rate (\%)}}$$

**Reverse DCF** (Implied Growth Rate): Derive from current market cap, WACC assumption, and terminal value. Always state WACC and terminal growth rate assumptions explicitly.

**Dividend Tax Decision** (Taiwan):

$$\text{Net After-Tax (Integration Method)} = D \times (1 - \text{Tax Rate}) + D \times 8.5\%$$

$$\text{Net After-Tax (Separate 28\%)} = D \times (1 - 28\%)$$

Compare both and recommend the lower-tax option based on user's stated marginal tax bracket.

**All-Seasons Deviation Score**:

$$\text{Deviation}_i = w_i^{\text{actual}} - w_i^{\text{target}}$$

Report for each of the 5 categories: Equity (30%), Long Bond (40%), Medium Bond (15%), Gold (7.5%), Commodities (7.5%).

---

## STEP 3 — Analysis Execution

Execute the analysis framework loaded in Step 1. Apply the following universal output discipline:

**Guidelines (MANDATORY — applies to all analysis modes):**

1. **Lead with conclusion**: First sentence must be the actionable recommendation (Buy/Hold/Sell/Rebalance/Monitor), followed by confidence level (High/Medium/Low) and a one-sentence rationale.
2. **Data citation**: Every quantitative claim must cite its source tier — Tier 1 (SEC/regulator), Tier 2 (Bloomberg/Morningstar/FRED), Tier 3 (company IR). Flag Tier 3 data as `[Self-reported]`.
3. **Assumption lock**: For any DCF, Sharpe, or HHI calculation, state all assumptions in a `Assumptions:` block before the result.
4. **No speculative ranges without bounds**: All price targets and growth estimates must include a bear case / base case / bull case structure. Never give a single-point estimate.
5. **Time-stamp sensitivity**: Every conclusion must include `Valid as of: [value_date]`. If `value_date` is missing, use `Valid as of: [date of analysis session]`.
6. **Philosophy conflict handling**: When two investment philosophies produce conflicting signals (e.g., Quality Compounder = Buy vs. Macro-Tactical = Sell), explicitly state the conflict, do not silently resolve it. Present both signals and let the user decide based on their holding horizon.
7. **Kill Condition enforcement**: For every Pre-Mortem, define exactly 3 Kill Conditions with measurable thresholds. Example format: `Kill Condition A: If [metric] crosses [threshold] by [date], exit position. Rationale: [one sentence].`
8. **eToro overseas income tracking**: When analysing eToro holdings, append the running overseas income tally: `Overseas Income YTD: NT$[X] / NT$7,500,000 threshold ([Y]% utilised)`.

---

## STEP 4 — Anti-Bias Enforcement (Non-Skippable Final Gate)

For individual stocks → Load and execute `references/bias-checklist.md` in full.
For market/ETF/portfolio analysis → Load and execute `references/market-bias-checklist.md` in full.

Output a structured checklist result:
- 🔴 **Red Flags** (immediate risk signals requiring action)
- 🟡 **Yellow Flags** (areas requiring monitoring)
- ✅ **Green Confirmations** (actively verified positive factors)

Minimum output: at least one item in each category. If a category is genuinely empty, state why explicitly (e.g., `✅ No red flags identified — [reason]`).

---

## STEP 5 — Output Formatting

Use the appropriate template based on analysis type:

**For individual stocks**: Use the full report format from `references/tech-earnings-deepdive.md`
**For ETFs/markets**: Use the report format from `references/market-asset-analysis.md`
**For portfolios**: Use `assets/portfolio-template.md` as the output scaffold

Every output must end with:

```
---
Analysis completed: [timestamp]
value_date used: [value_date from CSV, or 'session date']
Data freshness: [✅ Fresh / 🟡 Stale / 🟠 Expired / 🔴 Critical]
Next review recommended: [date]
To refresh quotes: /update-quote
---
```

---

## Supporting Files Index

| File | Role | Load Trigger |
|------|------|-------------|
| `references/instruction.md` | Routing index & file manifest | Always available as fallback |
| `references/asset-classification.md` | ISO 10962:2021 CFI master table | Step 0 (always) |
| `references/tech-earnings-deepdive.md` | Individual stock deep-dive framework | Single stock input |
| `references/market-asset-analysis.md` | ETF/Index/Market analysis framework | ETF or market input |
| `references/all-seasons-portfolio.md` | All-Seasons portfolio diagnostics | Portfolio/allocation input |
| `references/btc-bottom-model.md` | Bitcoin cycle bottom detection | BTC/ETH input |
| `references/investing-philosophies.md` | 6-philosophy routing for stocks | Individual stock analysis |
| `references/investing-philosophies-ref.md` | 6-philosophy routing for markets | ETF/portfolio analysis |
| `references/valuation-models.md` | Multi-master valuation toolbox | Any valuation question |
| `references/bias-checklist.md` | Anti-bias & Pre-Mortem for stocks | Final gate — stocks |
| `references/market-bias-checklist.md` | Anti-bias & Pre-Mortem for markets | Final gate — markets/ETFs |
| `references/macro-liquidity.md` | Macro liquidity monitoring | When Key Force = Macro |
| `references/us-value-investing.md` | US value investing 4D scoring | US deep-value analysis |
| `assets/portfolio-template.md` | Portfolio input format guide | Incomplete/ambiguous input |

---

## Examples

**Example — Correct Trigger (should invoke this skill):**
- `/investment-lens NVDA`
- `/investment-lens VOO`
- `/investment-lens BTC`
- `/investment-lens [paste CSV]`
- "Analyse my portfolio allocation"
- "Is TSMC overvalued?"
- "What's the All-Seasons deviation for my holdings?"

**Example — Should NOT invoke this skill (boundary enforcement):**
- "Update the BTC price" → invoke `/update-quote`
- "What's today's USD/TWD rate?" → invoke `/update-quote`
- "Fix the value_date in my CSV" → invoke `/update-quote`
- "What's the weather tomorrow?" → out of scope, decline politely
