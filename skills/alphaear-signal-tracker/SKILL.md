---
name: alphaear-signal-tracker
description: >
  Track finance investment signal evolution and update logic based on new market
  information. Use when monitoring finance signals and determining if they are
  Strengthened, Weakened, Falsified, or Unchanged. Do NOT invoke directly for
  new signal generation — use investment-lens for initial analysis first.
compatibility: Requires agno (Agent framework), sqlite3 (built-in), DatabaseManager initialized
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[existing signal + new info | signal ID]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "medium"
  user-invocable: "false"
  upstream-primary-skill: "investment-lens"
---

# AlphaEar Signal Tracker Skill

## Overview

Track and update investment signals. Assesses how new market information impacts existing signals: Strengthened, Weakened, Falsified, or Unchanged.

> **Status**: Logic is currently embedded in `scripts/fin_agent.py` (`track_signal` method). A standalone `SignalTrackerUtility` class is planned for a future refactor.

## Capabilities

### 1. Track Signal Evolution (Agentic Workflow)

Use the prompts in `references/PROMPTS.md`.

**Workflow:**
1. **Research**: Use **FinResearcher Prompt** to gather facts/price for a signal.
2. **Analyze**: Use **FinAnalyst Prompt** to generate the initial `InvestmentSignal`.
3. **Track**: Use **Signal Tracking Prompt** to assess evolution (Strengthened/Weakened/Falsified) based on new info.

**Tools:**
- Use `alphaear-search` and `alphaear-stock` skills to gather data.
- Use `scripts/fin_agent.py` helper `_sanitize_signal_output` to clean JSON output.

**Interim Usage (until standalone utility is available):**
```python
from scripts.fin_agent import FinAgent
agent = FinAgent(db)
updated_signal = agent.track_signal(existing_signal, new_info_text)
```

**Future refactor target:**
```python
from scripts.utils.signal_tracker import SignalTrackerUtility
tracker = SignalTrackerUtility(db)
updated_signal = tracker.track(existing_signal, new_info_text)
```

## Tech Debt

- [ ] Extract `track_signal` from `FinAgent` into `scripts/utils/signal_tracker.py` as `SignalTrackerUtility`
- [ ] Add unit tests for Strengthened / Weakened / Falsified classification
- [ ] Remove dependency on `fin_agent.py` once standalone utility is stable

## Dependencies

- `agno` (Agent framework)
- `sqlite3` (built-in)
- Ensure `DatabaseManager` is initialized correctly.
