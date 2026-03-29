# Investment-Lens

> An AI-powered investment analysis platform built with Next.js 16, featuring generative UI components, real-time streaming chat, and a professional collection of financial AI agent skills for Claude Code.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Standard: Agent Skills](https://img.shields.io/badge/Standard-Agent%20Skills-green.svg)](https://agentskills.io/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Language](https://img.shields.io/badge/Language-zh--TW%20%2F%20EN-blue.svg)](README_zh.md)

[繁體中文版](README_zh.md)

---

## Overview

Investment-Lens has two layers:

- **Web App** (`src/`) — A Next.js 16 full-stack application with a streaming AI chat interface, generative UI components, portfolio heatmap, and report viewer.
- **Agent Skills** (`skills/`) — A Claude Code-compatible collection of professional financial analysis skills covering qualitative analysis, quantitative modeling, institutional research, market intelligence, and portfolio management.

---

## Web App Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 Web App (src/)                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Chat UI     │  │  Dashboard       │  │  Portfolio   │  │
│  │  (streaming) │  │  /reports        │  │  Heatmap     │  │
│  └──────┬───────┘  └──────────────────┘  └──────────────┘  │
│         │ SSE Stream                                         │
│  ┌──────▼────────────────────────────────────────────────┐  │
│  │  /api/v1/chat/stream  (auth guard + rate limit)       │  │
│  └──────┬────────────────────────────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│  Agent Skills (skills/)                                     │
│  investment-lens · quant-analysis · alphaear-reporter       │
│  alphaear-stock · alphaear-news · alphaear-search · ...     │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand |
| Animation | Framer Motion |
| Graph / Flow | @xyflow/react |
| Auth | Auth.js (NextAuth v5) |
| Database | Neon (PostgreSQL) + Drizzle ORM |
| Rate Limiting | Upstash Redis |
| AI Streaming | AI SDK (OpenAI) |
| Charts | Recharts |
| Testing | Playwright (E2E) |
| Deployment | Vercel |

## Web App Features

- **Streaming Chat Interface** — real-time SSE stream with `SkillProgressTracker` and generative UI rendering
- **Generative UI Components** — `AnalysisResultCard`, `SignalChainGraph`, `SkillProgressTracker`, `ReportReader`
- **Portfolio Heatmap** — visual portfolio allocation and performance overview
- **Report Viewer** — structured investment report reader with auto-updating TOC sidebar
- **Auth Guard** — NextAuth v5 session-based access control on all API routes
- **Rate Limiting** — 20 requests/min per user (SE-02)
- **CSP Headers** — Content Security Policy enforced via middleware (SE-03)

## Web App Structure

```
Investment-Lens/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/v1/chat/stream/ # SSE streaming endpoint
│   │   └── dashboard/          # Protected dashboard pages
│   ├── components/
│   │   ├── chat/               # ChatInput, MessageFeed, MessageBubble, StreamingTextBlock
│   │   ├── generative/         # AnalysisResultCard, SignalChainGraph, SkillProgressTracker, ReportReader
│   │   ├── portfolio/          # PortfolioHeatmap
│   │   └── ui/                 # shadcn/ui base components
│   ├── hooks/                  # useStreamingChat, useTranslate
│   ├── lib/                    # utils, rate-limiter, export-pdf
│   ├── store/                  # Zustand chat store
│   ├── types/                  # skill.types, stream.types
│   ├── auth.ts                 # Auth.js config
│   └── middleware.ts           # Auth redirect + CSP headers
├── skills/                     # AI Agent Skills (Claude Code compatible)
├── tests/                      # Playwright E2E tests
└── drizzle.config.ts           # Database schema config
```

## Getting Started (Web App)

### 1. Clone & Install

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd Investment-Lens
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Required values:

```bash
AUTH_SECRET=$(openssl rand -base64 32)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgres://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run E2E Tests

```bash
npx playwright test
```

## API Reference

### `POST /api/v1/chat/stream`

Streams investment analysis as Server-Sent Events.

**Auth:** Requires valid session (NextAuth) → `401` if missing

**Rate Limit:** 20 requests/min per user → `429` with `Retry-After` if exceeded

**Request:**
```json
{ "message": "AAPL" }
```

**Stream Events:**

| Type | Description |
|---|---|
| `text` | Streaming text content |
| `skill_progress` | Skill execution progress update |
| `tool_call` | Tool invocation event |
| `tool_result` | Generative UI component payload |
| `[DONE]` | Stream complete |

## Security

| Requirement | Implementation |
|---|---|
| SE-01: Unauthenticated API → 401 | `auth()` guard in route handler |
| SE-02: Rate limit 20 req/min → 429 | In-memory limiter (edge-compatible) |
| SE-03: CSP headers | `middleware.ts` |
| FA-07: /dashboard/* redirect → /login | `middleware.ts` matcher |
| Ticker input sanitization | Regex whitelist `/^[A-Z0-9]{1,6}(\.[A-Z]{1,3})?$/` |

---

## Agent Skills

Three core skills form an integrated analysis pipeline. Specialized tools feed data into them.

```
┌───────────────────────────────────────────────────────────┐
│  alphaear-news     alphaear-search     alphaear-stock     │
│  (ingest news)   (query local DB)    (OHLCV data)        │
│  alphaear-sentiment   alphaear-deepear-lite               │
└─────────────────────────────┬─────────────────────────────┘
                             │ data feeds
                             ▼
┌───────────────────────────────────────────────────────────┐
│                    investment-lens                        │
│   Mode A — Security Analysis (stock / ETF / crypto)      │
│   Mode B — Portfolio Diagnostics & Rebalancing           │
│   Mode C — Personal Allocation & Retirement Planning     │
│   Mode D — Signal Monitoring & Status Updates            │
│   ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄│
│   scripts/ — Agentic Pipeline                            │
│     fin_agent.py · ISQ schema · toolkits · utils         │
└──────────────┬────────────────────────────────────────────┘
               │ quantitative handoff
               ▼
┌───────────────────────────────────────────────────────────┐
│                    quant-analysis                         │
│   VaR, optimisation, factor, GARCH, Monte Carlo,          │
│   backtesting — returns structured output                 │
└──────────────┬────────────────────────────────────────────┘
               │ narrative output
               ▼
┌───────────────────────────────────────────────────────────┐
│                   alphaear-reporter                       │
│   Mode A — Research Note                                 │
│   Mode B — Initiating Coverage (5-task workflow)         │
│   Mode C — Investor Materials & Presentations            │
└───────────────────────────────────────────────────────────┘
```

### Core Skills

| Skill | Role | Modes |
|---|---|---|
| [`investment-lens`](skills/investment-lens/) | Primary analysis hub | A: Security Analysis, B: Portfolio Diagnostics, C: Personal Allocation, D: Signal Monitoring |
| [`quant-analysis`](skills/quant-analysis/) | Quantitative engine | VaR, optimisation, factor, GARCH, Monte Carlo, backtesting |
| [`alphaear-reporter`](skills/alphaear-reporter/) | Output layer | A: Research Note, B: Initiating Coverage (5-task), C: Investor Materials |

### AlphaEar Intelligence System

| Skill | Role |
|---|---|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | Real-time signal and transmission-chain analysis from DeepEar Lite |
| [`alphaear-news`](skills/alphaear-news/) | **Ingest** live financial news into local DB (Reuters, Bloomberg, FT, CNBC, Nikkei, WSJ) |
| [`alphaear-search`](skills/alphaear-search/) | **Query** local news DB (`engine='local'`) or live web (Jina / DDG) |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | Financial text sentiment analysis (FinBERT / LLM) |
| [`alphaear-stock`](skills/alphaear-stock/) | Raw historical OHLCV price data via yfinance (global exchanges) |
| [`alphaear-predictor`](skills/alphaear-predictor/) | Time-series market forecasting via Kronos |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | Visual logic diagrams for transmission chains (Draw.io XML) |

### Portfolio Management

| Skill | Role |
|---|---|
| [`update-quote`](skills/update-quote/) | Refresh current prices, NAVs, and FX rates in portfolio CSV; recalculate TWD values and update `value_date` |
| [`value-at-risk-calculator`](skills/value-at-risk-calculator/) | Standalone VaR and risk metrics: historical simulation, parametric, Monte Carlo, CVaR, stress testing, Basel III/IV backtesting |

### Institutional Research

| Skill | Role |
|---|---|
| [`datapack-builder`](skills/datapack-builder/) | Extract and structure data from CIM, SEC filings into IC-standard Excel packs |

### Development Tools

| Skill | Role |
|---|---|
| [`skill-creator`](skills/skill-creator/) | Create and update Agent Skills — design, build, and package new skills |

### investment-lens Agentic Pipeline

`investment-lens` includes a Python-based agentic pipeline under `skills/investment-lens/scripts/`. Used primarily by **Mode D (Signal Monitoring)** but available to all modes.

| Module | Path | Role |
|---|---|---|
| Entry point | `scripts/fin_agent.py` | Orchestrates FinResearcher → FinAnalyst → Signal Tracking |
| Prompt definitions | `references/PROMPTS.md` | FinResearcher, FinAnalyst, Signal Tracking prompts |
| ISQ schema | `scripts/schema/isq_template.py` | `InvestmentSignal` JSON object structure |
| Data models | `scripts/schema/models.py` | Supporting Pydantic models |
| Toolkits | `scripts/tools/toolkits.py` | Price lookup, news fetch, web search |
| Database manager | `scripts/utils/database_manager.py` | Local signal DB read/write |
| Hybrid search | `scripts/utils/hybrid_search.py` | Combined local + web search |
| LLM router | `scripts/utils/llm/router.py` | Model selection and capability routing |
| Predictor | `scripts/utils/predictor/` | Kronos time-series forecasting (kline, evaluation, model) |

### Skill Boundaries

| Task | Use | Not |
|---|---|---|
| Qualitative stock / market analysis | `investment-lens` Mode A | `alphaear-reporter` |
| Personal allocation & retirement planning | `investment-lens` Mode C | — |
| Portfolio diagnosis (All-Seasons framework) | `investment-lens` Mode B | `quant-analysis` |
| Monitoring existing investment signals | `investment-lens` Mode D | — |
| Programmatic VaR, optimisation, factor, GARCH | `quant-analysis` | `investment-lens` |
| Standalone VaR / CVaR / Basel backtesting | `value-at-risk-calculator` | `quant-analysis` |
| Research notes and investment reports | `alphaear-reporter` | `investment-lens` |
| Institutional initiating coverage (5-task) | `alphaear-reporter` Mode B | — |
| Raw historical OHLCV price series | `alphaear-stock` | `update-quote` |
| Refresh current prices in portfolio CSV | `update-quote` | `alphaear-stock` |
| Fetch live financial news (write to DB) | `alphaear-news` | `alphaear-search` |
| Query stored news from local DB | `alphaear-search` `engine='local'` | `alphaear-news` |

### Getting Started (Skills Only)

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd your-project
mkdir -p .claude/
cp -r Investment-Lens/skills .claude/
```

Expected structure:

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
        └── ... (other skills)
```

Claude Code will auto-discover and load skills. Example prompts:

```
# Security analysis
分析台積電目前的估值是否合理           → investment-lens Mode A

# Portfolio diagnosis
幫我診斷一下這個投資組合的全天候配置  → investment-lens Mode B

# Personal allocation
我 45 歲，想規劃退休後的提領策略       → investment-lens Mode C

# Signal monitoring
我的台積電論點有變化嗎？               → investment-lens Mode D

# Quantitative risk
Calculate 1-year VaR at 95% for my portfolio   → quant-analysis

# Standalone VaR + Basel backtesting
Run historical simulation VaR with Kupiec test → value-at-risk-calculator

# Initiating coverage report
幫我寫一份 TSMC 的首次涵蓋報告       → alphaear-reporter Mode B

# Research note
幫我寫一份研究筆記                     → alphaear-reporter Mode A

# Price refresh
更新報價                               → update-quote

# Historical OHLCV
Get TSMC raw OHLCV for the past 6 months       → alphaear-stock
```

### Skill File Structure

Each skill follows the [Agent Skills open standard](https://agentskills.io/):

```
skills/<skill-name>/
├── SKILL.md          # Scope, trigger conditions, workflow, output format
├── assets/           # Static resources agents use directly (templates, schemas)
├── references/       # Documentation agents read before deciding how to act
└── scripts/          # Python pipeline (investment-lens only)
```

- **`assets/`** — Templates, schemas, lookup tables. Agent uses content directly.
- **`references/`** — Frameworks, guides, procedural rules. Agent reads and applies judgment.
- **`scripts/`** — Python agentic pipeline (currently `investment-lens`). Entry point: `fin_agent.py`.

### Standards & Compatibility

- **Compatibility**: Claude Code Skills ([Agent Skills open standard](https://agentskills.io/))
- **Asset classification**: ISO 10962:2021 CFI codes
- **Portfolio framework**: All-Seasons / All-Weather
- **Tax context**: Taiwan (二代健保補充保費, 海外所得最低稅負制)
- **Primary languages**: Traditional Chinese (zh-TW), English

### Resources

- [Claude Code Skills Specification](https://code.claude.com/docs/en/skills)
- [Agent Skills Open Standard](https://agentskills.io/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

---

## License

Proprietary — All rights reserved.
