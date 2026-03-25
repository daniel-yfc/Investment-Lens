---
name: initiating-coverage
description: >
  DEPRECATED — functionality fully merged into alphaear-reporter (Mode B).
  Use alphaear-reporter when creating institutional equity research initiation
  reports. All 5-task workflow logic (company research, financial modeling,
  valuation, chart generation, report assembly) is now accessible via
  alphaear-reporter Mode B. Do NOT invoke this skill directly.
compatibility: Deprecated — no runtime dependencies required
allowed-tools: Read
metadata:
  status: "deprecated"
  replaced-by: "alphaear-reporter"
  replacement-mode: "Mode B — Initiating Coverage"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  user-invocable: "false"
---

# Initiating Coverage — DEPRECATED

> **This skill has been merged into `alphaear-reporter` (Mode B).**
> Do not invoke directly. Use `alphaear-reporter` instead.

## Migration Guide

All prior functionality is preserved under `alphaear-reporter` Mode B:

```
User: Create an initiating coverage report for [Company]
→ alphaear-reporter activates
→ Detects initiating coverage request
→ Loads Mode B instructions from references/modes/mode-b-initiating-coverage.md
→ Executes 5-task workflow (single-task mode enforced)
```

## Reference files (still valid, now read via alphaear-reporter)

- `references/task1-company-research.md`
- `references/task2-financial-modeling.md`
- `references/task3-valuation.md`
- `references/task4-chart-generation.md`
- `references/task5-report-assembly.md`
- `references/valuation-methodologies.md`
