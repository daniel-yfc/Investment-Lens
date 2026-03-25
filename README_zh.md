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

三個核心 Skill 為主軸，專項工具層層向它們供料。

```
┌───────────────────────────────────────────────────────────┐
│  alphaear-news      alphaear-search     alphaear-stock   │
│  (撷取新聞入庫)  (查詢本地 DB)   (OHLCV 數据)    │
│  alphaear-sentiment   alphaear-deepear-lite              │
└────────────────────────────┬─────────────────────────────┘
                           │ 數据供料
                           ▼
┌───────────────────────────────────────────────────────────┐
│                    investment-lens                       │
│   模式 A — 個股 / ETF / 加密貨分析                  │
│   模式 B — 投資組合診斷與再平衡                    │
│   模式 C — 個人配置與退休規劃                      │
│   模式 D — 訊號監控與狀態更新                      │
└──────────────┬────────────────────────────────────────────┘
               │ 量化交棒
               ▼
┌───────────────────────────────────────────────────────────┐
│                    quant-analysis                        │
│   VaR、最佳化、因子分析、GARCH、Monte Carlo、回測      │
│   回傳結構化輸出 + reintegration_note                │
└──────────────┬────────────────────────────────────────────┘
               │ 文字輸出
               ▼
┌───────────────────────────────────────────────────────────┐
│                   alphaear-reporter                      │
│   模式 A — 研究筆記                                   │
│   模式 B — 首次涂蓋報告（5 任務工作流）                │
│   模式 C — 投資人材料與簡報                         │
└───────────────────────────────────────────────────────────┘
```

---

## Skills 目錄

### 核心 Skills

| Skill | 角色 | 模式 |
|-------|------|-------|
| [`investment-lens`](skills/investment-lens/) | 主分析機核 | A: 個股分析、B: 投資組合診斷、C: 個人配置、D: 訊號監控 |
| [`quant-analysis`](skills/quant-analysis/) | 量化引擎 | VaR、最佳化、因子分析、GARCH、Monte Carlo、回測 |
| [`alphaear-reporter`](skills/alphaear-reporter/) | 輸出層 | A: 研究筆記、B: 首次涂蓋（5 任務）、C: 投資人材料 |

### AlphaEar 市場情報系統

| Skill | 功能 |
|-------|------|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | 從 DeepEar Lite 儀表板獲取即時金融訊號與傳導鏈路分析 |
| [`alphaear-news`](skills/alphaear-news/) | **撷取**即時財經新聞入庫（Reuters、Bloomberg、FT、CNBC、Nikkei、WSJ） |
| [`alphaear-search`](skills/alphaear-search/) | **查詢**本地新聞 DB（`engine='local'`）或即時網路搜尋（Jina / DDG） |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | 財經文本市場情緒分析（FinBERT / LLM） |
| [`alphaear-stock`](skills/alphaear-stock/) | 取得全球交易所原始歷史股價（OHLCV），經由 yfinance |
| [`alphaear-predictor`](skills/alphaear-predictor/) | 使用 Kronos 進行市場時間序列預測 |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | 建立傳導鏈路視覚化邏輯圖（Draw.io XML） |

### 投資組合管理

| Skill | 功能 |
|-------|------|
| [`update-quote`](skills/update-quote/) | 刷新投資組合 CSV 中的即時報價、基金淨値與匯率，重算台幣市値並更新 `value_date` |

### 機構級公司研究

| Skill | 功能 |
|-------|------|
| [`datapack-builder`](skills/datapack-builder/) | 從 CIM、SEC 申報萍取資料，建構符合投資委員會標準的 Excel 數据包 |

### 開發工具

| Skill | 功能 |
|-------|------|
| [`skill-creator`](skills/skill-creator/) | 建立與更新 Agent Skills — 設計、建構與打包新技能 |

---

## Skills 使用邊界

| 任務 | 使用 | 不使用 |
|------|------|--------|
| 個股與市場質化分析 | `investment-lens` 模式 A | `alphaear-reporter` |
| 個人資產配置與退休規劃 | `investment-lens` 模式 C | — |
| 投資組合診斷（全天候框架） | `investment-lens` 模式 B | `quant-analysis` |
| 監控現有投資訊號狀態 | `investment-lens` 模式 D | — |
| 程式化 VaR、最佳化、因子、GARCH | `quant-analysis` | `investment-lens` |
| 研究筆記與投資報告 | `alphaear-reporter` | `investment-lens` |
| 機構級首次涂蓋報告（5 任務） | `alphaear-reporter` 模式 B | — |
| 原始歷史股價資料（OHLCV） | `alphaear-stock` | `update-quote` |
| 刷新投資組吃 CSV 報價 | `update-quote` | `alphaear-stock` |
| 撷取即時財經新聞（寫入 DB） | `alphaear-news` | `alphaear-search` |
| 查詢本地已存新聞 | `alphaear-search` `engine='local'` | `alphaear-news` |

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
        └── ...（其他 skills）
```

**步驟三：開始使用**

啟動 Claude Code 後直接輸入指令，系統將自動路由至對應 Skill：

```
# 投資組合診斷
幫我診斷一下這個投資組合的全天候配置    → investment-lens 模式 B

# 個股分析
分析台積電目前的估値是否合理             → investment-lens 模式 A

# 個人配置規劃
我 45 歲，想規劃退休後的提領策略         → investment-lens 模式 C

# 訊號監控
我的台積電論點有變化嗎？                  → investment-lens 模式 D

# 量化風險分析
計算這個投資組合的 1 年期 95% VaR       → quant-analysis

# 首次涂蓋報告
幫我寫一份 TSMC 的首次涂蓋報告         → alphaear-reporter 模式 B

# 研究筆記
幫我寫一份研究筆記                        → alphaear-reporter 模式 A

# 更新報價
更新報價                                     → update-quote

# 歷史股價數据
幫我抓取台積電過去半年的原始歷史股價   → alphaear-stock
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
