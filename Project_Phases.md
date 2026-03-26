# 系統開發階段規劃 (Project Phases)

本文件詳細列出 Investment-Lens Web 專案的開發階段 (P0-P6) 與詳細任務。

## 14.1 階段總覽

| 階段   | 名稱               | 時程   | 主要交付物                                       |
|--------|--------------------|--------|--------------------------------------------------|
| P0     | 基礎建設           | W1–W2  | 專案骨架、Auth、DB、CI/CD、Tailwind 設定         |
| P1     | 核心對話           | W3–W5  | SSE 串流、Zustand Chat Store、Skill Progress UI  |
| P2     | 分析引擎           | W6–W9  | `AnalysisResultCard`、investment-lens 整合        |
| P3     | 投資組合           | W10–W12| `PortfolioHeatmap`、update-quote、組合管理 UI    |
| P4     | 量化與信號         | W13–W15| quant-analysis 整合、`SignalChainGraph`           |
| P5     | 報告輸出           | W16–W17| alphaear-reporter、PDF 匯出、報告閱讀器          |
| P6     | 效能與上線         | W18–W19| CWV 調校、E2E 測試、安全稽核、Vercel 生產部署   |

## 14.2 P0 詳細任務 (基礎建設)

- `[ ]` 建立 Next.js 15 + TypeScript 5 專案（`create-next-app --typescript`）
- `[ ]` 設定 Tailwind CSS v4 + shadcn/ui（含 2xl 斷點宣告）
- `[ ]` Auth.js 5 整合（Google OAuth）
- `[ ]` Drizzle ORM + PostgreSQL Schema 建立
- `[ ]` Upstash Redis 連接設定
- `[ ]` GitHub Actions CI/CD（lint → test → deploy）
- `[ ]` 建立 Zustand stores 骨架（chat / analysis / portfolio / ui）

## 14.3 P1 詳細任務 (核心對話)

- `[ ]` 實作 `POST /api/v1/chat/stream`（Vercel AI SDK `streamText`）
- `[ ]` `useStreamingChat` hook + `handleStreamWithFallback`
- `[ ]` `SkillProgressTracker` 元件
- `[ ]` `StreamingTextBlock` 元件（Markdown 渲染）
- `[ ]` `GenerativeErrorBoundary` 元件
- `[ ]` `ChatInput` + `MessageFeed` 元件
- `[ ]` Stream 中斷 Fallback（指數退避重試）
