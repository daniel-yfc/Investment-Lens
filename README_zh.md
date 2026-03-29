# Investment-Lens

> 以 Next.js 16 構建的 AI 投資分析平台，整合生成式 UI 元件、即時串流對話與機構級金融分析 Skills。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License: Proprietary](https://img.shields.io/badge/授權-Proprietary-red.svg)]()
[![Language](https://img.shields.io/badge/語言-zh--TW%20%2F%20EN-blue.svg)](README.md)

[English Version](README.md)

---

## 專案概述

Investment-Lens 是一個全端 Web 應用程式，結合 AI 對話介面與生成式 UI 元件，以即時串流方式呈現投資分析結果。後端封裝了一套金融 AI Agent Skills（`skills/`），並透過有身份驗證保護的 Next.js API 對外提供服務。

## 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 Web App (src/)                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Chat UI     │  │  Dashboard       │  │  Portfolio   │  │
│  │  (串流對話)  │  │  /reports        │  │  Heatmap     │  │
│  └──────┬───────┘  └──────────────────┘  └──────────────┘  │
│         │ SSE Stream                                         │
│  ┌──────▼────────────────────────────────────────────────┐  │
│  │  /api/v1/chat/stream  (身份驗證 + 速率限制)          │  │
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

## 快速開始

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

填入必要的值（詳見 `.env.example` 說明）：

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

**驗證：** 需要有效的 Session（NextAuth）

**速率限制：** 每用戶每分鐘 20 次

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

## Agent Skills 說明

`skills/` 目錄包含一套相容 Claude Code 的 AI Agent Skills，專為金融投資分析設計。
三個核心 Skill 為主軸，專項工具層層向它們供料。

```
┌───────────────────────────────────────────────────────────┐
│  alphaear-news      alphaear-search     alphaear-stock    │
│  alphaear-sentiment   alphaear-deepear-lite               │
└────────────────────────────┬──────────────────────────────┘
                             │ 數據供料
                             ▼
┌───────────────────────────────────────────────────────────┐
│                    investment-lens                        │
│   模式 A — 個股 / ETF / 加密貨幣分析                │
│   模式 B — 投資組合診斷與再平衡                     │
│   模式 C — 個人配置與退休規劃                       │
│   模式 D — 訊號監控與狀態更新                       │
└──────────────┬────────────────────────────────────────────┘
               │ 量化交棒
               ▼
┌───────────────────────────────────────────────────────────┐
│                    quant-analysis                         │
│   VaR、最佳化、因子分析、GARCH、Monte Carlo、回測       │
└──────────────┬────────────────────────────────────────────┘
               │ 文字輸出
               ▼
┌───────────────────────────────────────────────────────────┐
│                   alphaear-reporter                       │
│   模式 A — 研究筆記                                    │
│   模式 B — 首次涵蓋報告（5 任務工作流）                │
│   模式 C — 投資人材料與簡報                          │
└───────────────────────────────────────────────────────────┘
```

### Skills 目錄

| Skill | 角色 |
|---|---|
| `investment-lens` | 主分析核心（模式 A/B/C/D） |
| `quant-analysis` | 量化引擎（VaR、GARCH、Monte Carlo） |
| `alphaear-reporter` | 輸出層（研究筆記、首次涵蓋、投資人材料） |
| `alphaear-stock` | 全球交易所 OHLCV 歷史股價（yfinance） |
| `alphaear-news` | 即時財經新聞撷取入庫 |
| `alphaear-search` | 本地 DB 或即時網路混合搜尋 |
| `alphaear-sentiment` | 財經文本情緒分析（FinBERT / LLM） |
| `alphaear-deepear-lite` | DeepEar Lite 即時金融訊號 |
| `alphaear-predictor` | Kronos 時間序列預測 |
| `update-quote` | 刷新投資組合 CSV 報價與台幣市值 |
| `value-at-risk-calculator` | 獨立 VaR / CVaR / Basel III/IV 驗證 |
| `datapack-builder` | CIM / SEC 申報萃取，建構機構級 Excel 數據包 |
| `skill-creator` | 建立與更新 Agent Skills |

### 將 Skills 整合至 Claude Code

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd your-project
mkdir -p .claude/
cp -r Investment-Lens/skills .claude/
```

---

## 授權

Proprietary — All rights reserved.
