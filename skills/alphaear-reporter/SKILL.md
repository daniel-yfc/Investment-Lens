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
compatibility: No special runtime dependencies; requires completed analysis input from upstream skills
allowed-tools: Read Grep
metadata:
  argument-hint: "[research note | initiating coverage | investor brief]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "medium"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
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
Use for short/medium-form research outputs, internal memos, thesis updates, signal summaries.

Load: `assets/report-templates/research-note.md`

### Mode B — Initiating coverage
Use for first formal write-ups with thesis, business overview, drivers, risks, valuation framing, and monitoring plan.

Load:
- `references/coverage-format.md`
- `assets/report-templates/initiating-coverage.md`

### Mode C — Investor materials
Use for investor briefings, board/committee-facing summaries, one-pagers, presentation-ready narratives.

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

### If the source is from AlphaEar signal skills
- Summarize the signal chain.
- State confidence and time horizon.
- Distinguish observed signal from inferred conclusion.

### If multiple analyses are provided
- Merge only when they refer to the same asset, theme, or decision context.
- Resolve duplication. Surface contradictions explicitly instead of flattening them.

## Structure requirements

### Research note
Title → What changed → Core view → Evidence → Risks → Monitoring points

### Initiating coverage
Investment thesis → Business overview → Key drivers → Risks and counter-thesis → Valuation/framework view → Monitoring plan → Recommendation and confidence

### Investor materials
Executive summary → What matters now → Supporting evidence → Risks → Next-step framing

## Validation checks

Before finalizing:
- Output format matches requested audience.
- All recommendations supported by analysis.
- Valid-as-of date is visible.
- No unsupported data claim introduced.
- Language is concise for the requested format.

## References

Read when needed:
- `references/coverage-format.md`
- `references/investor-materials-format.md`

Templates:
- `assets/report-templates/research-note.md`
- `assets/report-templates/initiating-coverage.md`
- `assets/report-templates/investor-brief.md`
