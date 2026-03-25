---
name: alphaear-signal-tracker
description: >
  DEPRECATED — signal tracking functionality merged into investment-lens (Mode D).
  Use investment-lens for monitoring existing investment signals, assessing whether
  new market information strengthens, weakens, or falsifies a prior signal, and
  updating signal status (Strengthened / Weakened / Falsified / Unchanged).
  Do NOT invoke this skill directly.
compatibility: Deprecated — logic now invoked via investment-lens Mode D
allowed-tools: Read
metadata:
  status: "deprecated"
  replaced-by: "investment-lens"
  replacement-mode: "Mode D — Signal Monitoring"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  user-invocable: "false"
  upstream-primary-skill: "investment-lens"
---

# AlphaEar Signal Tracker — DEPRECATED

> **This skill has been merged into `investment-lens` (Mode D).**
> Do not invoke directly. Use `investment-lens` instead.

## Migration Guide

```
User: Has anything changed for my TSMC thesis?
→ investment-lens activates
→ Detects existing signal + new information → Mode D
→ Loads references/modes/mode-d-signal-monitoring.md
→ Runs Strengthened / Weakened / Falsified / Unchanged classification
```

## Tech Debt (carried forward to investment-lens)

- [ ] Extract `track_signal` from `scripts/fin_agent.py` into
      `investment-lens/scripts/signal_tracker.py` as `SignalTrackerUtility`
- [ ] Add unit tests for signal classification logic
- [ ] Remove dependency on `fin_agent.py` once standalone utility is stable

## References (still readable for migration reference)

- `references/PROMPTS.md` — FinResearcher / FinAnalyst / Signal Tracking prompts
