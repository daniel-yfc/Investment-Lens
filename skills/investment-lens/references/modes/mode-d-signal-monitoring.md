# Mode D — Signal Monitoring

Load this file when the task involves monitoring an existing investment signal
and assessing how new market information changes its status.

This mode absorbs all content from the deprecated `alphaear-signal-tracker` skill.

---

## When to Use Mode D

- User provides an existing investment thesis or signal and asks:
  - "Has anything changed for my X position?"
  - "Does this news affect my thesis?"
  - "Is my signal still valid?"
  - "Update my TSMC view based on latest earnings."
- Scheduled or event-triggered thesis review.
- Post-event signal classification.

## Do Not Use Mode D

- To generate a new investment thesis from scratch → use Mode A.
- To rebalance a portfolio → use Mode B.
- To adjust a personal allocation → use Mode C.

---

## Required Inputs

- Existing signal or thesis (text description or structured signal object).
- New market information (news, earnings, macro event, price action).
- Original valid-as-of date of the signal.
- Asset identifier (ticker or name).

---

## Signal Classification Framework

Assign exactly one of four statuses:

| Status | Criteria |
|--------|----------|
| **Strengthened** | New information provides additional evidence supporting the original thesis; probability of the thesis being correct has increased |
| **Weakened** | New information contradicts one or more key assumptions; probability reduced but thesis not disproven |
| **Falsified** | A core assumption has been definitively proven wrong, OR a kill condition has been triggered |
| **Unchanged** | New information is neutral, already priced in, or irrelevant to the thesis drivers |

---

## Analysis Workflow

1. **Retrieve** the existing signal:
   - Extract the original thesis, key assumptions, time horizon, and kill conditions.
   - Note the original valid-as-of date.

2. **Research** new information:
   - Use `alphaear-news` or `alphaear-search` to gather relevant new data.
   - Use `alphaear-stock` for price action context if relevant.

3. **Classify** the signal:
   - Map new information against each key assumption.
   - Check whether any kill condition has been triggered.
   - Assign Strengthened / Weakened / Falsified / Unchanged.
   - Justify the classification with specific evidence.

4. **Update** the signal record:
   - State the new valid-as-of date.
   - Revise the thesis text where warranted.
   - Revise kill conditions if the risk landscape has changed.
   - If Falsified: state clearly that the position should be reviewed immediately.

5. **Output** the updated signal:
   ```
   Asset: [ticker / name]
   Prior status: [prior classification or 'Initial']
   New status: [Strengthened | Weakened | Falsified | Unchanged]
   New valid-as-of: [date]
   Classification rationale: [2–3 sentences]
   Updated thesis: [revised or unchanged text]
   Kill conditions: [updated list or 'unchanged']
   Recommended action: [Hold / Review / Exit immediately]
   ```

---

## Prompts (for agentic use)

If running as part of an agentic pipeline, load the following prompts
from `alphaear-signal-tracker/references/PROMPTS.md`:

- **FinResearcher Prompt** — gather facts and price context for the signal.
- **FinAnalyst Prompt** — generate the updated `InvestmentSignal` object.
- **Signal Tracking Prompt** — classify evolution status.

## Tech Debt (carried from alphaear-signal-tracker)

- [ ] Extract `track_signal` from `alphaear-signal-tracker/scripts/fin_agent.py`
      into a standalone `SignalTrackerUtility` class.
- [ ] Add unit tests for Strengthened / Weakened / Falsified classification.
- [ ] Remove dependency on `fin_agent.py` once standalone utility is stable.
