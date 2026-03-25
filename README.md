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

This repository is organized around three **core skills** that form an integrated
analysis pipeline, supported by a wider ecosystem of specialized tools.

```
┌─────────────────────────────────────────────────────────┐
│                    investment-lens                       │
│   Primary hub: analysis, diagnosis, allocation (A/B/C)  │
│   Triggers quant-analysis when computation is needed    │
└──────────────┬──────────────────────────────────────────┘
               │ quantitative handoff
               ▼
┌─────────────────────────────────────────────────────────┐
│                    quant-analysis                        │
│   Subordinate engine: VaR, optimization, factor,         │
│   GARCH, Monte Carlo, backtesting                        │
│   Returns structured output + reintegration_note        │
└──────────────┬──────────────────────────────────────────┘
               │ narrative output
               ▼
┌─────────────────────────────────────────────────────────┐
│                   alphaear-reporter                      │
│   Unified output layer: research notes, initiating       │
│   coverage, investor briefs — three output modes         │
└─────────────────────────────────────────────────────────┘
```

---

## Skills Directory

### Core Skills

| Skill | Role | Key References | Key Assets |
|-------|------|---------------|------------|
| [`investment-lens`](skills/investment-lens/) | Primary analysis hub | `personal-allocation.md`, `quant-handoff.md`, `all-seasons-portfolio.md`, `valuation-models.md`, `bias-checklist.md` | `portfolio-template.md`, `allocation-template.md` |
| [`quant-analysis`](skills/quant-analysis/) | Quantitative engine | `model-selection.md` | `input-schema.md`, `output-schema.md` |
| [`alphaear-reporter`](skills/alphaear-reporter/) | Output layer | `coverage-format.md`, `investor-materials-format.md` | `report-templates/research-note.md`, `report-templates/initiating-coverage.md`, `report-templates/investor-brief.md` |

### AlphaEar Intelligence System

| Skill | Role |
|-------|------|
| [`alphaear-deepear-lite`](skills/alphaear-deepear-lite/) | Real-time signal and transmission-chain analysis from DeepEar Lite |
| [`alphaear-news`](skills/alphaear-news/) | Financial news, market trends, prediction market data |
| [`alphaear-sentiment`](skills/alphaear-sentiment/) | Financial text sentiment analysis (FinBERT / LLM) |
| [`alphaear-stock`](skills/alphaear-stock/) | Ticker lookup and raw OHLCV historical price data |
| [`alphaear-signal-tracker`](skills/alphaear-signal-tracker/) | Investment signal evolution tracking |
| [`alphaear-predictor`](skills/alphaear-predictor/) | Time-series market forecasting via Kronos |
| [`alphaear-search`](skills/alphaear-search/) | Financial web search and local RAG context retrieval |
| [`alphaear-logic-visualizer`](skills/alphaear-logic-visualizer/) | Visual logic diagrams for transmission chains (Draw.io XML) |

### Portfolio Management

| Skill | Role |
|-------|------|
| [`asset-allocation`](skills/asset-allocation/) | CFA-framework personal wealth management and retirement planning |
| [`update-quote`](skills/update-quote/) | Auto-update market prices, NAVs, and FX rates in portfolio CSV files |

### Institutional Research

| Skill | Role |
|-------|------|
| [`initiating-coverage`](skills/initiating-coverage/) | 5-step institutional initiating coverage workflow |
| [`datapack-builder`](skills/datapack-builder/) | Extract and structure data from CIM, SEC filings into IC-standard Excel packs |

### Development Tools

| Skill | Role |
|-------|------|
| [`skill-creator`](skills/skill-creator/) | Create and update Agent Skills — design, build, and package new skills |

---

## Skill Boundaries

Each skill has explicit boundaries to prevent overlap and ensure correct routing:

| Task | Use | Not |
|------|-----|-----|
| Qualitative stock / market analysis | `investment-lens` | `alphaear-reporter` |
| Personal asset allocation and retirement planning | `investment-lens` (Mode C) | `asset-allocation` |
| Portfolio diagnosis (All-Seasons framework) | `investment-lens` | `quant-analysis` |
| Programmatic VaR, optimization, factor, GARCH | `quant-analysis` | `investment-lens` |
| Research notes and investment reports | `alphaear-reporter` | `investment-lens` |
| Full 5-step institutional initiating coverage | `initiating-coverage` | `alphaear-reporter` |
| Raw historical OHLCV price data | `alphaear-stock` | `investment-lens` |
| Excel DCF valuation model | `dcf-model` | `investment-lens` |
| Investor materials and pitch decks | `alphaear-reporter` | `investor-materials` |

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
        │   └── references/
        ├── quant-analysis/
        ├── alphaear-reporter/
        └── ... (other skills)
```

**Step 3 — Start using**

Claude Code will auto-discover and load skills. Example prompts:

```
# Portfolio diagnosis
幫我診斷一下這個投資組合的全天候配置  → investment-lens

# Security analysis
分析台積電目前的估值是否合理           → investment-lens

# Quantitative risk
Calculate 1-year VaR at 95% for my portfolio  → quant-analysis

# Research report
幫我寫一份研究筆記                       → alphaear-reporter

# Price data
Get Tesla's raw OHLCV data for the past 3 months  → alphaear-stock
```

---

## Skill File Structure

Each skill follows the [Agent Skills open standard](https://agentskills.io/):

```
skills/<skill-name>/
├── SKILL.md          # Scope, trigger conditions, workflow, output format
├── assets/           # Static resources agents use directly (templates, schemas)
└── references/       # Documentation agents read before deciding how to act
```

**`assets/`** — Templates, schemas, lookup tables. Agent uses the content directly.

**`references/`** — Frameworks, guides, procedural rules. Agent reads and applies judgment.

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
