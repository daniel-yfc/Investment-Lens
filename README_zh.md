# Investment-Lens

> 以 Next.js 16 構建的 AI 投資分析平台，整合生成式 UI 元件、即時串流對話，以及專為 Claude Code 設計的機構級金融分析 Agent Skills 集合。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Standard: Agent Skills](https://img.shields.io/badge/標準-Agent%20Skills-green.svg)](https://agentskills.io/)
[![License: Proprietary](https://img.shields.io/badge/授權-Proprietary-red.svg)]()
[![Language](https://img.shields.io/badge/語言-zh--TW%20%2F%20EN-blue.svg)](README.md)

[English Version](README.md)

---

## 專案概述

Investment-Lens 分為兩層：

- **Web App** (`src/`) — Next.js 16 全端應用程式，提供串流 AI 對話介面、生成式 UI 元件、投資組合熱圖與報告閱讀器。
- **Agent Skills** (`skills/`) — 相容 Claude Code 的金融分析 Skill 集合，涵蓋質化分析、量化模型、機構級研究、市場情報與投資組合管理。

---

## Web App 架構

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 Web App (src/)                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Chat UI     │  │  Dashboard       │  │  Portfolio   │  │
│  │  (串流對話)  │  │  /reports        │  │  Heatmap     │  │
│  └──────┬───────┘  └──────────────────┘  └──────────────┘  │
│         │ SSE Stream                                         │
│  ┌──────▼────────────────────────────────────────────────┐  │
│  │  /api/v1/chat/stream  (身份驗證 + 速率限制)           │  │
│  └──────┬────────────────────────────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│  Agent Skills (skills/)                                     │
│  investment-lens · quant-analysis · alphaear-reporter       │
│  alphaear-stock · alphaear-news · alphaear-search · ...     │
└─────────────────────────────────────────────────────────────┘
```

## 技術架構

| 層次 | 技術 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 語言 | TypeScript 5 |
| 樣式 | Tailwind CSS v4 |
| UI 元件 | shadcn/ui + Radix UI |
| 狀態管理 | Zustand |
| 動畫 | Framer Motion |
| 圖形 / 流程圖 | @xyflow/react |
| 身份驗證 | Auth.js (NextAuth v5) |
| 資料庫 | Neon (PostgreSQL) + Drizzle ORM |
| 速率限制 | Upstash Redis |
| AI 串流 | AI SDK (OpenAI) |
| 圖表 | Recharts |
| 測試 | Playwright (E2E) |
| 部署 | Vercel |

## 主要功能

- **串流對話介面** — 即時 SSE 串流，搭配 `SkillProgressTracker` 與生成式 UI 渲染
- **生成式 UI 元件** — `AnalysisResultCard`、`SignalChainGraph`、`SkillProgressTracker`、`ReportReader`
- **投資組合熱圖** — 視覺化投資組合配置與績效總覽
- **報告閱讀器** — 結構化投資報告介面，側欄目錄自動跟隨捲動
- **身份驗證保護** — 所有 API 路由均需通過 NextAuth v5 Session 驗證
- **速率限制** — 每用戶每分鐘最多 20 次請求（SE-02）
- **CSP Headers** — 透過 Middleware 強制執行 Content Security Policy（SE-03）

## 專案結構

```
Investment-Lens/
├── src/
│   ├── app/                    # Next.js App Router 頁面與 API
│   │   ├── api/v1/chat/stream/ # SSE 串流端點
│   │   └── dashboard/          # 受保護的 Dashboard 頁面
│   ├── components/
│   │   ├── chat/               # ChatInput、MessageFeed、MessageBubble、StreamingTextBlock
│   │   ├── generative/         # AnalysisResultCard、SignalChainGraph、SkillProgressTracker、ReportReader
│   │   ├── portfolio/          # PortfolioHeatmap
│   │   └── ui/                 # shadcn/ui 基礎元件
│   ├── hooks/                  # useStreamingChat、useTranslate
│   ├── lib/                    # utils、rate-limiter、export-pdf
│   ├── store/                  # Zustand chat store
│   ├── types/                  # skill.types、stream.types
│   ├── auth.ts                 # Auth.js 設定
│   └── middleware.ts           # Auth 重新導向 + CSP Headers
├── skills/                     # AI Agent Skills（相容 Claude Code）
├── tests/                      # Playwright E2E 測試
└── drizzle.config.ts           # 資料庫 Schema 設定
```

## 快速開始（Web App）

### 1. Clone 與安裝

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd Investment-Lens
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env.local
```

填入必要的值：

```bash
# 必填
AUTH_SECRET=$(openssl rand -base64 32)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgres://...

# 速率限制（生產環境必填）
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

### 4. 執行 E2E 測試

```bash
npx playwright test
```

## API 說明

### `POST /api/v1/chat/stream`

以 Server-Sent Events 串流回傳投資分析結果。

**驗證：** 需要有效的 Session（NextAuth）→ 無 Session 時回傳 `401`

**速率限制：** 每用戶每分鐘 20 次 → 超過時回傳 `429` 與 `Retry-After`

**Request：**
```json
{ "message": "2330.TW" }
```

**串流事件類型：**

| 類型 | 說明 |
|---|---|
| `text` | 串流文字內容 |
| `skill_progress` | Skill 執行進度更新 |
| `tool_call` | 工具呼叫事件 |
| `tool_result` | 生成式 UI 元件 payload |
| `[DONE]` | 串流結束 |

## 安全規格

| 需求 | 實作 |
|---|---|
| SE-01：未驗證 API → 401 | Route handler 的 `auth()` 保護 |
| SE-02：速率限制 20 req/min → 429 | 記憶體速率限制器（Edge 相容） |
| SE-03：CSP Headers | `middleware.ts` |
| FA-07：/dashboard/* 重新導向 → /login | `middleware.ts` matcher |
| Ticker 輸入驗證 | Regex 白名單 `/^[A-Z0-9]{1,6}(\.[A-Z]{1,3})?$/` |

---

## Agent Skills

三個核心 Skill 為主軸，專項工具層層向它們供料。

```
┌───────────────────────────────────────────────────────────┐
│  alphaear-news      alphaear-search     alphaear-stock    │
│  （擷取新聞入庫）  （查詢本地 DB）   （OHLCV 數據）    │
│  alphaear-sentiment   alphaear-deepear-lite               │
└────────────────────────────┬──────────────────────────────┘
                            │ 數據供料
                            ▼
┌───────────────────────────────────────────────────────────┐
│                    investment-lens                        │
│   模式 A — 個股 / ETF / 加密貨幣分析                     │
│   模式 B — 投資組合診斷與再平衡                          │
│   模式 C — 個人配置與退休規劃                            │
│   模式 D — 訊號監控與狀態更新                            │
│   ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ │
│   scripts/ — Agentic Pipeline                            │
│     fin_agent.py · ISQ schema · toolkits · utils         │
└──────────────┬────────────────────────────────────────────┘
               │ 量化交棒
               ▼
┌───────────────────────────────────────────────────────────┐
│                    quant-analysis                         │
│   VaR、最佳化、因子分析、GARCH、Monte Carlo、回測        │
│   回傳結構化輸出 + reintegration_note                    │
└──────────────┬────────────────────────────────────────────┘
               │ 文字輸出
               ▼
┌───────────────────────────────────────────────────────────┐
│                   alphaear-reporter                       │
│   模式 A — 研究筆記                                      │
│   模式 B — 首次涵蓋報告（5 任務工作流）                  │
│   模式 C — 投資人材料與簡報                              │
└───────────────────────────────────────────────────────────┘
```

### 核心 Skills

| Skill | 角色 | 模式 |
|---|---|---|
| [`investment-lens`](skills/investment-lens/) | 主分析核心 | A: 個股分析、B: 投資組合診斷、C: 個人配置、D: 訊號監控 |
| [`quant-analysis`](skills/quant-analysis/) | 量化引擎 | VaR、最佳化、因子分析、GARCH、Monte Carlo、回測 |
| [`alphaear-reporter`](skills/alphaear-reporter/) | 輸出層 | A: 研究筆記、B: 首次涵蓋（5 任務）、C: 投資人材料 |

### AlphaEar 市場情報系統

| Skill | 功能 |
|---|---|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | 從 DeepEar Lite 儀表板獲取即時金融訊號與傳導鏈路分析 |
| [`alphaear-news`](skills/alphaear-news/) | **擷取**即時財經新聞入庫（Reuters、Bloomberg、FT、CNBC、Nikkei、WSJ） |
| [`alphaear-search`](skills/alphaear-search/) | **查詢**本地新聞 DB（`engine='local'`）或即時網路搜尋（Jina / DDG） |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | 財經文本市場情緒分析（FinBERT / LLM） |
| [`alphaear-stock`](skills/alphaear-stock/) | 取得全球交易所原始歷史股價（OHLCV），經由 yfinance |
| [`alphaear-predictor`](skills/alphaear-predictor/) | 使用 Kronos 進行市場時間序列預測 |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | 建立傳導鏈路視覺化邏輯圖（Draw.io XML） |

### 投資組合管理

| Skill | 功能 |
|---|---|
| [`update-quote`](skills/update-quote/) | 刷新投資組合 CSV 中的即時報價、基金淨值與匯率，重算台幣市值並更新 `value_date` |
| [`value-at-risk-calculator`](skills/value-at-risk-calculator/) | 獨立 VaR 風險計量：歷史模擬、參數法、Monte Carlo、CVaR、壓力測試、Basel III/IV 回測驗證 |

### 機構級公司研究

| Skill | 功能 |
|---|---|
| [`datapack-builder`](skills/datapack-builder/) | 從 CIM、SEC 申報萃取資料，建構符合投資委員會標準的 Excel 數據包 |

### 開發工具

| Skill | 功能 |
|---|---|
| [`skill-creator`](skills/skill-creator/) | 建立與更新 Agent Skills — 設計、建構與打包新技能 |

### investment-lens Agentic Pipeline

`investment-lens` 包含一組 Python agentic pipeline，位於 `skills/investment-lens/scripts/`。主要由**模式 D（訊號監控）**使用，但所有模式皆可調用。

| 模組 | 路徑 | 功能 |
|---|---|---|
| 入口腳本 | `scripts/fin_agent.py` | 協調 FinResearcher → FinAnalyst → Signal Tracking 流程 |
| Prompt 定義 | `references/PROMPTS.md` | FinResearcher、FinAnalyst、訊號追蹤三組 prompt |
| ISQ Schema | `scripts/schema/isq_template.py` | `InvestmentSignal` JSON 物件結構定義 |
| 資料模型 | `scripts/schema/models.py` | 配套 Pydantic 模型 |
| 工具集 | `scripts/tools/toolkits.py` | 報價查詢、新聞擷取、網路搜尋 |
| 資料庫管理 | `scripts/utils/database_manager.py` | 本地訊號 DB 讀寫 |
| 混合搜尋 | `scripts/utils/hybrid_search.py` | 本地 + 網路混合搜尋 |
| LLM 路由 | `scripts/utils/llm/router.py` | 模型選擇與能力路由 |
| 預測器 | `scripts/utils/predictor/` | Kronos 時間序列預測（K 線生成、評估、模型） |

### Skills 使用邊界

| 任務 | 使用 | 不使用 |
|---|---|---|
| 個股與市場質化分析 | `investment-lens` 模式 A | `alphaear-reporter` |
| 個人資產配置與退休規劃 | `investment-lens` 模式 C | — |
| 投資組合診斷（全天候框架） | `investment-lens` 模式 B | `quant-analysis` |
| 監控現有投資訊號狀態 | `investment-lens` 模式 D | — |
| 程式化 VaR、最佳化、因子、GARCH | `quant-analysis` | `investment-lens` |
| 獨立 VaR / CVaR / Basel 回測驗證 | `value-at-risk-calculator` | `quant-analysis` |
| 研究筆記與投資報告 | `alphaear-reporter` | `investment-lens` |
| 機構級首次涵蓋報告（5 任務） | `alphaear-reporter` 模式 B | — |
| 原始歷史股價資料（OHLCV） | `alphaear-stock` | `update-quote` |
| 刷新投資組合 CSV 報價 | `update-quote` | `alphaear-stock` |
| 擷取即時財經新聞（寫入 DB） | `alphaear-news` | `alphaear-search` |
| 查詢本地已存新聞 | `alphaear-search` `engine='local'` | `alphaear-news` |

### 快速開始（僅使用 Skills）

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd your-project
mkdir -p .claude/
cp -r Investment-Lens/skills .claude/
```

確認目錄結構：

```
your-project/
└── .claude/
    └── skills/
        ├── investment-lens/
        │   ├── SKILL.md
        │   ├── assets/
        │   ├── references/
        │   └── scripts/
        ├── quant-analysis/
        ├── alphaear-reporter/
        └── ...（其他 skills）
```

啟動 Claude Code 後直接輸入指令，系統將自動路由至對應 Skill：

```
# 個股分析
分析台積電目前的估值是否合理             → investment-lens 模式 A

# 投資組合診斷
幫我診斷一下這個投資組合的全天候配置     → investment-lens 模式 B

# 個人配置規劃
我 45 歲，想規劃退休後的提領策略          → investment-lens 模式 C

# 訊號監控
我的台積電論點有變化嗎？                   → investment-lens 模式 D

# 量化風險分析
計算這個投資組合的 1 年期 95% VaR        → quant-analysis

# 獨立 VaR + Basel 回測
執行歷史模擬 VaR 並做 Kupiec 檢定         → value-at-risk-calculator

# 首次涵蓋報告
幫我寫一份 TSMC 的首次涵蓋報告           → alphaear-reporter 模式 B

# 研究筆記
幫我寫一份研究筆記                         → alphaear-reporter 模式 A

# 更新報價
更新報價                                    → update-quote

# 歷史股價數據
幫我抓取台積電過去半年的原始歷史股價      → alphaear-stock
```

### Skill 檔案結構

每個 Skill 遵循 [Agent Skills 開放標準](https://agentskills.io/)：

```
skills/<skill-name>/
├── SKILL.md          # 範圍、觸發條件、工作流程、輸出格式
├── assets/           # Agent 直接使用的靜態資源（模板、Schema）
├── references/       # Agent 讀取後再判斷如何行動的文件
└── scripts/          # Python pipeline（目前僅 investment-lens 包含）
```

- **`assets/`** — 模板、Schema、查找表。Agent 直接套用內容，不需要判斷。
- **`references/`** — 框架、指南、程序規則。Agent 讀取後依情境做決策。
- **`scripts/`** — Python agentic pipeline（目前為 `investment-lens`）。入口：`fin_agent.py`。

### 標準與相容性

- **相容性**：Claude Code Skills（符合 [Agent Skills 開放標準](https://agentskills.io/)）
- **資產分類**：ISO 10962:2021 CFI 代碼
- **投資組合框架**：全天候（All-Seasons / All-Weather）
- **稅務情境**：台灣（二代健保補充保費、海外所得最低稅負制）
- **主要語言**：繁體中文（zh-TW）、英文

### 相關資源

- [Claude Code Skills 規格文件](https://code.claude.com/docs/en/skills)
- [Agent Skills 開放標準](https://agentskills.io/)
- [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)

---

## 授權

Proprietary — All rights reserved.
