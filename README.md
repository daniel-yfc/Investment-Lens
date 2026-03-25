# Investment-Lens — Financial AI Agent Skills

> A collection of professional financial analysis skills for Claude Code.
> Covers qualitative investment analysis, quantitative modeling, institutional research,
> market intelligence, and portfolio management — designed to work together as a system.

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Language: zh-TW / EN](https://img.shields.io/badge/Language-zh--TW%20%2F%20EN-blue.svg)]()
[![Standard: Agent Skills](https://img.shields.io/badge/Standard-Agent%20Skills-green.svg)](https://agentskills.io/)

[繁體中文版](README_zh.md)

---

## Architecture Overview

Three core skills form an integrated analysis pipeline. Specialized tools feed into them.

```
┌───────────────────────────────────────────────────────────┐
│   alphaear-news     alphaear-search     alphaear-stock   │
│   (ingest news)   (query local DB)    (OHLCV data)      │
│   alphaear-sentiment   alphaear-deepear-lite             │
└─────────────────────────────┬───────────────────────────┘
                            │ data feeds
                            ▼
┌───────────────────────────────────────────────────────────┐
│                    investment-lens                       │
│   Mode A — Security Analysis                            │
│   Mode B — Portfolio Diagnostics                        │
│   Mode C — Personal Allocation (absorbs asset-alloc.)   │
│   Mode D — Signal Monitoring (absorbs signal-tracker)   │
│   ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄│
│   scripts/ — Agentic Pipeline                           │
│     fin_agent.py · ISQ schema · toolkits · utils        │
└──────────────┬────────────────────────────────────────────┘
               │ quantitative handoff
               ▼
┌───────────────────────────────────────────────────────────┐
│                    quant-analysis                        │
│   VaR, optimization, factor, GARCH, Monte Carlo,         │
│   backtesting — returns structured output                │
└──────────────┬────────────────────────────────────────────┘
               │ narrative output
               ▼
┌───────────────────────────────────────────────────────────┐
│                   alphaear-reporter                      │
│   Mode A — Research Note                                │
│   Mode B — Initiating Coverage (5-task workflow)        │
│   Mode C — Investor Materials                           │
└───────────────────────────────────────────────────────────┘
```

---

## Skills Directory

### Core Skills

| Skill | Role | Modes |
|-------|------|-------|
| [`investment-lens`](skills/investment-lens/) | Primary analysis hub | A: Security Analysis, B: Portfolio Diagnostics, C: Personal Allocation, D: Signal Monitoring |
| [`quant-analysis`](skills/quant-analysis/) | Quantitative engine | VaR, optimisation, factor, GARCH, Monte Carlo, backtesting |
| [`alphaear-reporter`](skills/alphaear-reporter/) | Output layer | A: Research Note, B: Initiating Coverage (5-task), C: Investor Materials |

### AlphaEar Intelligence System

| Skill | Role |
|-------|------|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | Real-time signal and transmission-chain analysis from DeepEar Lite |
| [`alphaear-news`](skills/alphaear-news/) | **Ingest** live financial news into local DB (Reuters, Bloomberg, FT, CNBC, Nikkei, WSJ) |
| [`alphaear-search`](skills/alphaear-search/) | **Query** local news DB (`engine='local'`) or live web (Jina / DDG) |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | Financial text sentiment analysis (FinBERT / LLM) |
| [`alphaear-stock`](skills/alphaear-stock/) | Raw historical OHLCV price data via yfinance (global exchanges) |
| [`alphaear-predictor`](skills/alphaear-predictor/) | Time-series market forecasting via Kronos |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | Visual logic diagrams for transmission chains (Draw.io XML) |

### Portfolio Management

| Skill | Role |
|-------|------|
| [`update-quote`](skills/update-quote/) | Refresh current prices, NAVs, and FX rates in portfolio CSV; recalculate TWD values and update `value_date` |
| [`value-at-risk-calculator`](skills/value-at-risk-calculator/) | Standalone VaR and risk metrics: historical simulation, parametric, Monte Carlo, CVaR, stress testing, Basel III/IV backtesting |

### Institutional Research

| Skill | Role |
|-------|------|
| [`datapack-builder`](skills/datapack-builder/) | Extract and structure data from CIM, SEC filings into IC-standard Excel packs |

### Development Tools

| Skill | Role |
|-------|------|
| [`skill-creator`](skills/skill-creator/) | Create and update Agent Skills — design, build, and package new skills |

---

## investment-lens Agentic Pipeline

`investment-lens` includes a Python-based agentic pipeline under `skills/investment-lens/scripts/`.
This pipeline is used primarily by **Mode D (Signal Monitoring)** but is available to all modes.

| Module | Path | Role |
|--------|------|------|
| Entry point | `scripts/fin_agent.py` | Orchestrates FinResearcher → FinAnalyst → Signal Tracking |
| Prompt definitions | `references/PROMPTS.md` | FinResearcher, FinAnalyst, Signal Tracking prompts |
| ISQ schema | `scripts/schema/isq_template.py` | `InvestmentSignal` JSON object structure |
| Data models | `scripts/schema/models.py` | Supporting Pydantic models |
| Toolkits | `scripts/tools/toolkits.py` | Price lookup, news fetch, web search |
| Database manager | `scripts/utils/database_manager.py` | Local signal DB read/write |
| Hybrid search | `scripts/utils/hybrid_search.py` | Combined local + web search |
| LLM router | `scripts/utils/llm/router.py` | Model selection and capability routing |
| Predictor | `scripts/utils/predictor/` | Kronos time-series forecasting (kline, evaluation, model) |

---

## Skill Boundaries

| Task | Use | Not |
|------|-----|-----|
| Qualitative stock / market analysis | `investment-lens` Mode A | `alphaear-reporter` |
| Personal allocation and retirement planning | `investment-lens` Mode C | — |
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

---

## Getting Started

**Step 1 — Clone into your project**

```bash
git clone https://github.com/daniel-yfc/Investment-Lens.git
cd your-project
mkdir -p .claude/
cp -r Investment-Lens/skills .claude/
```

**Step 2 — Confirm directory structure**

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

**Step 3 — Start using**

Claude Code will auto-discover and load skills. Example prompts:

```
# Portfolio diagnosis
幫我診斷一下這個投資組合的全天候配置  → investment-lens Mode B

# Security analysis
分析台積電目前的估値是否合理           → investment-lens Mode A

# Personal allocation
我 45 歲，想規劃退休後的提領策略         → investment-lens Mode C

# Signal monitoring
我的台積電論點有變化嗎？                  → investment-lens Mode D

# Quantitative risk
Calculate 1-year VaR at 95% for my portfolio  → quant-analysis

# Standalone VaR with Basel backtesting
Run historical simulation VaR with Kupiec test → value-at-risk-calculator

# Initiating coverage
幫我寫一份 TSMC 的首次涂蓋報告         → alphaear-reporter Mode B

# Research note
幫我寫一份研究筆記                        → alphaear-reporter Mode A

# Price refresh
更新報價                                     → update-quote

# Historical price data
Get TSMC raw OHLCV for the past 6 months      → alphaear-stock
```

---

## Skill File Structure

Each skill follows the [Agent Skills open standard](https://agentskills.io/):

```
skills/<skill-name>/
├── SKILL.md          # Scope, trigger conditions, workflow, output format
├── assets/           # Static resources agents use directly (templates, schemas)
├── references/       # Documentation agents read before deciding how to act
└── scripts/          # Python pipeline (investment-lens only)
```

**`assets/`** — Templates, schemas, lookup tables. Agent uses content directly.

**`references/`** — Frameworks, guides, procedural rules. Agent reads and applies judgment.

**`scripts/`** — Python agentic pipeline (currently `investment-lens`). Entry point: `fin_agent.py`.

---

## Standards and Compatibility

- **Compatibility**: Claude Code Skills ([Agent Skills open standard](https://agentskills.io/))
- **Asset classification**: ISO 10962:2021 CFI codes
- **Portfolio framework**: All-Seasons / All-Weather
- **Tax context**: Taiwan (二代健保, 海外所得最低稅負制)
- **Primary languages**: Traditional Chinese (zh-TW), English
- **License**: Proprietary

---

## Resources

- [Claude Code Skills Specification](https://code.claude.com/docs/en/skills)
- [Agent Skills Open Standard](https://agentskills.io/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
