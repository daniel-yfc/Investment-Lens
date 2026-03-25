# Investment-Lens — 系統規格書
## System Specification Document

**文件版本:** 3.0.0
**發布日期:** 2026-03-26
**專案儲存庫:** https://github.com/daniel-yfc/Investment-Lens
**適用語言:** 繁體中文 (zh-TW) / English
**密級:** 內部使用（Internal Use Only）

---

## 文件控制

| 版本  | 日期       | 作者          | 變更說明                        |
|-------|------------|---------------|---------------------------------|
| 1.0.0 | 2026-03-01 | Daniel YFC    | 初稿                            |
| 2.0.0 | 2026-03-26 | Daniel YFC    | 整合前端架構、Generative UI 規格 |
| 3.0.0 | 2026-03-26 | Daniel YFC    | 獨立完整規格書，含測試與驗收     |

---

## 目錄

1. [系統概述](#1-系統概述)
2. [技術棧](#2-技術棧)
3. [介面設計](#3-介面設計)
4. [前端目錄結構](#4-前端目錄結構)
5. [App Router 路由樹](#5-app-router-路由樹)
6. [Generative UI 元件規格](#6-generative-ui-元件規格)
7. [Zustand Store 介面定義](#7-zustand-store-介面定義)
8. [Core Web Vitals 達成策略](#8-core-web-vitals-達成策略)
9. [Error Boundary 與 Stream 中斷 Fallback](#9-error-boundary-與-stream-中斷-fallback)
10. [Tailwind 自訂斷點宣告](#10-tailwind-自訂斷點宣告)
11. [API 介面規格](#11-api-介面規格)
12. [資料模型與資料庫 Schema](#12-資料模型與資料庫-schema)
13. [安全規格](#13-安全規格)
14. [開發階段規劃](#14-開發階段規劃)
15. [驗收標準](#15-驗收標準)
16. [測試案例](#16-測試案例)
17. [部署架構](#17-部署架構)
18. [附錄](#18-附錄)

---

## 1. 系統概述

### 1.1 系統定位

Investment-Lens 是一套專業級金融投資分析 AI Web 應用，以 Agent Skills 架構為核心，
整合質性分析、量化建模、市場情報與投資組合管理功能，為機構投資人與專業個人投資者
提供全方位投資決策支援。前端採用 Next.js 15 App Router 搭配 Vercel AI SDK Generative UI，
實現流式 AI 回應與動態元件渲染。

### 1.2 系統願景

- 全球市場覆蓋：NYSE、NASDAQ、LSE、TSE、TWSE、HKEX 等主要交易所
- 繁體中文優先：所有 UI 與輸出預設為 zh-TW
- 漸進式披露：三層資訊載入（Metadata → Instructions → Resources）
- 人機協作：AI 生成結合人類專業判斷，確保可解釋性

### 1.3 核心技能架構

```
資料攝取層
  alphaear-news / alphaear-search / alphaear-stock
  alphaear-sentiment / alphaear-deepear-lite
          │
          ▼ data feeds
分析中樞 investment-lens
  Mode A — 證券分析
  Mode B — 投資組合診斷
  Mode C — 個人配置規劃
  Mode D — 信號監控
          │
          ├─── 量化升級 ──► quant-analysis
          │                  VaR / 優化 / GARCH / 蒙特卡洛
          │
          └─── 報告輸出 ──► alphaear-reporter
                             Mode A: 研究筆記
                             Mode B: 首次覆蓋（5步）
                             Mode C: 投資者材料
```

### 1.4 設計原則

1. **Streaming First**：所有 AI 回應透過 SSE 串流，首個 token < 2 秒
2. **Skill Isolation**：每個 Agent Skill 有明確邊界，不重疊職責
3. **Type Safety**：全面 TypeScript 嚴格模式，Zod 驗證所有 API 輸入輸出
4. **Accessibility**：WCAG 2.1 AA 合規，shadcn/ui 內建 ARIA 支援
5. **Resilience**：多層錯誤處理，Stream 中斷不白屏，數據源自動備援

---

## 2. 技術棧

### 2.1 完整技術棧總覽

| 編號 | 層級         | 技術                          | 版本      | 用途                               |
|------|--------------|-------------------------------|-----------|------------------------------------|
| T-01 | 前端框架     | Next.js                       | 15.x      | App Router、React Server Components |
| T-02 | UI 元件庫    | shadcn/ui                     | Latest    | 可訪問、可客製化基礎元件            |
| T-03 | 樣式系統     | Tailwind CSS                  | v4.x      | Utility-first CSS                  |
| T-04 | AI SDK       | Vercel AI SDK                 | 4.x       | Generative UI、流式渲染             |
| T-05 | 狀態管理     | Zustand                       | 5.x       | 全域狀態、AI 狀態管理               |
| T-06 | 金融圖表     | Recharts                      | 2.x       | OHLCV 圖表、投資組合視覺化         |
| T-07 | 流程圖       | React Flow                    | 12.x      | 信號鏈有向圖                       |
| T-08 | 型別系統     | TypeScript                    | 5.x       | 嚴格模式 (`strict: true`)          |
| T-09 | 表單驗證     | Zod + React Hook Form         | Latest    | Schema 驗證、受控表單              |
| T-10 | 後端運行時   | Node.js                       | 22 LTS    | API Routes、Server Actions          |
| T-11 | 關聯資料庫   | PostgreSQL                    | 16.x      | 結構化資料持久化                   |
| T-12 | 向量資料庫   | Pinecone                      | Latest    | RAG、語義搜索                      |
| T-13 | 快取         | Redis (Upstash)               | 7.x       | 會話、速率限制、任務隊列            |
| T-14 | 認證         | Auth.js (NextAuth)            | 5.x       | JWT + OAuth 2.0 (Google/GitHub)    |
| T-15 | ORM          | Drizzle ORM                   | Latest    | 型別安全資料庫查詢                  |
| T-16 | 邊緣部署     | Vercel + Cloudflare Workers   | —         | Edge Network、CDN、KV 快取         |
| T-17 | 測試框架     | Vitest + Playwright           | Latest    | 單元、整合、E2E 測試               |
| T-18 | CI/CD        | GitHub Actions                | —         | 自動化測試、部署流程               |

### 2.2 AI 模型配置

| 用途           | 主要模型              | 備援模型          |
|----------------|-----------------------|-------------------|
| 主分析引擎     | Claude Sonnet 4.5     | Claude Haiku 3.5  |
| 量化解讀       | Claude Opus 4         | GPT-4o            |
| 快速查詢       | Claude Haiku 3.5      | GPT-4o-mini       |
| 嵌入向量       | text-embedding-3-large| —                 |

---

## 3. 介面設計

### 3.1 設計語言

- **色系**：深色金融儀表板風格（主背景 `zinc-950`，卡片 `zinc-900`）
- **語義色**：
  - Buy / 正面訊號：`emerald-500` (#10b981)
  - Sell / 負面訊號：`rose-500` (#f43f5e)
  - Neutral / 警告：`amber-400` (#f59e0b)
  - Risk Critical：`rose-700` (#be123c)
- **字型**：`Inter`（英數）+ `Noto Sans TC`（中文），等寬 `JetBrains Mono`（程式碼）
- **圓角**：卡片 `rounded-xl`，按鈕 `rounded-lg`，標籤 `rounded-full`
- **陰影**：`shadow-lg shadow-black/40` 強調層次感

### 3.2 版面結構

```
┌──────────────────────────────────────────────────────┐
│  TopBar（Logo / 搜索 / 通知 / 用戶頭像）              │
├──────────────┬───────────────────────────────────────┤
│              │  主要內容區                            │
│  Sidebar     │  ┌─────────────────────────────────┐  │
│  （導航）    │  │  ChatInput + MessageFeed         │  │
│              │  │  AnalysisResultCard              │  │
│  - 對話      │  │  StockChartWidget                │  │
│  - 分析      │  │  SkillProgressTracker            │  │
│  - 組合      │  └─────────────────────────────────┘  │
│  - 信號      │                                        │
│  - 報告      │  右側 Panel（可折疊）                  │
│  - 設定      │  圖表 / 報告 / 組合詳情                │
└──────────────┴───────────────────────────────────────┘
```

### 3.3 漸進披露（三層）

| 層級 | 觸發方式   | 顯示內容                                     |
|------|------------|----------------------------------------------|
| L1   | 預設顯示   | 評級徽章、信心度、一句 Thesis 摘要           |
| L2   | 點擊展開   | 完整分析文字、風險標記、Kill Conditions       |
| L3   | 點擊「詳情」| 互動圖表、量化輸出數字、可下載報告連結       |

### 3.4 響應式行為

| 斷點 | 寬度      | 版面行為                          |
|------|-----------|-----------------------------------|
| xs   | 375px     | 單欄，Sidebar 收合至 Bottom Nav   |
| sm   | 640px     | 單欄，Sidebar 可滑出              |
| md   | 768px     | 雙欄（Sidebar 固定 + 主內容）     |
| lg   | 1024px    | 雙欄，右側 Panel 可展開           |
| xl   | 1280px    | 三欄（Sidebar + 主內容 + Panel）  |
| 2xl  | 1536px    | 三欄，圖表寬度擴大，密度提高      |
| 3xl  | 1920px    | 超寬儀表板模式，多圖並排          |

---

## 4. 前端目錄結構

```
investment-lens-web/
│
├── app/                                   # Next.js 15 App Router 根目錄
│   ├── layout.tsx                         # Root Layout（字型、主題、Auth Session）
│   ├── globals.css                        # Tailwind v4 指令 + CSS 變數
│   ├── not-found.tsx                      # 全域 404
│   ├── error.tsx                          # 全域 Error Boundary（Client Component）
│   │
│   ├── (auth)/                            # 認證路由群組（無 Shell Layout）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                       # 主應用路由群組（含 Shell Layout）
│   │   ├── layout.tsx                     # Dashboard Shell（Sidebar + TopBar）
│   │   ├── page.tsx                       # 首頁 / 對話入口
│   │   │
│   │   ├── analysis/
│   │   │   ├── page.tsx                   # 分析歷史列表
│   │   │   ├── loading.tsx                # Suspense Loading UI
│   │   │   └── [ticker]/
│   │   │       ├── page.tsx               # 單一證券分析頁（RSC）
│   │   │       └── loading.tsx
│   │   │
│   │   ├── portfolio/
│   │   │   ├── page.tsx                   # 投資組合總覽
│   │   │   ├── loading.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx               # 單一組合詳情
│   │   │   │   └── loading.tsx
│   │   │   └── optimize/
│   │   │       └── page.tsx               # 量化優化視圖
│   │   │
│   │   ├── signals/
│   │   │   ├── page.tsx                   # 信號監控（Mode D）
│   │   │   └── [signalId]/
│   │   │       └── page.tsx               # 單一信號詳情
│   │   │
│   │   ├── reports/
│   │   │   ├── page.tsx                   # 報告列表
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 報告閱讀器
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts               # Auth.js 處理器
│       ├── v1/
│       │   ├── chat/
│       │   │   └── stream/
│       │   │       └── route.ts           # SSE 流式對話端點
│       │   ├── skills/
│       │   │   └── [name]/
│       │   │       └── invoke/
│       │   │           └── route.ts       # 技能呼叫端點
│       │   └── data/
│       │       ├── stocks/
│       │       │   └── [ticker]/
│       │       │       └── history/
│       │       │           └── route.ts
│       │       ├── portfolio/
│       │       │   └── [id]/
│       │       │       └── route.ts
│       │       └── fx/
│       │           └── route.ts
│       └── webhooks/
│           └── route.ts
│
├── components/
│   ├── ui/                                # shadcn/ui 原始元件（不修改）
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   │
│   ├── generative/                        # Generative UI 元件（核心）
│   │   ├── AnalysisResultCard.tsx
│   │   ├── SkillProgressTracker.tsx
│   │   ├── StockChartWidget.tsx
│   │   ├── PortfolioHeatmap.tsx
│   │   ├── SignalChainGraph.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── StreamingTextBlock.tsx
│   │   ├── QuantOutputTable.tsx
│   │   ├── AllocationPieChart.tsx
│   │   └── GenerativeErrorBoundary.tsx
│   │
│   ├── chat/
│   │   ├── ChatInput.tsx
│   │   ├── MessageFeed.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ToolCallIndicator.tsx
│   │
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       ├── MobileNav.tsx
│       └── RightPanel.tsx
│
├── lib/
│   ├── ai/
│   │   ├── orchestrator.ts               # Skill Router（意圖識別 → 技能路由）
│   │   ├── stream-handlers.ts            # SSE 串流處理 + Fallback 邏輯
│   │   ├── tool-registry.ts              # AI SDK 工具登錄
│   │   └── prompt-templates.ts          # 系統提示模板
│   │
│   ├── data-providers/
│   │   ├── fallback-chain.ts            # 多源備援鏈（P1→P2→P3）
│   │   ├── us-stock.ts                  # FMP → Alpha Vantage → Yahoo
│   │   ├── tw-stock.ts                  # Fugle → TWSE → FinMind
│   │   ├── fund.ts                      # FinMind → TDCC → SITCA
│   │   └── fx-rate.ts                   # Exchange Rate API → Yahoo → BOT
│   │
│   ├── db/
│   │   ├── schema.ts                    # Drizzle ORM Schema 定義
│   │   ├── queries/
│   │   │   ├── portfolio.ts
│   │   │   ├── messages.ts
│   │   │   └── skills.ts
│   │   └── migrations/
│   │
│   ├── auth/
│   │   └── config.ts                    # Auth.js 設定
│   │
│   └── utils/
│       ├── format.ts                    # 數字、日期、貨幣格式化
│       ├── market-hours.ts              # 市場交易時段判斷
│       └── rate-limiter.ts              # API 速率限制（Redis backed）
│
├── store/                               # Zustand Store（見第 7 節）
│   ├── chat.store.ts
│   ├── analysis.store.ts
│   ├── portfolio.store.ts
│   └── ui.store.ts
│
├── types/
│   ├── api.types.ts                     # API 請求/回應型別
│   ├── portfolio.types.ts               # 投資組合相關型別
│   ├── skill.types.ts                   # Agent Skill 型別
│   ├── chart.types.ts                   # 圖表 Props 型別
│   └── stream.types.ts                  # SSE 事件型別
│
├── hooks/
│   ├── useStreamingChat.ts              # SSE 串流 hook
│   ├── usePortfolio.ts                  # 投資組合操作 hook
│   └── useAnalysis.ts                   # 分析狀態 hook
│
├── public/
│   ├── fonts/                           # 自托管字型
│   └── icons/
│
├── __tests__/                           # 單元 + 整合測試
│   ├── components/
│   ├── store/
│   ├── api/
│   └── lib/
│
├── e2e/                                 # Playwright E2E 測試
│   ├── analysis-flow.spec.ts
│   ├── portfolio-flow.spec.ts
│   └── auth.spec.ts
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── .env.example
```

---

## 5. App Router 路由樹

```
/                              → (dashboard)/page.tsx           [對話首頁]
│
├── /login                     → (auth)/login/page.tsx
├── /register                  → (auth)/register/page.tsx
│
├── /analysis                  → analysis/page.tsx              [分析歷史]
├── /analysis/:ticker          → analysis/[ticker]/page.tsx     [即時分析]
│
├── /portfolio                 → portfolio/page.tsx             [組合總覽]
├── /portfolio/:id             → portfolio/[id]/page.tsx        [組合詳情]
├── /portfolio/optimize        → portfolio/optimize/page.tsx    [量化優化]
│
├── /signals                   → signals/page.tsx               [信號監控]
├── /signals/:signalId         → signals/[signalId]/page.tsx    [信號詳情]
│
├── /reports                   → reports/page.tsx               [報告列表]
├── /reports/:id               → reports/[id]/page.tsx          [報告閱讀器]
│
└── /settings                  → settings/page.tsx

─── API 路由 ───────────────────────────────────────────────────

POST   /api/auth/[...nextauth]            Auth.js 認證處理器
POST   /api/v1/chat/stream                SSE 流式對話（主要 AI 端點）
POST   /api/v1/skills/:name/invoke        技能直接呼叫（同步/異步）
GET    /api/v1/data/stocks/:ticker/history 股價歷史
GET    /api/v1/data/portfolio/:id         投資組合資料
GET    /api/v1/data/fx                    即時匯率
POST   /api/webhooks                      外部系統回呼
```

---

## 6. Generative UI 元件規格

### 6.1 `AnalysisResultCard`

分析結果主展示元件，由 SSE 串流填充。

```typescript
// types/skill.types.ts
type Recommendation = 'Buy' | 'Hold' | 'Sell' | 'Neutral'
type Confidence     = 'High' | 'Medium' | 'Low'

interface RiskItem {
  id:       string
  label:    string
  severity: 'critical' | 'high' | 'medium' | 'low'
  detail?:  string
}

interface AnalysisResultCardProps {
  // 核心輸出
  ticker:          string
  recommendation:  Recommendation
  confidence:      Confidence
  thesis:          string
  counterThesis:   string
  keyRisks:        RiskItem[]
  killConditions:  string[]
  validAsOf:       string          // ISO 8601
  // 串流控制
  isStreaming?:    boolean          // true = 顯示 Skeleton
  streamProgress?: number          // 0–100，進度條
  // 互動
  onExpandDetail?: () => void       // L2 展開回調
  onExport?:       () => void       // 匯出 PDF/Markdown
}
```

**渲染規則：**
- `isStreaming=true`：顯示 `<Skeleton className="min-h-[340px]" />` 預留高度，防止 CLS
- `recommendation` 決定左邊框顏色語義（`border-l-4`）：Buy=`border-emerald-500`、Sell=`border-rose-500`、Neutral=`border-amber-400`
- `confidence=Low`：自動插入 `⚠️ 信心度低，請審慎參考` 警示列
- L1 預設折疊；L2 點擊展開（`<Collapsible>`）；L3 另開右側 Panel

---

### 6.2 `SkillProgressTracker`

多技能串接執行的視覺化進度元件，消費 SSE `tool_call` 事件。

```typescript
type SkillStatus = 'pending' | 'running' | 'done' | 'error'

interface SkillStep {
  skill:    string       // e.g., 'alphaear-stock'
  label:    string       // 顯示文字，e.g., '獲取台積電 OHLCV'
  status:   SkillStatus
  durationMs?: number    // 完成後顯示耗時
}

interface SkillProgressTrackerProps {
  steps:         SkillStep[]
  currentSkill?: string
  isCollapsible?: boolean    // 完成後可折疊
}
```

**視覺規則：**
- `running`：顯示旋轉 spinner + 淡入動畫
- `done`：`✓` 綠色 checkmark + 耗時（毫秒）
- `error`：`✗` 紅色叉 + 可點擊展開錯誤訊息
- 所有 steps 完成後自動折疊（2 秒 delay）

---

### 6.3 `StockChartWidget`

OHLCV 互動式K線圖，整合技術指標。

```typescript
interface OHLCVPoint {
  date:   string    // ISO 8601
  open:   number
  high:   number
  low:    number
  close:  number
  volume: number
}

type Indicator = 'SMA20' | 'SMA60' | 'SMA120' | 'BB' | 'RSI' | 'MACD'

interface StockChartWidgetProps {
  ticker:       string
  data:         OHLCVPoint[]
  indicators?:  Indicator[]
  height?:      number        // px，預設 320
  interactive?: boolean       // 縮放、crosshair、tooltip
  isLoading?:   boolean
  onPeriodChange?: (period: '1M' | '3M' | '6M' | '1Y' | '3Y') => void
}
```

---

### 6.4 `PortfolioHeatmap`

持倉熱力圖，支援多指標維度。

```typescript
type HeatmapMetric = 'pnl_pct' | 'weight' | 'volatility' | 'beta'
type ColorScale    = 'diverging' | 'sequential'

interface HoldingItem {
  ticker:      string
  name:        string
  weight:      number       // 0–1
  pnlPct:      number
  volatility?: number
  beta?:       number
  marketValue: number
}

interface PortfolioHeatmapProps {
  holdings:    HoldingItem[]
  metric:      HeatmapMetric
  colorScale?: ColorScale     // 預設 'diverging'
  isLoading?:  boolean
}
```

---

### 6.5 `SignalChainGraph`

信號傳導鏈有向圖，以 React Flow 實作。

```typescript
interface SignalNode {
  id:       string
  type:     'source' | 'amplifier' | 'risk' | 'outcome'
  label:    string
  strength: number    // 0–1，影響節點大小
  data?:    Record<string, unknown>
}

interface SignalEdge {
  id:        string
  source:    string
  target:    string
  label?:    string
  animated?: boolean
  strength?: number   // 0–1，影響邊線粗細
}

interface SignalChainGraphProps {
  nodes:     SignalNode[]
  edges:     SignalEdge[]
  readonly?: boolean      // true = 查看模式，false = 可編輯
  height?:   number
}
```

---

### 6.6 `RiskBadge`

風險等級徽章元件。

```typescript
type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

interface RiskBadgeProps {
  level:    RiskLevel
  label:    string
  tooltip?: string
  size?:    'sm' | 'md' | 'lg'
}

// 顏色映射
const RISK_COLORS: Record<RiskLevel, string> = {
  critical: 'bg-rose-700  text-rose-100',
  high:     'bg-orange-600 text-orange-100',
  medium:   'bg-amber-500  text-amber-950',
  low:      'bg-emerald-600 text-emerald-100',
}
```

---

### 6.7 `StreamingTextBlock`

流式文字輸出，支援 Markdown 渲染與打字機效果。

```typescript
interface StreamingTextBlockProps {
  content:     string
  isStreaming?: boolean
  enableMarkdown?: boolean    // 預設 true
  className?:  string
}
```

---

### 6.8 `QuantOutputTable`

量化分析結構化輸出表格（VaR、優化權重、因子暴露等）。

```typescript
interface QuantOutputTableProps {
  title:      string
  rows:       { label: string; value: string | number; highlight?: boolean }[]
  footnote?:  string
  isLoading?: boolean
}
```

---

### 6.9 `GenerativeErrorBoundary`

包裹所有 Generative UI 元件的錯誤邊界。

```typescript
interface GenerativeErrorBoundaryProps {
  children:    React.ReactNode
  fallback?:   React.ReactNode    // 自訂 fallback UI
  onReset?:    () => void
  context?:    string             // 用於錯誤追蹤標識
}
```

---

## 7. Zustand Store 介面定義

### 7.1 `chat.store.ts`

```typescript
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// --- 型別定義 ---
type StreamChunk =
  | { type: 'text';        content: string }
  | { type: 'tool_call';   skill: string; params: unknown }
  | { type: 'tool_result'; component: string; props: unknown }
  | { type: 'error';       message: string }
  | { type: 'done' }

interface UIMessage {
  id:        string
  role:      'user' | 'assistant' | 'system'
  content:   string
  toolCalls?: ToolCall[]
  createdAt: Date
}

// --- Store 介面 ---
interface ChatState {
  // 狀態
  messages:       UIMessage[]
  conversationId: string | null
  isStreaming:    boolean
  activeSkills:   string[]           // 當前執行中的技能名稱
  streamError:    Error | null
  retryCount:     number

  // Actions
  sendMessage:        (content: string) => Promise<void>
  appendChunk:        (chunk: StreamChunk) => void
  setStreaming:       (v: boolean) => void
  setActiveSkills:    (skills: string[]) => void
  clearError:         () => void
  resetConversation:  () => void
  retryLastMessage:   () => void     // Stream 中斷 Fallback 觸發
  loadConversation:   (id: string) => Promise<void>
}

export const useChatStore = create<ChatState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      messages:       [],
      conversationId: null,
      isStreaming:    false,
      activeSkills:   [],
      streamError:    null,
      retryCount:     0,

      sendMessage: async (content) => { /* 實作見第 9.2 節 */ },
      appendChunk: (chunk) => {
        if (chunk.type === 'text') {
          set((s) => ({
            messages: appendToLastAssistantMessage(s.messages, chunk.content)
          }))
        }
        if (chunk.type === 'error') {
          set({ streamError: new Error(chunk.message), isStreaming: false })
        }
      },
      setStreaming:      (v) => set({ isStreaming: v }),
      setActiveSkills:   (skills) => set({ activeSkills: skills }),
      clearError:        () => set({ streamError: null, retryCount: 0 }),
      resetConversation: () => set({ messages: [], conversationId: null }),
      retryLastMessage:  () => {
        const lastUser = get().messages.findLast(m => m.role === 'user')
        if (lastUser) {
          set(s => ({ retryCount: s.retryCount + 1 }))
          get().sendMessage(lastUser.content)
        }
      },
      loadConversation: async (id) => { /* 從 API 載入歷史 */ },
    })),
    { name: 'chat-store' }
  )
)
```

---

### 7.2 `analysis.store.ts`

```typescript
interface InvestmentLensOutput {
  recommendation:      'Buy' | 'Hold' | 'Sell' | 'Neutral'
  confidence:          'High' | 'Medium' | 'Low'
  thesis:              string
  counterThesis:       string
  keyRisks:            RiskItem[]
  killConditions:      string[]
  allocationBreakdown?: AllocationItem[]
  validAsOf:           string
  escalationNeeded?:   { skill: string; reason: string }
}

interface AnalysisRecord {
  id:        string
  ticker:    string
  result:    InvestmentLensOutput
  createdAt: Date
}

interface AnalysisState {
  // 狀態
  currentAnalysis:   InvestmentLensOutput | null
  analysisHistory:   AnalysisRecord[]
  pendingTicker:     string | null
  isAnalyzing:       boolean

  // Actions
  setAnalysis:       (result: InvestmentLensOutput) => void
  clearAnalysis:     () => void
  setPendingTicker:  (ticker: string | null) => void
  addToHistory:      (record: AnalysisRecord) => void
  removeFromHistory: (id: string) => void
  loadHistory:       () => Promise<void>
}
```

---

### 7.3 `portfolio.store.ts`

```typescript
interface Portfolio {
  id:           string
  name:         string
  baseCurrency: 'TWD' | 'USD' | 'EUR' | 'JPY' | 'HKD'
  holdings:     Holding[]
  totalValue:   number
  valueDate:    string
}

interface Holding {
  ticker:        string
  name:          string
  shares:        number
  avgCost:       number
  currentPrice:  number
  marketValue:   number
  unrealizedPnl: number
  cfiCode?:      string
  exchange:      string
}

interface PortfolioState {
  // 狀態
  portfolios:        Portfolio[]
  activePortfolioId: string | null
  isRefreshing:      boolean
  lastUpdated:       string | null

  // Actions
  setActivePortfolio: (id: string) => void
  refreshQuotes:      () => Promise<void>
  updateHolding:      (portfolioId: string, holding: Holding) => void
  addPortfolio:       (portfolio: Portfolio) => void
  removePortfolio:    (id: string) => void
  importFromCSV:      (file: File) => Promise<void>
}
```

---

### 7.4 `ui.store.ts`

```typescript
type Locale      = 'zh-TW' | 'en'
type Theme       = 'dark' | 'light'
type ActivePanel = 'chat' | 'chart' | 'report' | 'portfolio' | null

interface UIState {
  // 狀態
  sidebarOpen:  boolean
  theme:        Theme
  locale:       Locale
  activePanel:  ActivePanel
  isMobile:     boolean

  // Actions
  toggleSidebar:  () => void
  setSidebarOpen: (v: boolean) => void
  setTheme:       (theme: Theme) => void
  setLocale:      (locale: Locale) => void
  setActivePanel: (panel: ActivePanel) => void
  setIsMobile:    (v: boolean) => void
}
```

---

## 8. Core Web Vitals 達成策略

目標指標（依 Google CWV 標準）：

| 指標 | 目標值  | 量測工具              |
|------|---------|-----------------------|
| FCP  | < 1.5s  | Vercel Speed Insights |
| LCP  | < 2.5s  | Vercel Speed Insights |
| CLS  | < 0.1   | Vercel Speed Insights |
| INP  | < 200ms | Chrome DevTools       |
| TTFB | < 600ms | Vercel Analytics      |

### 8.1 LCP 策略

- 首頁採用 React Server Components（RSC）預渲染 Shell，無客戶端水合延遲
- 金融圖表（Recharts / React Flow）使用 `dynamic(() => import(...), { ssr: false })` 延遲載入，不阻塞首屏 LCP
- 關鍵圖片加上 `priority` 屬性，Next.js `<Image>` 自動生成 `<link rel="preload">`
- Vercel Edge Network 分發所有靜態資源，TTFB 控制在 < 100ms（全球節點）

### 8.2 CLS 策略

- **所有 Generative UI 元件**在 `isStreaming=true` 時使用固定高度 Skeleton（`min-h-[320px]`），串流結果填入後不發生版面位移
- 字型採 `font-display: swap` + 預留字型尺寸回退（`font-size-adjust`），避免字型替換造成 CLS
- 圖片與圖表容器明確設定 `aspect-ratio` 或固定 `height`，避免載入時撐開

```tsx
// 範例：防 CLS 的串流卡片
function AnalysisResultCard({ isStreaming, ...props }: AnalysisResultCardProps) {
  if (isStreaming) {
    return <Skeleton className="min-h-[340px] w-full rounded-xl" data-testid="skeleton-card" />
  }
  return <div className="min-h-[340px]">...</div>
}
```

### 8.3 INP / FID 策略

- `ChatInput` 提交使用 `useTransition()`，`isPending` 期間 UI 保持可互動
- 圖表資料計算（移動平均、VaR 估算）移至 Web Worker，不佔用 Main Thread
- Recharts 圖表 `isAnimationActive={false}`（大資料集時關閉動畫，降低 Long Task）

### 8.4 TTFB 策略

- API Routes 啟用 Streaming Response；AI 首個 token 目標 < 2 秒
- 投資組合總覽頁使用 ISR（`revalidate: 60`），命中快取時 TTFB < 50ms
- 股價歷史資料以 Cloudflare KV 邊緣快取（TTL: 60s），避免回源

### 8.5 Bundle 最佳化

- `@next/bundle-analyzer` 納入 CI 流程，PR 若 bundle 增加 > 50KB 自動警告
- Recharts、React Flow 設為 code-split chunk，首屏不載入
- Zustand store 按路由 lazy hydration，避免不必要的客戶端狀態初始化

---

## 9. Error Boundary 與 Stream 中斷 Fallback

### 9.1 Error Boundary 架構

```tsx
// components/generative/GenerativeErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children:  ReactNode
  fallback?: ReactNode
  onReset?:  () => void
  context?:  string
}

interface State {
  hasError: boolean
  error:    Error | null
}

export class GenerativeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 送往 Sentry / Vercel Log Drains
    console.error(`[GenerativeErrorBoundary][${this.props.context}]`, error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-rose-300"
          data-testid="generative-error-boundary"
        >
          <AlertTriangle className="mb-2 h-5 w-5" />
          <p className="text-sm font-medium">元件載入失敗</p>
          {this.state.error && (
            <p className="mt-1 text-xs text-rose-400/70">{this.state.error.message}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={this.handleReset}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            重試
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
```

### 9.2 Stream 中斷 Fallback 策略

```typescript
// lib/ai/stream-handlers.ts

const MAX_RETRY = 3
const RETRY_DELAY_MS =   // 指數退避

export async function handleStreamWithFallback(
  endpoint: string,
  body:     unknown,
  store:    ReturnType<typeof useChatStore.getState>
): Promise<void> {
  const reader = await fetchSSEStream(endpoint, body)

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = parseSSEChunk(value)
      store.appendChunk(chunk)
    }
    store.setStreaming(false)
  } catch (err) {
    // 1. 停止串流，保存已接收的部分回應
    store.setStreaming(false)

    // 2. 在最後一條 assistant message 加上 [⚠️ 回應不完整] 標示
    store.appendChunk({
      type: 'text',
      content: '\n\n> ⚠️ **回應中斷**，以上為已接收內容。'
    })

    // 3. 設定錯誤狀態，UI 顯示重試按鈕
    store.appendChunk({ type: 'error', message: (err as Error).message })

    // 4. 自動重試（指數退避，最多 MAX_RETRY 次）
    const retryCount = store.retryCount
    if (retryCount < MAX_RETRY) {
      const delay = RETRY_DELAY_MS[retryCount] ?? 4000
      setTimeout(() => store.retryLastMessage(), delay)
    }
  } finally {
    reader.releaseLock()
  }
}

// 各層錯誤邊界層級
//
//  app/error.tsx                ← 全域（路由層級）錯誤
//  (dashboard)/layout.tsx       ← Dashboard Shell 錯誤
//  GenerativeErrorBoundary      ← 單一 Generative UI 元件錯誤
//  handleStreamWithFallback     ← SSE 串流中斷錯誤
```

### 9.3 錯誤處理層級矩陣

| 場景                       | 處理層                   | 用戶體驗                        |
|----------------------------|--------------------------|---------------------------------|
| SSE 串流意外中斷           | `handleStreamWithFallback` | 顯示部分結果 + 重試按鈕         |
| Generative UI 元件崩潰     | `GenerativeErrorBoundary` | 紅色錯誤框 + 重試按鈕           |
| API 路由 500 錯誤          | `app/error.tsx`          | 全頁錯誤提示 + 回首頁按鈕       |
| 資料源全部失效             | `fallback-chain.ts`      | 顯示過期快取 + `[⚠️ 資料過期]` |
| 認證失效（401）            | Auth.js middleware        | 自動重導 `/login`               |
| 技能執行失敗               | `SkillProgressTracker`   | `error` 狀態 + 詳細訊息        |

---

## 10. Tailwind 自訂斷點宣告

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // 完整覆寫 screens（含 2xl，明確宣告所有斷點）
    screens: {
      'xs':   '375px',    // 小型手機（iPhone SE）
      'sm':   '640px',    // 手機橫向 / 摺疊機展開
      'md':   '768px',    // 平板直向
      'lg':   '1024px',   // 平板橫向 / 小型筆電
      'xl':   '1280px',   // 標準桌機
      '2xl':  '1536px',   // 大型桌機 / 雙螢幕（明確宣告）
      '3xl':  '1920px',   // 超寬螢幕 / 金融儀表板
    },
    extend: {
      colors: {
        // 金融語義色
        'bull':          '#10b981',   // emerald-500：Buy / 上漲
        'bear':          '#f43f5e',   // rose-500：Sell / 下跌
        'neutral-signal':'#f59e0b',   // amber-400：中立 / 警告
        'risk-critical': '#be123c',   // rose-700：緊急風險
        // 品牌色
        'brand':         '#6366f1',   // indigo-500
        'brand-dark':    '#4338ca',   // indigo-700
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // 自訂容器最大寬度（與斷點對齊）
      maxWidth: {
        'screen-3xl': '1920px',
      },
      // 動畫（串流元件打字效果）
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out',
        'pulse-soft': 'pulse-soft 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}

export default config
```

---

## 11. API 介面規格

### 11.1 SSE 流式對話端點

```
POST /api/v1/chat/stream
Content-Type: application/json
Authorization: Bearer {jwt-token}

Request Body:
{
  "message":        "分析台積電 2330.TW 當前估值",
  "conversationId": "conv-uuid-123",       // null = 建立新對話
  "locale":         "zh-TW"
}

Response Headers:
Content-Type: text/event-stream
Cache-Control: no-cache
X-Accel-Buffering: no

Response Events (SSE):
event: message
data: {"type":"text","content":"正在啟動分析..."}

event: tool_call
data: {"type":"tool_call","skill":"alphaear-stock","params":{"ticker":"2330.TW"}}

event: skill_progress
data: {"type":"skill_progress","steps":[{"skill":"alphaear-stock","status":"running","label":"獲取 OHLCV 資料"}]}

event: tool_result
data: {"type":"tool_result","component":"StockChartWidget","props":{...}}

event: message
data: {"type":"text","content":"根據最新數據..."}

event: analysis_result
data: {"type":"analysis_result","component":"AnalysisResultCard","props":{...}}

event: done
data: {"type":"done","conversationId":"conv-uuid-123","usage":{"tokens":1240}}
```

### 11.2 技能呼叫端點

```
POST /api/v1/skills/:name/invoke
Content-Type: application/json
Authorization: Bearer {jwt-token}

Request Body:
{
  "mode":       "security",
  "parameters": {
    "ticker":      "2330.TW",
    "timeHorizon": "long"
  },
  "context": {
    "conversationId": "conv-uuid-123"
  }
}

Response 200 (同步，< 30s):
{
  "skill":         "investment-lens",
  "status":        "completed",
  "result":        { ... InvestmentLensOutput ... },
  "executionTime": 4320,
  "timestamp":     "2026-03-26T07:00:00Z"
}

Response 202 (異步，> 30s):
{
  "skill":             "quant-analysis",
  "status":            "processing",
  "jobId":             "job-uuid-456",
  "estimatedDuration": 25000
}
```

### 11.3 股價歷史端點

```
GET /api/v1/data/stocks/:ticker/history
  ?startDate=2025-01-01
  &endDate=2025-12-31
  &interval=1d           // 1d | 1wk | 1mo

Response 200:
{
  "ticker":   "2330.TW",
  "interval": "1d",
  "data": [
    {"date":"2025-01-02","open":520.0,"high":525.0,"low":518.0,"close":523.0,"volume":45000000},
    ...
  ],
  "source":   "fugle",
  "cached":   true,
  "cacheAge": 42
}

Response 503 (所有資料源失敗):
{
  "error":  "DATA_SOURCE_UNAVAILABLE",
  "stale":  true,
  "data":   [...過期快取...],
  "message":"All data providers failed. Returning stale cache."
}
```

### 11.4 錯誤回應格式

```typescript
// 統一錯誤回應 Schema
interface APIError {
  error:   string    // 機器可讀錯誤碼，e.g., "UNAUTHORIZED"
  message: string    // 人類可讀描述
  details?: unknown  // 可選的詳細資訊
  traceId?: string   // 追蹤 ID（生產環境）
}

// HTTP 狀態碼映射
// 400 → VALIDATION_ERROR（Zod 驗證失敗）
// 401 → UNAUTHORIZED（JWT 缺失或過期）
// 403 → FORBIDDEN（RBAC 權限不足）
// 404 → NOT_FOUND
// 429 → RATE_LIMIT_EXCEEDED
// 500 → INTERNAL_ERROR
// 503 → DATA_SOURCE_UNAVAILABLE
```

---

## 12. 資料模型與資料庫 Schema

### 12.1 核心資料表

```sql
-- 使用者
CREATE TABLE users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(100),
    preferences JSONB        DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 對話
CREATE TABLE conversations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    title        VARCHAR(255),
    skill_history JSONB DEFAULT '[]',
    context_data  JSONB DEFAULT '{}',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 訊息
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role            VARCHAR(20) CHECK (role IN ('user','assistant','system','tool')),
    content         TEXT,
    tool_calls      JSONB,
    tool_results    JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 投資組合
CREATE TABLE portfolios (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    name          VARCHAR(100) NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'TWD',
    total_value   DECIMAL(15,2),
    value_date    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 持倉
CREATE TABLE holdings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id   UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    ticker         VARCHAR(20) NOT NULL,
    name           VARCHAR(100),
    shares         DECIMAL(15,4) NOT NULL,
    avg_cost       DECIMAL(12,4),
    current_price  DECIMAL(12,4),
    market_value   DECIMAL(15,2),
    unrealized_pnl DECIMAL(15,2),
    cfi_code       VARCHAR(6),
    exchange       VARCHAR(10),
    value_date     TIMESTAMPTZ,
    last_updated_by VARCHAR(50)
);

-- 技能執行記錄
CREATE TABLE skill_executions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name      VARCHAR(64) NOT NULL,
    conversation_id UUID REFERENCES conversations(id),
    input_params    JSONB,
    result          JSONB,
    status          VARCHAR(20) CHECK (status IN ('pending','running','completed','error')),
    error_message   TEXT,
    execution_time_ms INTEGER,
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- 股價歷史快取
CREATE TABLE stock_prices (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker         VARCHAR(20) NOT NULL,
    date           DATE NOT NULL,
    open           DECIMAL(12,4),
    high           DECIMAL(12,4),
    low            DECIMAL(12,4),
    close          DECIMAL(12,4),
    volume         BIGINT,
    change_percent DECIMAL(6,2),
    source         VARCHAR(50),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ticker, date)
);

-- 索引
CREATE INDEX idx_messages_conversation    ON messages(conversation_id);
CREATE INDEX idx_holdings_portfolio       ON holdings(portfolio_id);
CREATE INDEX idx_skill_exec_skill         ON skill_executions(skill_name);
CREATE INDEX idx_skill_exec_status        ON skill_executions(status);
CREATE INDEX idx_stock_prices_ticker_date ON stock_prices(ticker, date);
CREATE INDEX idx_conversations_user       ON conversations(user_id);
```

---

## 13. 安全規格

### 13.1 認證與授權

| 項目           | 規格                                          |
|----------------|-----------------------------------------------|
| 認證方式       | JWT (HS256) + OAuth 2.0 (Google / GitHub)     |
| Token 存儲     | `httpOnly` Cookie（防 XSS）                   |
| Token 有效期   | Access: 1h / Refresh: 30d                     |
| 授權模型       | RBAC（roles: `admin` / `pro` / `free`）       |
| 未認證重導     | Middleware 攔截，302 重導 `/login`            |

### 13.2 API 速率限制

| 類別           | 限制                | 超限回應             |
|----------------|---------------------|----------------------|
| 一般 API 請求  | 100 requests/min    | HTTP 429 + Retry-After |
| AI 對話串流    | 20 messages/min     | HTTP 429            |
| 股價資料查詢   | 200 requests/min    | HTTP 429            |
| 技能呼叫       | 50 requests/min     | HTTP 429            |

### 13.3 傳輸與儲存安全

- **傳輸加密**：TLS 1.3 強制
- **靜態加密**：AES-256（PostgreSQL 加密靜態資料）
- **API 金鑰管理**：Vercel Environment Variables / Secrets，不得硬編碼
- **CSP Header**：`Content-Security-Policy` 嚴格設定，禁止 inline script
- **SQL Injection**：全面使用 Drizzle ORM 參數化查詢
- **XSS 防護**：React 預設 HTML 跳脫，`dangerouslySetInnerHTML` 禁止使用
- **稽核日誌保留**：180 天

### 13.4 合規聲明

```
⚠️ 免責聲明
本系統提供之分析結果僅供參考，不構成投資建議。
過去績效不代表未來表現。投資人應自行判斷並承擔投資風險。
本系統適用台灣個人資料保護法（個資法）及適用之國際隱私法規。
```

---

## 14. 開發階段規劃

### 14.1 階段總覽

| 階段   | 名稱               | 時程   | 主要交付物                                       |
|--------|--------------------|--------|--------------------------------------------------|
| P0     | 基礎建設           | W1–W2  | 專案骨架、Auth、DB、CI/CD、Tailwind 設定         |
| P1     | 核心對話           | W3–W5  | SSE 串流、Zustand Chat Store、Skill Progress UI  |
| P2     | 分析引擎           | W6–W9  | `AnalysisResultCard`、investment-lens 整合        |
| P3     | 投資組合           | W10–W12| `PortfolioHeatmap`、update-quote、組合管理 UI    |
| P4     | 量化與信號         | W13–W15| quant-analysis 整合、`SignalChainGraph`           |
| P5     | 報告輸出           | W16–W17| alphaear-reporter、PDF 匯出、報告閱讀器          |
| P6     | 效能與上線         | W18–W19| CWV 調校、E2E 測試、安全稽核、Vercel 生產部署   |

### 14.2 P0 詳細任務

- `[ ]` 建立 Next.js 15 + TypeScript 5 專案（`create-next-app --typescript`）
- `[ ]` 設定 Tailwind CSS v4 + shadcn/ui（含 2xl 斷點宣告）
- `[ ]` Auth.js 5 整合（Google OAuth）
- `[ ]` Drizzle ORM + PostgreSQL Schema 建立（見第 12 節）
- `[ ]` Upstash Redis 連接設定
- `[ ]` GitHub Actions CI/CD（lint → test → deploy）
- `[ ]` 建立 Zustand stores 骨架（chat / analysis / portfolio / ui）

### 14.3 P1 詳細任務

- `[ ]` 實作 `POST /api/v1/chat/stream`（Vercel AI SDK `streamText`）
- `[ ]` `useStreamingChat` hook + `handleStreamWithFallback`
- `[ ]` `SkillProgressTracker` 元件
- `[ ]` `StreamingTextBlock` 元件（Markdown 渲染）
- `[ ]` `GenerativeErrorBoundary` 元件
- `[ ]` `ChatInput` + `MessageFeed` 元件
- `[ ]` Stream 中斷 Fallback（指數退避重試）

### 14.4 里程碑定義

| 里程碑 | 完成條件                                                 |
|--------|----------------------------------------------------------|
| M1     | 用戶可登入並送出訊息，收到 AI 串流回應（無 Skill）       |
| M2     | `investment-lens` Mode A 完整串流，顯示 `AnalysisResultCard` |
| M3     | 投資組合 CSV 上傳、報價更新、持倉熱力圖可用             |
| M4     | quant-analysis + SignalChainGraph 完整串接               |
| M5     | Lighthouse Performance ≥ 90，所有 CWV 達標              |
| M6     | 生產環境部署，通過安全稽核                               |

---

## 15. 驗收標準

### 15.1 功能驗收

- `[ ]` **FA-01**：輸入任意全球股票代碼（如 `2330.TW`、`AAPL`、`7203.T`），15 秒內完成分析並顯示 `AnalysisResultCard`，包含 Buy/Hold/Sell/Neutral 評級
- `[ ]` **FA-02**：SSE 串流首個 token 出現時間 < 2 秒（P95）
- `[ ]` **FA-03**：多技能串接（investment-lens → quant-analysis）執行完整，`SkillProgressTracker` 所有步驟正確更新
- `[ ]` **FA-04**：Stream 中斷時保留已接收部分回應，顯示 `[⚠️ 回應不完整]` 標示與重試按鈕，不發生白屏
- `[ ]` **FA-05**：投資組合 CSV 上傳後正確解析並觸發 `update-quote`，重新整理後持倉市值正確更新
- `[ ]` **FA-06**：`AnalysisResultCard` 的 L1/L2/L3 三層披露行為正常，點擊展開無版面位移
- `[ ]` **FA-07**：未登入者存取任何 `/dashboard/*` 路由，自動重導 `/login`
- `[ ]` **FA-08**：所有頁面支援 zh-TW / en 語言切換，切換後 UI 完整翻譯

### 15.2 效能驗收

- `[ ]` **PE-01**：Lighthouse 桌機版 Performance 分數 ≥ 90
- `[ ]` **PE-02**：Lighthouse 桌機版 Accessibility 分數 ≥ 95
- `[ ]` **PE-03**：LCP < 2.5s（Vercel Analytics 量測，P75）
- `[ ]` **PE-04**：CLS < 0.1（串流輸出不觸發版面位移）
- `[ ]` **PE-05**：股票查詢 API P95 回應時間 < 500ms
- `[ ]` **PE-06**：Bundle size（first load JS）< 200KB（gzip）

### 15.3 安全驗收

- `[ ]` **SE-01**：未帶 JWT 呼叫 `/api/v1/*` 回傳 HTTP 401
- `[ ]` **SE-02**：AI 對話超過 20 messages/min 回傳 HTTP 429
- `[ ]` **SE-03**：CSP Header 正確設定（`script-src 'self'`），無 unsafe-inline
- `[ ]` **SE-04**：OWASP Top 10 基本掃描通過（使用 ZAP 或同等工具）

---

## 16. 測試案例

### 16.1 單元測試（Vitest）

```typescript
// __tests__/components/AnalysisResultCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnalysisResultCard } from '@/components/generative/AnalysisResultCard'

const mockProps = {
  ticker:          'AAPL',
  recommendation:  'Buy'  as const,
  confidence:      'High' as const,
  thesis:          '蘋果 AI 硬件週期強勁',
  counterThesis:   '估值偏高，短期承壓',
  keyRisks:        [{ id:'r1', label:'法規風險', severity:'medium' as const }],
  killConditions:  ['iPhone 出貨量連續兩季低於預期'],
  validAsOf:       '2026-03-26T00:00:00Z',
}

describe('AnalysisResultCard', () => {
  it('TC-001: isStreaming=true 時顯示 Skeleton，不顯示評級徽章', () => {
    render(<AnalysisResultCard {...mockProps} isStreaming={true} />)
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument()
    expect(screen.queryByText('Buy')).not.toBeInTheDocument()
  })

  it('TC-002: Buy 評級顯示 emerald 左邊框', () => {
    render(<AnalysisResultCard {...mockProps} />)
    const card = screen.getByTestId('analysis-result-card')
    expect(card).toHaveClass('border-emerald-500')
  })

  it('TC-003: confidence=Low 顯示警示列', () => {
    render(<AnalysisResultCard {...mockProps} confidence="Low" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/信心度低/)).toBeInTheDocument()
  })

  it('TC-004: 點擊展開按鈕後顯示 L2 內容', async () => {
    render(<AnalysisResultCard {...mockProps} />)
    await userEvent.click(screen.getByRole('button', { name: /展開/i }))
    expect(screen.getByText(/killConditions/i)).toBeInTheDocument()
  })
})
```

```typescript
// __tests__/store/chat.store.test.ts
import { renderHook, act } from '@testing-library/react'
import { useChatStore } from '@/store/chat.store'

describe('ChatStore', () => {
  beforeEach(() => useChatStore.getState().resetConversation())

  it('TC-010: setStreaming(false) + streamError 在 stream 中斷時正確設定', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.appendChunk({ type: 'error', message: 'Network reset' }))
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.streamError).not.toBeNull()
    expect(result.current.streamError?.message).toBe('Network reset')
  })

  it('TC-011: retryLastMessage 遞增 retryCount', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.retryLastMessage())
    expect(result.current.retryCount).toBe(1)
  })
})
```

```typescript
// __tests__/components/RiskBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { RiskBadge } from '@/components/generative/RiskBadge'

describe('RiskBadge', () => {
  it('TC-020: critical 等級套用 rose-700 底色', () => {
    render(<RiskBadge level="critical" label="流動性風險" />)
    expect(screen.getByText('流動性風險')).toHaveClass('bg-rose-700')
  })

  it('TC-021: tooltip 存在時渲染 title 屬性', () => {
    render(<RiskBadge level="high" label="集中度" tooltip="前三持倉超過 60%" />)
    expect(screen.getByTitle('前三持倉超過 60%')).toBeInTheDocument()
  })
})
```

---

### 16.2 整合測試（Vitest + MSW）

```typescript
// __tests__/api/chat-stream.test.ts
import { setupServer } from 'msw/node'
import { http } from 'msw'

describe('POST /api/v1/chat/stream', () => {
  it('TC-030: 正常回應包含 text/event-stream Content-Type', async () => {
    const res = await fetch('/api/v1/chat/stream', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer valid-jwt', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '分析台積電', conversationId: null })
    })
    expect(res.headers.get('content-type')).toContain('text/event-stream')
    expect(res.status).toBe(200)
  })

  it('TC-031: 缺少 JWT 回傳 401', async () => {
    const res = await fetch('/api/v1/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ message: '分析台積電' })
    })
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('UNAUTHORIZED')
  })

  it('TC-032: 超過速率限制回傳 429', async () => {
    // 連續送出 21 則訊息
    const requests = Array.from({ length: 21 }, () =>
      fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-jwt' },
        body: JSON.stringify({ message: 'test' })
      })
    )
    const responses = await Promise.all(requests)
    expect(responses.some(r => r.status === 429)).toBe(true)
  })
})
```

```typescript
// __tests__/lib/fallback-chain.test.ts
import { DataProviderChain } from '@/lib/data-providers/fallback-chain'

describe('DataProviderChain', () => {
  it('TC-040: P1 失敗時自動切換至 P2', async () => {
    const chain = new DataProviderChain({ forceFailP1: true })
    const quote = await chain.fetchQuote('AAPL', 'us_stock')
    expect(quote.source).toBe('alpha-vantage')
  })

  it('TC-041: 所有源失敗時回傳 stale 快取並標記 _stale=true', async () => {
    const chain = new DataProviderChain({ forceFailAll: true, seedCache: true })
    const quote = await chain.fetchQuote('AAPL', 'us_stock')
    expect(quote._stale).toBe(true)
  })
})
```

---

### 16.3 E2E 測試（Playwright）

```typescript
// e2e/analysis-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('證券分析完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'test-password')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/')
  })

  test('TC-050: 輸入股票代碼後顯示 AnalysisResultCard（Happy Path）', async ({ page }) => {
    await page.fill('[data-testid="chat-input"]', '分析蘋果公司 AAPL 估值')
    await page.keyboard.press('Enter')

    // 等待技能進度出現
    await expect(page.getByTestId('skill-progress-tracker')).toBeVisible({ timeout: 5000 })

    // 等待分析卡片（最多 30 秒）
    await expect(page.getByTestId('analysis-result-card')).toBeVisible({ timeout: 30000 })

    // 驗證評級徽章存在
    const badge = page.getByTestId('recommendation-badge')
    await expect(badge).toHaveText(/Buy|Hold|Sell|Neutral/)

    // 驗證無 CLS（版面未跳動）
    const clsValue = await page.evaluate(() =>
      performance.getEntriesByType('layout-shift').reduce((sum: number, e: any) => sum + e.value, 0)
    )
    expect(clsValue).toBeLessThan(0.1)
  })

  test('TC-051: Stream 中斷時顯示部分結果與重試按鈕', async ({ page }) => {
    // 在 SSE 請求中途中斷連線
    await page.route('/api/v1/chat/stream', async route => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
        body: 'data: {"type":"text","content":"分析中..."}\n\n',
      })
    })

    await page.fill('[data-testid="chat-input"]', '分析台積電 2330.TW')
    await page.keyboard.press('Enter')

    await expect(page.getByTestId('stream-error-banner')).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('button', { name: /重試/i })).toBeVisible()
    // 確認部分文字仍顯示
    await expect(page.getByText('分析中...')).toBeVisible()
  })

  test('TC-052: L1→L2 展開不發生 CLS', async ({ page }) => {
    // 先取得分析結果
    await page.fill('[data-testid="chat-input"]', '分析 AAPL')
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('analysis-result-card')).toBeVisible({ timeout: 30000 })

    // 點擊展開 L2
    await page.click('[data-testid="expand-l2-button"]')

    const clsAfterExpand = await page.evaluate(() =>
      performance.getEntriesByType('layout-shift').reduce((sum: number, e: any) => sum + e.value, 0)
    )
    expect(clsAfterExpand).toBeLessThan(0.1)
  })
})

test.describe('認證流程', () => {
  test('TC-060: 未登入者存取 /portfolio 重導 /login', async ({ page }) => {
    await page.goto('/portfolio')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('效能量測', () => {
  test('TC-070: 首頁 LCP < 2500ms', async ({ page }) => {
    await page.goto('/')
    const lcp = await page.evaluate(() =>
      new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          resolve(entries[entries.length - 1].startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      })
    )
    expect(lcp as number).toBeLessThan(2500)
  })
})
```

---

## 17. 部署架構

### 17.1 生產環境架構


```
使用者請求
     │
     ▼
┌─────────────────────────────────────────────────┐
│              Cloudflare（DNS + DDoS 防護）        │
└─────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────┐
│                  Vercel Edge Network             │
│  ┌─────────────────┐   ┌─────────────────────┐  │
│  │  Edge Middleware │   │  Edge Functions      │  │
│  │  -  Auth 驗證    │   │  -  FX 快取代理       │  │
│  │  -  速率限制     │   │  -  報價快取代理      │  │
│  │  -  語言重導     │   │                     │  │
│  └─────────────────┘   └─────────────────────┘  │
│                                                 │
│  ┌─────────────────┐   ┌─────────────────────┐  │
│  │  Static Assets  │   │  Serverless Functions│  │
│  │  -  Next.js RSC  │   │  -  /api/v1/chat/...  │  │
│  │  -  ISR Pages    │   │  -  /api/v1/skills/.. │  │
│  │  -  CDN 緩存     │   │  -  /api/v1/data/...  │  │
│  └─────────────────┘   └─────────────────────┘  │
└─────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────┐
│                    資料層                        │
│  ┌──────────────┐ ┌────────────┐ ┌───────────┐  │
│  │  PostgreSQL  │ │   Redis    │ │  Pinecone │  │
│  │  (Neon.tech) │ │ (Upstash)  │ │ (Vector)  │  │
│  │  -  用戶資料  │ │ -  會話快取 │ │ -  RAG     │  │
│  │  -  組合持倉  │ │ -  速率限制 │ │ -  語義搜索│  │
│  │  -  對話紀錄  │ │ -  報價 KV  │ │           │  │
│  └──────────────┘ └────────────┘ └───────────┘  │
└─────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────┐
│                外部數據源層                      │
│  美股: FMP → Alpha Vantage → Yahoo Finance       │
│  台股: Fugle → TWSE OpenAPI → FinMind            │
│  基金: FinMind → TDCC → SITCA                    │
│  匯率: Exchange Rate API → Yahoo → 台灣銀行      │
│  AI:   Claude (Anthropic) / GPT-4o (OpenAI)      │
└─────────────────────────────────────────────────┘
```

### 17.2 環境配置

```bash
# .env.example

# ── 應用基礎 ──────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://investment-lens.vercel.app
NODE_ENV=production

# ── 認證 ──────────────────────────────────────────
AUTH_SECRET=<openssl rand -base64 32>
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# ── AI 模型 ───────────────────────────────────────
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# ── 資料庫 ────────────────────────────────────────
DATABASE_URL=postgresql://user:pass@host:5432/investment_lens
REDIS_URL=rediss://default:pass@host:6380

# ── 向量資料庫 ────────────────────────────────────
PINECONE_API_KEY=
PINECONE_INDEX=investment-lens-prod

# ── 外部數據源（美股） ────────────────────────────
FMP_API_KEY=
ALPHA_VANTAGE_API_KEY=

# ── 外部數據源（台股） ────────────────────────────
FUGLE_API_KEY=
FINMIND_TOKEN=

# ── 外部數據源（匯率） ────────────────────────────
EXCHANGE_RATE_API_KEY=

# ── 監控與日誌 ────────────────────────────────────
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
```

### 17.3 CI/CD 流程

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ── 靜態分析與測試 ──────────────────────────────
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript 型別檢查
        run: npm run type-check

      - name: ESLint
        run: npm run lint

      - name: 單元與整合測試
        run: npm run test:ci
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          REDIS_URL:    ${{ secrets.TEST_REDIS_URL }}

      - name: Bundle Size 檢查
        run: npm run analyze
        # 若 first-load JS > 200KB (gzip) 則失敗

  # ── E2E 測試 ────────────────────────────────────
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: E2E 測試
        run: npm run test:e2e
        env:
          BASE_URL:     ${{ secrets.STAGING_URL }}
          TEST_USER_EMAIL:    ${{ secrets.TEST_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # ── 生產部署 ────────────────────────────────────
  deploy:
    runs-on: ubuntu-latest
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token:      ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id:     ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args:       '--prod'
```

### 17.4 監控與告警

| 指標                     | 告警閾值          | 告警管道        |
|--------------------------|-------------------|-----------------|
| API 錯誤率               | > 5%（5分鐘內）   | Slack #alerts   |
| AI 串流首 token 延遲     | > 5s（P95）       | Slack #alerts   |
| PostgreSQL 連接池使用率  | > 80%             | Email           |
| Redis 記憶體使用率       | > 85%             | Slack + Email   |
| Vercel 函數超時           | > 30s             | PagerDuty       |
| 資料源全面失效           | 任一資產類別      | PagerDuty       |
| Sentry 新錯誤類型        | 首次出現          | Slack #dev      |

---

## 18. 附錄

### 18.1 Skill 邊界速查表

| 任務                             | 使用技能                         | 不使用               |
|----------------------------------|----------------------------------|----------------------|
| 股票質性估值分析                 | `investment-lens` Mode A         | `alphaear-reporter`  |
| 投資組合 All-Seasons 診斷        | `investment-lens` Mode B         | `quant-analysis`     |
| 個人退休配置規劃                 | `investment-lens` Mode C         | —                    |
| 現有信號監控與追蹤               | `investment-lens` Mode D         | —                    |
| 程式化 VaR、優化、GARCH 建模     | `quant-analysis`                 | `investment-lens`    |
| 獨立 VaR / CVaR / Basel 回測    | `value-at-risk-calculator`       | `quant-analysis`     |
| 研究筆記與投資報告撰寫           | `alphaear-reporter`              | `investment-lens`    |
| 機構首次覆蓋（5步工作流）        | `alphaear-reporter` Mode B       | —                    |
| 原始歷史 OHLCV 價格序列          | `alphaear-stock`                 | `update-quote`       |
| 投資組合 CSV 報價刷新            | `update-quote`                   | `alphaear-stock`     |
| 攝取即時財經新聞（寫入本地 DB）  | `alphaear-news`                  | `alphaear-search`    |
| 查詢已存新聞（本地 DB）          | `alphaear-search engine='local'` | `alphaear-news`      |
| 財經文本情緒分析                 | `alphaear-sentiment`             | —                    |
| 時間序列預測（Kronos）           | `alphaear-predictor`             | —                    |
| 信號鏈邏輯視覺化                 | `alphaear-logic-visualizer`      | —                    |
| CIM / SEC 文件數據提取           | `datapack-builder`               | —                    |
| 建立新 Agent Skill               | `skill-creator`                  | —                    |

### 18.2 數據源備援鏈

```
美股報價
  P1: FMP (250次/日)
  P2: Alpha Vantage (500次/日)
  P3: yahoo-finance2 (無嚴格配額)

台股報價
  P1: Fugle (20,000次/月，含除權息還原)
  P2: TWSE OpenAPI (免費，盤後)
  P3: FinMind (600次/小時)

基金淨值
  P1: FinMind (T+1)
  P2: TDCC OpenAPI (官方，法律效力)
  P3: SITCA 爬蟲 (完整度最高)

匯率
  P1: Exchange Rate API (1,500次/月)
  P2: yahoo-finance2 (備援)
  P3: 台灣銀行牌告爬蟲 (稅務參考)

全面失效處理：
  → 回傳 Cloudflare KV 過期快取
  → 標記 { _stale: true }
  → 告警推送至 PagerDuty
```

### 18.3 CFI 代碼對應

| CFI Code | 資產類別                   |
|----------|----------------------------|
| EXXXXX   | 股票（普通股）              |
| CIOIBU   | 股票型 ETF                 |
| CMOOBDU  | 債券型基金                  |
| DBFTXR   | 政府公債                   |
| DCFXXR   | 企業債券                   |
| RRXXXX   | 房地產投資信託（REIT）      |
| CAAAAA   | 加密貨幣                   |

### 18.4 術語表

| 術語                  | 說明                                                     |
|-----------------------|----------------------------------------------------------|
| Agent Skill           | 符合 Agent Skills Open Standard 的獨立 AI 功能模組       |
| Generative UI         | 由 AI 串流動態決定渲染哪個 React 元件                    |
| ISR                   | Incremental Static Regeneration，Next.js 增量靜態再生成  |
| RSC                   | React Server Component，在伺服器渲染的 React 元件        |
| SSE                   | Server-Sent Events，單向伺服器推送事件協定               |
| OHLCV                 | Open/High/Low/Close/Volume，K線資料標準格式              |
| VaR                   | Value at Risk，風險值                                    |
| CVaR                  | Conditional VaR，條件風險值（Expected Shortfall）        |
| CLS                   | Cumulative Layout Shift，累計版面位移（CWV 指標）        |
| LCP                   | Largest Contentful Paint，最大內容渲染（CWV 指標）       |
| INP                   | Interaction to Next Paint，互動到下一幀（CWV 指標）      |
| RBAC                  | Role-Based Access Control，角色型存取控制                |
| All-Seasons Framework | Ray Dalio 全天候投資組合框架                              |
| ISQ                   | InvestmentSignal 物件，investment-lens 核心資料結構      |
| Kill Condition        | 投資論點失效的明確觸發條件                               |
| Thesis / Counter-Thesis | 投資論點正方與反方陳述                                 |
| TTL                   | Time To Live，快取存活時間                               |

### 18.5 變更日誌

| 版本  | 日期       | 變更摘要                                                    |
|-------|------------|-------------------------------------------------------------|
| 1.0.0 | 2026-03-01 | 初稿，基礎系統架構                                          |
| 2.0.0 | 2026-03-26 | 加入 Generative UI 規格、Zustand Store 定義、前端目錄結構  |
| 3.0.0 | 2026-03-26 | 獨立完整規格書；新增 Stream Fallback、CWV 策略、E2E 測試   |

---

*本規格書版本 3.0.0，最後更新 2026-03-26。*
*所有程式碼範例皆為規格用途，實作時應依實際環境調整。*