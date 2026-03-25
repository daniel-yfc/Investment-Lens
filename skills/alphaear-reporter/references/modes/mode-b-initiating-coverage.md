# Mode B — Initiating Coverage

Load this file when the user requests a first formal equity research write-up
for a company. This mode owns the full 5-task initiating coverage workflow.

---

## ⚠️ CRITICAL: Single-Task Mode Only

This mode operates one task at a time. Never chain tasks automatically.

When user requests the full pipeline or all tasks together, respond:

```
I can create an equity research initiation report for [Company].
This involves 5 separate tasks that must be completed individually:

1. Company Research — business overview, management, industry
2. Financial Modeling — projection model (xlsx skill required)
3. Valuation Analysis — DCF and comparable companies
4. Chart Generation — 25–35 charts (chart skill required)
5. Report Assembly — final DOCX report (docx skill required)

Which task would you like to start with?
```

**Rules:**
- ✅ Execute exactly ONE task per user request.
- ✅ Always verify prerequisites before starting.
- ✅ Deliver task output and confirm completion.
- ✅ Wait for explicit user request before next task.
- ❌ Never chain multiple tasks automatically.
- ❌ Never assume user wants to proceed to next task.
- ❌ Never execute Tasks 3–5 without verifying required inputs exist.

---

## Task Overview

| Task | Prerequisites | Output |
|------|--------------|--------|
| 1. Company Research | Company name or ticker | `[Company]_Research.md` |
| 2. Financial Modeling | Task 1 `.md` | `[Company]_Model.xlsx` |
| 3. Valuation Analysis | Task 1 `.md` + Task 2 `.xlsx` | `[Company]_Valuation.md` + Excel tabs |
| 4. Chart Generation | Tasks 1–3 outputs | `[Company]_Charts.zip` |
| 5. Report Assembly | Tasks 1–4 outputs | `[Company]_InitiatingCoverage.docx` |

---

## Deliverables Policy: No Shortcuts

| Task | Deliverable | Nothing else |
|------|------------|-------------|
| Task 1 | Research document (`.md`) | ❌ No summaries |
| Task 2 | Financial model (`.xlsx`) | ❌ No extras |
| Task 3 | Valuation analysis (`.md`) + Excel tabs | ❌ No extras |
| Task 4 | Charts zip file (`.zip`) | ❌ No extras |
| Task 5 | Final report (`.docx`) | ❌ No extras |

**Default font**: Times New Roman throughout (unless user specifies otherwise).

---

## Detailed Task Instructions

Load the relevant reference file before starting each task.
All task files are located in `references/tasks/` within `alphaear-reporter`:

| Task | Reference file |
|------|----------------|
| 1 | `references/tasks/task1-company-research.md` |
| 2 | `references/tasks/task2-financial-modeling.md` |
| 3 | `references/tasks/task3-valuation.md` |
| 4 | `references/tasks/task4-chart-generation.md` |
| 5 | `references/tasks/task5-report-assembly.md` |

Also available: `references/tasks/valuation-methodologies.md`

---

## File Organisation

```
outputs/[Company]/
├── [Company]_Research.md
├── [Company]_Model.xlsx
├── [Company]_Valuation.md
├── [Company]_Charts.zip
└── [Company]_InitiatingCoverage.docx
```

---

## Report Structure (Task 5 outline)

Investment thesis → Business overview → Key drivers → Risks and counter-thesis
→ Valuation / framework view → Monitoring plan → Recommendation and confidence
