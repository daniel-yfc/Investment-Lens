---
name: alphaear-signal-tracker
description: Track finance investment signal evolution and update logic based on new finance market information. Use when monitoring finance signals and determining if they are strengthened, weakened, or falsified.
---

# AlphaEar Signal Tracker Skill

## Overview

This skill provides logic to track and update investment signals. It assesses how new market information impacts existing signals (Strengthened, Weakened, Falsified, or Unchanged).

> **Status**: Logic is currently embedded in `scripts/fin_agent.py` (`track_signal` method). A standalone `SignalTrackerUtility` class is planned for a future refactor. Until then, follow the interim workflow below.

## Capabilities

### 1. Track Signal Evolution (Agentic Workflow)

**YOU (the Agent)** are the Tracker. Use the prompts in `references/PROMPTS.md`.

**Workflow:**
1.  **Research**: Use **FinResearcher Prompt** to gather facts/price for a signal.
2.  **Analyze**: Use **FinAnalyst Prompt** to generate the initial `InvestmentSignal`.
3.  **Track**: For existing signals, use **Signal Tracking Prompt** to assess evolution (Strengthened/Weakened/Falsified) based on new info.

**Tools:**
- Use `alphaear-search` and `alphaear-stock` skills to gather the necessary data.
- Use `scripts/fin_agent.py` helper `_sanitize_signal_output` if needing to clean JSON output.

**Key Logic:**

-   **Input**: Existing Signal State + New Information (News/Price).
-   **Process**:
    1.  Compare new info with signal thesis.
    2.  Determine impact direction (Positive/Negative/Neutral).
    3.  Update confidence and intensity.
-   **Output**: Updated Signal.

**Interim Usage (until standalone utility is available):**

```python
# Reference implementation lives in fin_agent.py.
# Import FinAgent and call track_signal directly:
from scripts.fin_agent import FinAgent

agent = FinAgent(db)
updated_signal = agent.track_signal(existing_signal, new_info_text)
```

**Future refactor target:**

```python
# Planned standalone interface (not yet implemented):
from scripts.utils.signal_tracker import SignalTrackerUtility

tracker = SignalTrackerUtility(db)
updated_signal = tracker.track(existing_signal, new_info_text)
```

## Tech Debt

- [ ] Extract `track_signal` from `FinAgent` into `scripts/utils/signal_tracker.py` as `SignalTrackerUtility`
- [ ] Add unit tests for Strengthened / Weakened / Falsified classification
- [ ] Remove dependency on `fin_agent.py` once standalone utility is stable

## Dependencies

-   `agno` (Agent framework)
-   `sqlite3` (built-in)

Ensure `DatabaseManager` is initialized correctly.
