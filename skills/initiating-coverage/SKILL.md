---
name: initiating-coverage
description: >
  Create institutional-quality equity research initiation reports through a 5-task
  workflow. Tasks must be executed individually with verified prerequisites:
  (1) company research, (2) financial modeling, (3) valuation analysis,
  (4) chart generation, (5) final report assembly. Each task produces specific
  deliverables (markdown docs, Excel models, charts, or DOCX reports).
  Tasks 3–5 have dependencies on earlier tasks.
compatibility: Requires xlsx skill (Tasks 2–3), chart skill (Task 4), docx skill (Task 5); internet access for company research
allowed-tools: Read Write Grep WebSearch Bash
metadata:
  argument-hint: "[company name | ticker | task number 1–5]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  post-invoke-check: "Confirm single-task mode — never chain tasks automatically"
---

# Initiating Coverage

Create institutional-quality equity research initiation reports through a structured 5-task workflow. Each task must be executed separately with verified inputs.

**Default Font**: Times New Roman throughout all documents (unless user specifies otherwise).

---

## ⚠️ CRITICAL: One Task at a Time

**THIS SKILL OPERATES IN SINGLE-TASK MODE ONLY.**

When user requests the full pipeline or all tasks together:

```
I can help you create an equity research initiation report for [Company].
This involves 5 separate tasks that must be completed individually:

1. Company Research — Research business, management, industry
2. Financial Modeling — Build projection model
3. Valuation Analysis — DCF and comparable companies
4. Chart Generation — Create 25–35 charts
5. Report Assembly — Compile final report

Which task would you like to start with?
```

**Rules:**
- ✅ Execute exactly ONE task per user request
- ✅ Always verify prerequisites before starting
- ✅ Deliver task outputs and confirm completion
- ✅ Wait for user to explicitly request the next task
- ❌ Never chain multiple tasks automatically
- ❌ Never assume user wants to proceed to next task
- ❌ Never execute Tasks 3–5 without verifying required inputs exist

### Deliverables Policy: NO SHORTCUTS

| Task | Deliverable | Nothing else |
|------|------------|-------------|
| Task 1 | Research document (`.md`) | ❌ No summaries |
| Task 2 | Financial model (`.xlsx`) | ❌ No extras |
| Task 3 | Valuation analysis (`.md`) + Excel tabs | ❌ No extras |
| Task 4 | Charts zip file (`.zip`) | ❌ No extras |
| Task 5 | Final report (`.docx`) | ❌ No extras |

---

## Task Overview

| Task | Input Required | Output |
|------|---------------|--------|
| 1. Company Research | Company name/ticker | `[Company]_Research.md` |
| 2. Financial Modeling | Task 1 `.md` | `[Company]_Model.xlsx` |
| 3. Valuation Analysis | Tasks 1 `.md` + Task 2 `.xlsx` | `[Company]_Valuation.md` + Excel tabs |
| 4. Chart Generation | Tasks 1 `.md` + Task 2 `.xlsx` + Task 3 `.md` | `[Company]_Charts.zip` |
| 5. Report Assembly | Tasks 1–4 outputs | `[Company]_InitiatingCoverage.docx` |

For full task instructions, load the relevant reference file before starting:
- `references/task1-company-research.md`
- `references/task2-financial-modeling.md`
- `references/task3-valuation-analysis.md`
- `references/task4-chart-generation.md`
- `references/task5-report-assembly.md`

---

## File Organization

Store all outputs in:
```
outputs/[Company]/
├── [Company]_Research.md
├── [Company]_Model.xlsx
├── [Company]_Valuation.md
├── [Company]_Charts.zip
└── [Company]_InitiatingCoverage.docx
```
