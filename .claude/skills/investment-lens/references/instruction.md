---
name: instruction
description: 完整路由邏輯與文件清單文件索引（供系統內部參考）
version: 3.0
last_updated: 2026-03-12
---

# Investment Analyst Framework — Complete Reference Index v3.0

## Primary Frameworks

| File | Role | Version |
|------|------|---------|
| `tech-earnings-deepdive.md` | 個股財報深度分析 | v5.0 |
| `market-asset-analysis.md` | 市場/ETF/資產配置分析 | v1.0 |
| `all-seasons-portfolio.md` | 全天候組合診斷與建構 | v1.2 |
| `btc-bottom-model.md` | 比特幣週期底部判斷 | v2.0 |

## Method Toolbox (Layer 2)

| File | Role | Version |
|------|------|---------|
| `investing-philosophies.md` | 6大投資哲學 — 個股專用路由 | v3.0 |
| `investing-philosophies-ref.md` | 6大投資哲學 — 市場/組合通用版 | v2.1 |
| `valuation-models.md` | 多大師估值模型工具箱 | v2.0 |

## Anti-Bias System

| File | Role | Version |
|------|------|---------|
| `bias-checklist.md` | 個股反偏見與風控檢查 | v2.0 |
| `market-bias-checklist.md` | 市場配置反偏見檢查 | v1.0 |

## Specialist Modules (Layer 3, conditional)

| File | Role | Trigger | Version |
|------|------|---------|---------|
| `macro-liquidity.md` | 宏觀流動性監控與預警 | Key Force = 宏觀 | v2.0 |
| `us-value-investing.md` | 美股價值投資四維評分 | 美股深度分析 | v2.0 |

## User Input Guide (Asset)

| File | Role |
|------|------|
| `assets/portfolio-template.md` | 組合輸入格式引導（A/B/C 三格式） |

## Routing Decision Tree

用戶輸入
│
├─ 個股代碼/名稱
│ ├─ Load: tech-earnings-deepdive.md
│ ├─ Load: investing-philosophies.md + valuation-models.md
│ └─ After: bias-checklist.md
│
├─ ETF/指數/基金代碼
│ ├─ Load: market-asset-analysis.md
│ ├─ Load: investing-philosophies-ref.md + valuation-models.md
│ └─ After: market-bias-checklist.md
│
├─ BTC/ETH/加密貨幣
│ ├─ Load: btc-bottom-model.md
│ └─ After: bias-checklist.md
│
├─ 組合/全天候/退休/資產配置
│ ├─ Load: all-seasons-portfolio.md
│ ├─ If info incomplete: assets/portfolio-template.md
│ └─ After: market-bias-checklist.md
│
└─ 不明確
└─ Show: assets/portfolio-template.md (Format C)
