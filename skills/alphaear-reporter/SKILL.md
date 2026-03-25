---
name: alphaear-reporter
description: >
  Use this skill whenever completed market, company, portfolio, or signal analysis
  needs to be turned into a structured output for humans. This includes research notes,
  initiating coverage reports, thesis memos, investor briefing materials, and
  presentation-ready summaries. Use it after analysis has already been performed by
  investment-lens or other AlphaEar analysis skills. Do NOT use it as the primary
  analysis engine when the task is to discover facts, generate new quantitative models,
  refresh quotes, or perform raw market research.
allowed-tools: Read Grep
metadata:
  argument-hint: "[research note | initiating coverage | investor brief]"
  effort: "medium"
  user-invocable: "true"
  post-invoke-check: "Confirm output matches audience and template"
---

# AlphaEar Reporter

## Purpose

Use this skill as the unified output and publication layer for the Investment-Lens / AlphaEar stack.

This skill converts completed analysis into one of several finished formats:
- Research note.
- Initiating coverage report.
- Thesis memo.
- Investor briefing.
- Management or stakeholder summary.
- Materials package for downstream export.

## Do not use

Do not use this skill to:
- Perform primary market analysis from scratch.
- Refresh quotes.
- Run statistical or quantitative modeling.
- Replace `investment-lens`, `quant-analysis`, or raw signal-gathering skills.

If core analysis is missing, stop and request it first.

## Required inputs

Before writing, make sure you have:
- The underlying analysis result.
- A clear target audience.
- The output format requested or implied.
- A valid-as-of date.
- Any required constraints such as tone, length, region, or compliance style.

If these are missing, ask before drafting.

## Output modes

Choose one output mode:

### Mode A — Research note
Use for:
- Short or medium-form research outputs.
- Internal investment memos.
- Thesis updates.
- Signal summaries.

Load:
- `assets/report-templates/research-note.md`

### Mode B — Initiating coverage
Use for:
- First formal write-up on a company, security, or theme.
- Longer reports with thesis, business overview, drivers, risks, valuation framing, and monitoring plan.

Load:
- `references/coverage-format.md`
- `assets/report-templates/initiating-coverage.md`

### Mode C — Investor materials
Use for:
- Investor briefings.
- Board or committee-facing summaries.
- One-page materials.
- Narrative outputs intended for presentation or stakeholder communication.

Load:
- `references/investor-materials-format.md`
- `assets/report-templates/investor-brief.md`

## Writing rules

Always:
- Preserve the substance of the source analysis.
- Tighten structure and readability.
- Match the audience and tone.
- Separate fact, interpretation, and recommendation.
- Make uncertainty visible.
- Preserve dates, assumptions, and source sensitivity.

Never:
- Invent evidence not found in the source analysis.
- Upgrade weak evidence into strong conviction.
- Hide disagreement, scenario tension, or unresolved risks.

## Transformation logic

### If the source is from `investment-lens`
- Preserve the recommendation, confidence, thesis, risks, and kill conditions.
- Convert internal framework language into readable prose where needed.
- Keep scenario language intact.

### If the source is from AlphaEar signal skills
- Summarize the signal chain.
- State confidence and time horizon.
- Distinguish observed signal from inferred conclusion.

### If multiple analyses are provided
- Merge only when they refer to the same asset, theme, or decision context.
- Resolve duplication.
- Surface contradictions explicitly instead of flattening them.

## Structure requirements

### Research note
Include:
- Title.
- What changed.
- Core view.
- Evidence.
- Risks.
- Monitoring points.

### Initiating coverage
Include:
- Investment thesis.
- Business or asset overview.
- Key drivers.
- Risks and counter-thesis.
- Valuation or framework view.
- Monitoring plan.
- Recommendation and confidence.

### Investor materials
Include:
- Executive summary.
- What matters now.
- Supporting evidence.
- Risks.
- Clear next-step framing.

## Validation checks

Before finalizing:
- Check that the output format matches the requested audience.
- Check that all recommendations are supported by analysis.
- Check that the valid-as-of date is visible.
- Check that no unsupported data claim was introduced.
- Check that the language is concise enough for the requested format.

## References

Read when needed:
- `references/coverage-format.md`
- `references/investor-materials-format.md`

Templates:
- `assets/report-templates/research-note.md`
- `assets/report-templates/initiating-coverage.md`
- `assets/report-templates/investor-brief.md`