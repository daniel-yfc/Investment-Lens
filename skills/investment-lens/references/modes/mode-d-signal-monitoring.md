# Mode D — Signal Monitoring

Load this file when the task involves monitoring an existing investment signal
and assessing how new market information changes its status.

> Content from the former `alphaear-signal-tracker` skill is now fully inlined here.

---

## When to Use Mode D

- User provides an existing investment thesis or signal and asks:
  - “Has anything changed for my X position?”
  - “Does this news affect my thesis?”
  - “Is my signal still valid?”
  - “Update my TSMC view based on latest earnings.”
- Scheduled or event-triggered thesis review.
- Post-event signal classification.

## Do Not Use Mode D

- To generate a new investment thesis → use Mode A.
- To rebalance a portfolio → use Mode B.
- To adjust a personal allocation → use Mode C.

---

## Required Inputs

- Existing signal or thesis (text or structured signal object).
- New market information (news, earnings, macro event, price action).
- Original valid-as-of date.
- Asset identifier (ticker or name).

---

## Signal Classification Framework

| Status | Criteria |
|--------|----------|
| **Strengthened** | New information adds evidence supporting original thesis; probability increased |
| **Weakened** | New information contradicts a key assumption; probability reduced but not disproven |
| **Falsified** | A core assumption definitively disproven, OR a kill condition triggered |
| **Unchanged** | New information is neutral, already priced in, or irrelevant to thesis drivers |

---

## Analysis Workflow

1. **Retrieve** the existing signal:
   - Extract original thesis, key assumptions, time horizon, and kill conditions.
   - Note the original valid-as-of date.

2. **Research** new information:
   - Use `alphaear-news` or `alphaear-search` to gather relevant new data.
   - Use `alphaear-stock` for price action context if relevant.

3. **Classify** the signal:
   - Map new information against each key assumption.
   - Check whether any kill condition has been triggered.
   - Assign Strengthened / Weakened / Falsified / Unchanged.
   - Justify with specific evidence.

4. **Update** the signal record:
   - State new valid-as-of date.
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

## Agentic Pipeline

If running as part of an automated agentic pipeline, use:

**Entry point:** `skills/investment-lens/scripts/fin_agent.py`

**Prompt definitions:** `skills/investment-lens/references/PROMPTS.md`

| Prompt | Role |
|--------|------|
| FinResearcher | Gather facts, verify tickers, map industry chain, check price history |
| FinAnalyst | Transform research into structured `InvestmentSignal` JSON (ISQ schema) |
| Signal Tracking | Re-evaluate prior signal against new data; detect Strengthened / Weakened / Falsified |

**Schema:** `skills/investment-lens/scripts/schema/isq_template.py` — defines the `InvestmentSignal` object structure.

**Toolkits:** `skills/investment-lens/scripts/tools/toolkits.py` — price lookup, news fetch, search.

> The former `alphaear-signal-tracker/scripts/` pipeline is superseded by the above.
> The `alphaear-signal-tracker` directory is retained for archival reference only.

---

## Tech Debt

- [ ] Remove legacy `alphaear-signal-tracker/scripts/fin_agent.py` once migration is validated.
- [ ] Add unit tests for signal classification logic in `investment-lens/scripts/`.
- [ ] Verify `toolkits.py` covers all tool calls previously handled by `alphaear-signal-tracker`.
