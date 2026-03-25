---
name: datapack-builder
description: >
  Build professional financial services data packs from CIMs, offering memorandums,
  SEC filings, web search, or MCP servers. Extract, normalize, and standardize
  financial data into investment committee-ready Excel workbooks with consistent
  structure, proper formatting, and documented assumptions. Use for M&A due diligence,
  private equity analysis, investment committee materials, and standardizing financial
  reporting. Do NOT use for simple financial calculations or working with
  already-completed data packs.
compatibility: Requires xlsx skill, internet or MCP server access for SEC EDGAR / public filings
allowed-tools: Read Write Grep Bash(python*) Bash(curl*) WebSearch
metadata:
  argument-hint: "[CIM | SEC filing | company name | 'build datapack']"
  version: "1.1"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  post-invoke-check: "Confirm final delivery checklist passed before output"
---

# Financial Data Pack Builder

Build professional, standardized financial data packs for private equity, investment banking, and asset management. Transform financial data from CIMs, offering memorandums, SEC filings, web search, or MCP server access into polished Excel workbooks ready for investment committee review.

**Important:** Use the `xlsx` skill for all Excel file creation and manipulation throughout this workflow.

## Gotchas

- **Balance sheet must balance.** `Total Assets = Total Liabilities + Equity`. Verify this before delivery. Unbalanced sheets are a hard rejection at any IC.
- SEC EDGAR EDGAR full-text search (`efts.sec.gov`) returns 10 results max per query. Paginate if needed to find the correct filing.
- CIM financial tables often use non-standard EBITDA adjustments without labelling them. Load `references/normalization.md` before extracting any EBITDA figure.
- `riskfolio-lib` and `scipy` are NOT available in this skill’s scope. For quantitative modelling, hand off to `quant-analysis`.
- Excel formulas must use `=` prefix. Hard-coded numbers in formula cells are a QC failure — all calculations must be traceable.
- Color scheme (blue inputs / black formulas / green cross-sheet links) must be applied consistently. Inconsistent colouring breaks the IC review convention.

## Critical Success Factors

Every data pack must meet these standards:

- **Data Accuracy**: Trace every number to source; use formula-based calculations only; verify balance sheet balances.
- **Format Compliance**: Currency ($) for financial data; number format for operational metrics; percentages for rates.
- **Professional Presentation**: Bold headers, right-aligned numbers, accounting underlines, frozen panes.
- **Documentation**: All normalization adjustments cited; assumptions stated; filename follows convention.

## Workflow Overview

Execute phases in order. Load `references/workflow.md` for full step-by-step detail.

| Phase | Description |
|-------|-------------|
| Phase 1 | Document processing and data extraction |
| Phase 2 | Data normalization and standardization |
| Phase 3 | Build Excel workbook (use xlsx skill) |
| Phase 4 | Scenario building (if projections included) |
| Phase 5 | Quality control and validation |
| Phase 6 | Final delivery |

## Essential Format Rules

| Data Type | Format | Example |
|-----------|--------|---------|
| Financial (revenue, EBITDA, costs) | `$#,##0.0` (millions) | `$50.0` |
| Operational (units, stores, employees) | `#,##0` no `$` | `1,250` |
| Percentages (margin, growth, yield) | `0.0%` | `15.0%` |
| Years | Text format | `2024` not `2,024` |
| Negatives (financial) | Parentheses | `$(15.0)` |

## Standard 8-Tab Structure

1. Executive Summary
2. Historical Financials (Income Statement)
3. Balance Sheet
4. Cash Flow Statement
5. Operating Metrics
6. Property/Segment Performance (if applicable)
7. Market Analysis
8. Investment Highlights

## Color Scheme

**Layer 1 — Font Colors (mandatory):**
- Blue `(0,0,255)`: All hardcoded inputs
- Black `(0,0,0)`: All formulas and calculations
- Green `(0,128,0)`: Links to other sheets

**Layer 2 — Fill Colors (apply if user requests):**
- Section headers: Dark blue `(68,114,196)` + white text
- Sub-headers: Light blue `(217,225,242)` + black text
- Input cells: Light green `(226,239,218)` + blue text

## References

Load as needed:
- `references/workflow.md` — Full phase-by-phase workflow (Phase 1–6)
- `references/normalization.md` — EBITDA adjustment patterns and examples
- `references/industry-kpis.md` — Industry-specific KPIs (SaaS, Manufacturing, Real Estate, Healthcare)
- `references/patterns.md` — Correct patterns and common mistakes for Excel formulas
- `references/checklist.md` — Final delivery checklist
