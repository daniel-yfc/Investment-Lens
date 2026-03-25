---
name: asset-allocation
description: >
  DEPRECATED — functionality fully merged into investment-lens (Mode C).
  Use investment-lens for personal allocation, retirement planning, goal-based
  asset allocation, risk-tolerance assessment, and CFA IPS framework outputs.
  Do NOT invoke this skill directly.
compatibility: Deprecated — no runtime dependencies required
allowed-tools: Read
metadata:
  status: "deprecated"
  replaced-by: "investment-lens"
  replacement-mode: "Mode C — Personal Allocation"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  user-invocable: "false"
---

# Asset Allocation Advisor — DEPRECATED

> **This skill has been merged into `investment-lens` (Mode C).**
> Do not invoke directly. Use `investment-lens` instead.

## Migration Guide

All prior functionality is preserved under `investment-lens` Mode C:

```
User: Help me plan my retirement allocation
→ investment-lens activates
→ Detects personal allocation request → Mode C
→ Loads references/modes/mode-c-personal-allocation.md
→ Applies CFA IPS framework, RRTTLLU principles, 12-section report
```

## Content now living in investment-lens

- CFA IPS 12-section framework → `investment-lens/references/modes/mode-c-personal-allocation.md`
- Risk level table (Conservative → Very Aggressive) → Mode C file
- Asset allocation model portfolios (Level 1–4) → Mode C file
- Platform execution guide (TW/US/HK) → Mode C file
- Detailed references:
  - `references/product-selection.md`
  - `references/rebalancing-protocol.md`
  - `references/macro-framework.md`
  - `references/behavioral-biases.md`
  - `references/purchase-guide.md`
