---
name: alphaear-reporter
description: Convert completed investment analysis into structured human-readable
  output (research notes, initiating coverage reports, thesis memos). Owns the full
  5-task initiating coverage workflow.
allowed-tools:
- Read
- Grep
- Bash
metadata:
  argument-hint: '[research note | initiating coverage | investor brief | company
    name]'
  version: '2.1'
  language: zh-tw
  last-updated: '2026-03-26'
  effort: medium
  user-invocable: 'true'
  upstream-primary-skill: investment-lens
  post-invoke-check: 'Confirm output matches audience and template; Mode B: confirm
    single-task mode'
  compatibility: Modes A/C require no runtime dependencies. Mode B requires xlsx,
    chart, docx skills.
---

# AlphaEar Reporter

## Purpose

Unified output and publication layer for the Investment-Lens / AlphaEar stack.

## Mode Selection

| Mode | Use for | Load |
|------|---------|------|
| **A — Research Note** | Short/medium research outputs, thesis updates, signal summaries, internal memos | `references/modes/mode-a-research-note.md` |
| **B — Initiating Coverage** | First formal equity research write-up with 5-task workflow (company research → model → valuation → charts → report) | `references/modes/mode-b-initiating-coverage.md` |
| **C — Investor Materials** | Investor briefings, board/committee summaries, one-pagers, presentation-ready narratives | `references/modes/mode-c-investor-materials.md` |

## Do Not Use

- To perform primary market analysis from scratch → use `investment-lens` first.
- To refresh prices → use `update-quote`.
- To run statistical or quantitative modelling → use `quant-analysis`.

If core analysis is missing, stop and request it first.

## Gotchas

- Mode B operates **one task at a time**. Never chain tasks automatically. After completing a task, stop and wait for user to request the next one.
- Tasks 3–5 require prior task outputs as inputs. Verify prerequisites before starting.
- The `task5-report-assembly.md` reference is 53K characters — load only when executing Task 5.
- Default font is Times New Roman throughout unless user specifies otherwise.

## Required Inputs (All Modes)

Before drafting, confirm:
- Underlying analysis result or source material.
- Target audience.
- Output format requested or implied.
- Valid-as-of date.
- Any constraints: tone, length, region, compliance style.

If missing, ask before drafting.

---

## Writing Rules (All Modes)

**Always:**
- Preserve the substance of source analysis.
- Tighten structure and readability.
- Match audience and tone.
- Separate fact, interpretation, and recommendation.
- Make uncertainty visible.

**Never:**
- Invent evidence not found in source analysis.
- Upgrade weak evidence into strong conviction.
- Hide disagreement, scenario tension, or unresolved risks.

---

## Transformation Logic

### Source from `investment-lens`
Preserve recommendation, confidence, thesis, risks, kill conditions.
Convert internal framework language to readable prose where needed.

### Source from AlphaEar signal skills
Summarise the signal chain. State confidence and time horizon.
Distinguish observed signal from inferred conclusion.

### Source from `quant-analysis`
Integrate statistical outputs as supporting evidence.
Do not let statistics replace judgment automatically.

### Multiple analyses provided
Merge only when they refer to the same asset, theme, or decision context.
Resolve duplication. Surface contradictions explicitly — never flatten them.

---

## Validation Checklist (before finalising)

- [ ] Output format matches requested audience.
- [ ] All recommendations supported by analysis.
- [ ] Valid-as-of date visible.
- [ ] No unsupported data claim introduced.
- [ ] Language concise for requested format.
- [ ] Mode B: single-task mode enforced — confirm which task was just completed.

---

## Reference Loading Instructions

**CRITICAL CONTEXT WARNING:** This skill contains extremely large reference files (e.g., task5-report-assembly.md is 53K chars). To prevent context window overflow, **DO NOT load all references upfront**. Only load the specific reference file when actively executing the step that requires it.

## References

Load mode-specific file at the start of each session. Do not load all at once.

Mode files:
- `references/modes/mode-a-research-note.md`
- `references/modes/mode-b-initiating-coverage.md`
- `references/modes/mode-c-investor-materials.md`

Format references (load when needed):
- `references/coverage-format.md`
- `references/investor-materials-format.md`

Templates (load only for the active task):
- `assets/report-templates/research-note.md`
- `assets/report-templates/initiating-coverage.md`
- `assets/report-templates/investor-brief.md`

Task references for Mode B (load only the active task):
- `references/task1-company-research.md`
- `references/task2-financial-modeling.md`
- `references/task3-valuation.md`
- `references/task4-chart-generation.md`
- `references/task5-report-assembly.md` — load only when executing Task 5 (53K chars)
