---
name: investment-lens
description: >
  Institutional-grade investment analysis framework for stocks, ETFs, crypto,
  and portfolio management. Use when the user asks to analyze a stock (e.g. AAPL,
  TSMC, 台積電), evaluate an ETF or market index (e.g. VOO, 0050, QQQ),
  assess Bitcoin or crypto timing, review or build an investment portfolio,
  update portfolio quotes, or asks about Taiwan-specific tax optimization
  (二代健保, 海外所得, 股利抵減). Supports quick mode (15-20 min) and full
  deep-dive mode (45-60 min). Integrates 6 investment philosophies, 6 valuation
  models, ISO 10962 CFI asset classification, anti-bias checklists, Pre-Mortem
  analysis, and Taiwan investor tax framework.
argument-hint: "[ticker, portfolio CSV, or analysis request]"
---

<!--
  author: daniel-yf-chen | version: 3.1 | updated: 2026-03-21
  language: zh-TW | license: Proprietary
  compatibility: Claude Code — conversational AI agents with file-reading capability
-->

# Investment Lens Skill v3.1

This skill provides a complete investment analysis system. Upon activation,
follow the routing logic below. Load reference files from `references/` only
when the relevant analysis module is needed.

## Step 1: Identify Analysis Target

| User Input | Primary Framework | Load File |
|-----------|------------------|-----------|
| Individual stock (AAPL, TSMC, 台積電…) | Tech Earnings Deep Dive | `references/tech-earnings-deepdive.md` |
| Market / ETF / Fund (VOO, 0050, QQQ…) | Market Asset Analysis | `references/market-asset-analysis.md` |
| Crypto (BTC, ETH…) | BTC Bottom Model | `references/btc-bottom-model.md` |
| Portfolio review / 全天候 / retirement | All-Seasons Portfolio | `references/all-seasons-portfolio.md` |
| CFI code lookup / asset classification / ISO 10962 | Asset Classification | `references/asset-classification.md` |
| Portfolio CSV pasted / update quote / 更新報價 | Update Quote Skill | invoke `/update-quote` |
| Unclear / mixed | Show portfolio template | `assets/portfolio-template.md` |

## Step 2: Load Method Toolbox (always load with primary framework)

| Analysis Type | Philosophy File | Valuation File |
|--------------|----------------|----------------|
| Individual stock | `references/investing-philosophies.md` | `references/valuation-models.md` |
| Market / ETF / Portfolio | `references/investing-philosophies-ref.md` | `references/valuation-models.md` |

## Step 3: Load Specialist Modules (conditional)

Load these **only when triggered**:

- `references/macro-liquidity.md` — when macro environment is a Key Force
- `references/us-value-investing.md` — when deep US stock value scoring is needed
- `references/btc-bottom-model.md` — when crypto assets are involved
- `references/asset-classification.md` — when CFI code mapping or ISO 10962 classification is needed

## Step 4: Run Anti-Bias Check (always, after analysis completes)

| Analysis Type | Anti-Bias File |
|--------------|---------------|
| Individual stock / crypto | `references/bias-checklist.md` |
| Market / ETF / Portfolio | `references/market-bias-checklist.md` |

## Step 5: Taiwan Tax Auto-Trigger

When any of the following appear, activate the Taiwan tax framework
inside `references/all-seasons-portfolio.md`:

- Taiwan stock codes (00xxx series, 0050, 2330…)
- Keywords: 二代健保, 補充保費, 海外所得, 750萬, 股利抵減, 8.5%

## Step 6: Portfolio CSV — value_date Freshness Check

When a portfolio CSV is provided, read the `# value_date:` header line and apply:

| Days since value_date | Action |
|----------------------|--------|
| ≤ 1 trading day | ✅ Proceed directly |
| 2–3 trading days | 🟡 Suggest update, allow user to continue |
| 4–7 trading days | 🟠 Warn, recommend `/update-quote` before analysis |
| > 7 trading days | 🔴 Force notice — append "基於過期報價，僅供參考" to all conclusions |

## Step 7: eToro Smart Portfolio Decomposition

When portfolio contains eToro Smart Portfolios, decompose before all-seasons mapping:

| Portfolio | Decomposition Method |
|-----------|---------------------|
| The-Chameleon (`CIOGMU`) | Latest monthly holdings — SPY5.L (equity) + WGLD.L (gold), split accordingly |
| Target2030-FT (`CIOIMU`) | Glide path estimate: ~25% equity / 75% bonds at 2026; Capital Guarantee confirmed ✅ |
| Momentum-LS (`CIOGLU`) | Net long/short exposure varies monthly; default: low market correlation, classify as alternatives |

## Analysis Depth

If user does not specify, ask:
- **Quick mode**: stock 15 min / ETF 20 min / portfolio scan
- **Full mode**: stock 60 min / ETF 45 min / portfolio with tax optimization

## Required Output Structure

Every analysis must include:

1. **結論首行** — 操作建議 + 信心水準 + Key Force（一句話）
2. **估值判斷** — 使用的估值方法與當前位置
3. **Pre-Mortem** — ≥ 3 條失敗路徑，含觸發信號與 Kill Condition
4. **反偏見結果** — 🔴 紅旗 / 🟡 黃旗 / ✅ 綠燈，附驗證依據
5. **監控計劃** — 下次檢視時間 + 關鍵觀察指標

Portfolio analysis additionally requires:

6. **偏離度診斷** — 現況 vs 全天候標準配置百分比差距（含 eToro 智慧組合解構後數值）
7. **稅務優化建議** — 二代健保試算 + 海外所得管理 + 執行順序

## Data Integrity Rules

- Tier 1 (must cite): Official data — central banks, SEC, exchanges, 財政部
- Tier 2 (usable): Bloomberg, Morningstar, FRED, S&P
- Tier 3 (reference only): Analyst reports, professional opinions
- ✘ Prohibited: trend extrapolation, vague descriptions, fabricated values
- ✘ Prohibited: subjective interpretation of Taiwan tax rules
- ✘ Prohibited: accepting anomalous quotes without flagging (e.g. BTC @ $31.05)

## Full Reference Index

See `references/instruction.md` for complete framework documentation.