
## `skills/alphaear-reporter/references/coverage-format.md`

# Initiating Coverage Format

## When to use this format

Load this file when the output mode is `Initiating Coverage`.

Use for:
- First formal write-up on a company, security, or investment theme.
- Longer-form research outputs with structured thesis and monitoring plan.
- Reports intended for internal or external investment committee distribution.

---

## Required inputs before writing

| Input | Required | Source |
|---|---|---|
| Core investment thesis | Yes | `investment-lens` output |
| Recommendation | Yes | Buy / Accumulate / Hold / Reduce / Sell |
| Confidence level | Yes | High / Medium / Low |
| Asset class and CFI classification | Yes | `asset-classification.md` |
| Valuation framing | Yes | From analysis |
| Key drivers | Yes | Minimum 3 |
| Key risks | Yes | Minimum 3 |
| Kill conditions | Yes | Exactly 3, with measurable thresholds |
| Valid-as-of date | Yes | From source analysis |
| Company or asset overview | Recommended | |
| Competitive context | Recommended | |
| Catalyst calendar | If available | |

---

## Report structure

### Section 1 — Executive summary
- One paragraph.
- Lead with recommendation and confidence.
- State the single most important reason.
- State the single most important risk.
- State the valid-as-of date.

### Section 2 — Business or asset overview
- What the company or asset does.
- Revenue model or value driver.
- Competitive position.
- Relevant market size or macro context.
- No more than 300 words.

### Section 3 — Investment thesis
- State the core thesis in one or two sentences.
- List the key drivers in order of importance.
- For each driver, state: what it is, why it matters, and what evidence supports it.

### Section 4 — Valuation and return framing
- State the valuation methodology or framework used.
- Provide bear / base / bull framing.
- Do not give a single-point price target without scenario bounds.
- State all assumptions explicitly.

### Section 5 — Key risks and counter-thesis
- List at least three risks.
- For each risk, state: what could go wrong, how likely it is qualitatively, and
  what the impact would be.
- Dedicate one paragraph to the strongest counter-thesis.

### Section 6 — Kill conditions
- Exactly three kill conditions.
- Format: "If [metric] crosses [threshold] by [date/event], exit position. Rationale: [one sentence]."

### Section 7 — Monitoring plan
- What data points to watch.
- What events or reports matter most.
- Suggested review trigger rather than fixed calendar.

---

## Tone and style rules

- Use active voice.
- Avoid corporate boilerplate.
- Do not hedge every sentence. Commit to a view; state where uncertainty exists.
- Keep sentences short. If a sentence is longer than 30 words, split it.
- Numbers must be cited to a source tier:
  - Tier 1: Regulatory filings.
  - Tier 2: Bloomberg, Morningstar, FRED.
  - Tier 3: Company IR, flag as `[Self-reported]`.

---

## Gotchas

- Do not upgrade medium-confidence findings to high-confidence in the write-up.
- If the source analysis had unresolved philosophical conflicts (e.g., Quality
  Compounder = Buy vs. Macro-Tactical = Sell), preserve and disclose both signals.
  Do not flatten them.
- Kill conditions must be measurable. "If the stock falls significantly" is not a
  valid kill condition.
