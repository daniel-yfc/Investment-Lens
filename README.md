# Investment-Lens

> An AI-powered investment analysis platform built with Next.js 16, featuring generative UI components, real-time streaming chat, and institutional-grade financial analysis skills.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Language](https://img.shields.io/badge/Language-zh--TW%20%2F%20EN-blue.svg)](README_zh.md)

[繁體中文版](README_zh.md)

---

## Overview

Investment-Lens is a full-stack web application that combines an AI chat interface with generative UI components to deliver investment analysis in real-time. It wraps a collection of financial AI agent skills (`skills/`) behind a secure, authenticated Next.js API.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Next.js 16 Web App (src/)                              │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  │
│  │  Chat UI     │  │  Dashboard    │  │  Portfolio  │  │
│  │  (streaming) │  │  /reports     │  │  Heatmap    │  │
│  └──────┬───────┘  └───────────────┘  └─────────────┘  │
│         │ SSE Stream                                     │
│  ┌──────▼──────────────────────────────────────────┐    │
│  │  /api/v1/chat/stream  (auth + rate limit)       │    │
│  └──────┬──────────────────────────────────────────┘    │
└─────────┼───────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│  Agent Skills (skills/)                                 │
│  investment-lens · quant-analysis · alphaear-reporter   │
│  alphaear-stock · alphaear-news · alphaear-search · ... │
└─────────────────────────────────────────────────────────┘
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

## Key Features

- **Streaming Chat Interface** — real-time SSE stream with `SkillProgressTracker` and generative UI rendering
- **Generative UI Components** — `AnalysisResultCard`, `SignalChainGraph`, `SkillProgressTracker`, `ReportReader`
- **Portfolio Heatmap** — visual portfolio allocation and performance overview
- **Report Viewer** — structured investment report reader with auto-updating TOC sidebar
- **Auth Guard** — NextAuth v5 session-based access control on all API routes
- **Rate Limiting** — 20 requests/min per user (SE-02)
- **CSP Headers** — Content Security Policy enforced via middleware (SE-03)

## Project Structure

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

## Getting Started

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

Fill in the required values (see `.env.example` for descriptions):

```bash
# Required
AUTH_SECRET=$(openssl rand -base64 32)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgres://...

# Required for rate limiting
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

**Auth:** Requires valid session (NextAuth)

**Rate Limit:** 20 requests/min per user

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

## Agent Skills

The `skills/` directory contains a collection of Claude Code-compatible AI agent skills for financial analysis. See [README_zh.md](README_zh.md) for full skills documentation.

## License

Proprietary — All rights reserved.
