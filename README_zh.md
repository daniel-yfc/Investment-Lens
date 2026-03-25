# Investment-Lens — 金融 AI Agent Skills 集合

> 專為 Claude Code 設計的專業金融投資分析技能集合。
> 涵蓋質化投資分析、量化模型、機構級研究報告撰寫、市場情報與投資組合管理，
> 設計為一個相互協作的整合系統。

[![License: Proprietary](https://img.shields.io/badge/授權-Proprietary-red.svg)]()
[![Language: zh-TW / EN](https://img.shields.io/badge/語言-zh--TW%20%2F%20EN-blue.svg)]()
[![Standard: Agent Skills](https://img.shields.io/badge/標準-Agent%20Skills-green.svg)](https://agentskills.io/)

[English Version](README.md)

---

## 系統架構

本儲存庫以三個**核心 Skill** 為主軸，形成整合分析流程，其餘為專項輔助工具。

```
┌─────────────────────────────────────────────────────────┐
│                    investment-lens                       │
│   主樞紐：分析、診斷、資產配置（模式 A / B / C）           │
│   需要計算時，交棒給 quant-analysis                       │
└──────────────┬──────────────────────────────────────────┘
               │ 量化交棒
               ▼
┌─────────────────────────────────────────────────────────┐
│                    quant-analysis                        │
│   從屬引擎：VaR、最佳化、因子分析、                        │
│   GARCH、Monte Carlo、回測                               │
│   回傳結構化輸出 + reintegration_note                    │
└──────────────┬──────────────────────────────────────────┘
               │ 敘事輸出
               ▼
┌─────────────────────────────────────────────────────────┐
│                   alphaear-reporter                      │
│   統一輸出層：研究筆記、首次涵蓋報告、                     │
│   投資人材料 — 三種輸出模式                               │
└─────────────────────────────────────────────────────────┘
```

---

## Skills 目錄

### 核心 Skills

| Skill | 角色 | 主要 References | 主要 Assets |
|-------|------|----------------|-------------|
| [`investment-lens`](skills/investment-lens/) | 主分析樞紐 | `personal-allocation.md`、`quant-handoff.md`、`all-seasons-portfolio.md`、`valuation-models.md`、`bias-checklist.md` | `portfolio-template.md`、`allocation-template.md` |
| [`quant-analysis`](skills/quant-analysis/) | 量化引擎 | `model-selection.md` | `input-schema.md`、`output-schema.md` |
| [`alphaear-reporter`](skills/alphaear-reporter/) | 輸出層 | `coverage-format.md`、`investor-materials-format.md` | `report-templates/research-note.md`、`report-templates/initiating-coverage.md`、`report-templates/investor-brief.md` |

### AlphaEar 市場情報系統

| Skill | 功能 |
|-------|------|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | 從 DeepEar Lite 儀表板獲取即時金融訊號與傳導鏈路分析 |
| [`alphaear-news`](skills/alphaear-news/) | 熱門財經新聞、市場趨勢、預測市場數據（如 Polymarket） |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | 財經文本市場情緒分析（FinBERT / LLM） |
| [`alphaear-stock`](skills/alphaear-stock/) | 股票代碼查詢與原始歷史股價（OHLCV）數據 |
| [`alphaear-signal-tracker`](skills/alphaear-signal-tracker/) | 投資訊號演變追蹤，根據最新市場資訊更新邏輯 |
| [`alphaear-predictor`](skills/alphaear-predictor/) | 使用 Kronos 進行市場時間序列預測 |
| [`alphaear-search`](skills/alphaear-search/) | 金融網頁搜尋與本地 RAG 上下文搜尋 |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | 建立傳導鏈路視覺化邏輯圖（Draw.io XML） |

### 投資組合管理

| Skill | 功能 |
|-------|------|
| [`asset-allocation`](skills/asset-allocation/) | 基於 CFA 框架的個人財富管理與退休規劃 |
| [`update-quote`](skills/update-quote/) | 自動更新投資組合 CSV 中的市場報價、基金淨值與匯率 |

### 機構級公司研究

| Skill | 功能 |
|-------|------|
| [`initiating-coverage`](skills/initiating-coverage/) | 5 步驟機構級首次涵蓋研究報告工作流程 |
| [`datapack-builder`](skills/datapack-builder/) | 從 CIM、SEC 備案萃取資料，建構符合投資委員會標準的 Excel 數據包 |

### 開發工具

| Skill | 功能 |
|-------|------|
| [`skill-creator`](skills/skill-creator/) | 建立與更新 Agent Skills，設計、建構與打包新技能 |

---

## Skills 使用邊界

各 Skill 之間有明確邊界，確保 Agent 路由正確：

| 任務 | 使用 | 不使用 |
|------|------|--------|
| 個股與市場質化分析 | `investment-lens` | `alphaear-reporter` |
| 個人資產配置與退休規劃 | `investment-lens`（Mode C） | `asset-allocation` |
| 投資組合診斷（全天候框架） | `investment-lens` | `quant-analysis` |
| 程式化 VaR、最佳化、因子、GARCH | `quant-analysis` | `investment-lens` |
| 研究筆記與投資報告 | `alphaear-reporter` | `investment-lens` |
| 完整 5 步驟機構級首次涵蓋報告 | `initiating-coverage` | `alphaear-reporter` |
| 原始歷史股價（OHLCV）數據 | `alphaear-stock` | `investment-lens` |
| Excel DCF 估值模型 | `dcf-model` | `investment-lens` |
| 投資人材料與募資簡報 | `alphaear-reporter` | `investor-materials` |

---

## 快速開始

**步驟一：Clone 至你的專案**

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd your-project
mkdir -p .claude/
cp -r Investment-Lens/skills .claude/
```

**步驟二：確認目錄結構**

```
your-project/
└── .claude/
    └── skills/
        ├── investment-lens/
        │   ├── SKILL.md
        │   ├── assets/
        │   └── references/
        ├── quant-analysis/
        ├── alphaear-reporter/
        └── ... （其他 skills）
```

**步驟三：開始使用**

啟動 Claude Code 後，直接輸入指令，系統將自動路由至對應 Skill：

```
# 投資組合診斷
幫我診斷一下這個投資組合的全天候配置    → investment-lens

# 個股分析
分析台積電目前的估值是否合理             → investment-lens

# 個人配置規劃
我 45 歲，想規劃退休後的提領策略         → investment-lens Mode C

# 量化風險分析
計算這個投資組合的 1 年期 95% VaR       → quant-analysis

# 研究報告輸出
幫我寫一份研究筆記                        → alphaear-reporter

# 原始股價數據
幫我抓取特斯拉過去三個月的原始歷史股價   → alphaear-stock
```

---

## Skill 檔案結構

每個 Skill 遵循 [Agent Skills 開放標準](https://agentskills.io/)：

```
skills/<skill-name>/
├── SKILL.md          # 範圍、觸發條件、工作流程、輸出格式
├── assets/           # Agent 直接使用的靜態資源（模板、Schema）
└── references/       # Agent 讀取後再判斷如何行動的文件
```

**`assets/`** — 模板、Schema、查找表。Agent 直接套用內容，不需要判斷。

**`references/`** — 框架、指南、程序規則。Agent 讀取後依情境做決策。

---

## 標準與相容性

- **相容性**：Claude Code Skills（符合 [Agent Skills 開放標準](https://agentskills.io/)）
- **資產分類**：ISO 10962:2021 CFI 代碼
- **投資組合框架**：全天候（All-Seasons / All-Weather）
- **稅務情境**：台灣（二代健保補充保費、海外所得最低稅負制）
- **主要語言**：繁體中文（zh-TW）、英文
- **授權**：Proprietary

---

## 相關資源

- [Claude Code Skills 規格文件](https://code.claude.com/docs/en/skills)
- [Agent Skills 開放標準](https://agentskills.io/)
- [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
