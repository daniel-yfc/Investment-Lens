# Datapack Builder — Full Workflow

Detailed phase-by-phase instructions for building a financial data pack.
Load this file at the start of a build session.

---

## Phase 1: Document Processing and Data Extraction

### Step 1.1 — Analyze source data
- Access source materials: uploaded documents, web search for public filings, or MCP server data.
- Review data structure and identify key sections.
- Locate financial statements (typically 3–5 years historical).
- Identify management projections if included.
- Note fiscal year-end date.
- Flag any data quality issues immediately.

### Step 1.2 — Extract financial statements
- Locate historical income statement data.
- Extract balance sheet snapshots (year-end or quarter-end).
- Find cash flow statement.
- Extract management projections if available.
- Note all page references for traceability.

### Step 1.3 — Extract operating metrics
- Identify non-financial KPIs relevant to the industry.
- Capture unit economics data.
- Extract customer/location/capacity data.
- Document growth metrics and trends.

### Step 1.4 — Extract market and industry data
- Competitive positioning information.
- Market size and growth rates.
- Industry benchmark data.
- Peer comparison information.

### Step 1.5 — Note key context
- Transaction structure and rationale.
- Management team background.
- Investment highlights from source materials.
- Risk factors and considerations.
- Any data gaps or inconsistencies.

---

## Phase 2: Data Normalization and Standardization

### Step 2.1 — Normalize accounting presentation
- Ensure consistent line item names across all years.
- Standardize revenue recognition treatment.
- Identify and document one-time charges.
- Create "Adjusted EBITDA" reconciliation if needed.
- Note any accounting policy changes.

### Step 2.2 — Apply format detection logic
For each data point:
- Read tab name, table title, column header, and row label.
- Apply Essential Format Rules from SKILL.md.
- When uncertain, examine original source document.
- Default to cleaner formatting (less is more).

### Step 2.3 — Identify normalization adjustments
Common adjustments to document (see `references/normalization.md` for patterns):
- Restructuring charges.
- Stock-based compensation.
- Acquisition-related costs.
- Legal settlements or litigation costs.
- Asset sales or impairments.
- Related party adjustments.

### Step 2.4 — Create adjustment schedule
For every normalization:
- Document what was adjusted and why.
- Cite source (document page number, URL, or data source reference).
- Quantify dollar impact by year.
- Assess recurrence risk.
- Show calculation from reported to adjusted figures.

### Step 2.5 — Verify data integrity
- Confirm subtotals sum correctly using formulas.
- Verify balance sheet balances.
- Check cash flow ties to balance sheet changes.
- Cross-check numbers across tabs for consistency.
- Flag any discrepancies for investigation.

---

## Phase 3: Build Excel Workbook

**CRITICAL**: Use the `xlsx` skill for all Excel file manipulation. Read xlsx skill documentation before proceeding.

### Step 3.1 — Create standardized tab structure
Create workbook with tabs in order:
1. Executive Summary
2. Historical Financials
3. Balance Sheet
4. Cash Flow
5. Operating Metrics
6. Property Performance (if applicable)
7. Market Analysis
8. Investment Highlights

### Step 3.2 — Build each tab with proper formatting
Apply formatting rules systematically:
- Headers: Bold, left-aligned, 11pt font.
- Financial data: Currency format `$#,##0.0` for millions.
- Operational data: Number format `#,##0` (no `$`).
- Percentages: `0.0%` format.
- Years: Text format to prevent comma insertion.
- Negatives: Accounting format with parentheses.
- Underlines: Single above subtotals, double below totals.

### Step 3.3 — Insert formulas for calculations
- All subtotals and totals must be formula-based.
- Link balance sheet to income statement where appropriate.
- Link cash flow to both income statement and balance sheet.
- Create cross-tab references for validation.
- Never hardcode any calculated values.
- Follow correct row-tracking patterns from `references/patterns.md`.

### Step 3.4 — Apply professional presentation
- Freeze top row and first column on each data tab.
- Set appropriate column widths (typically 12–15 characters).
- Right-align all numeric data.
- Left-align all text and headers.
- Add single/double underlines per accounting standards.
- Ensure clean, minimal appearance.

---

## Phase 4: Scenario Building (if projections included)

### Management Case
- Present company's projections as provided in source materials.
- Extract all management assumptions.
- Document growth rates, margin expansion, capital requirements.
- Note any "hockey stick" inflections that require scrutiny.
- Label clearly as "Management Case".

### Base Case (Risk-Adjusted)
- Apply conservative adjustments to management projections.
- Apply revenue growth haircut reflecting execution risk.
- Moderate margin expansion based on industry benchmarks.
- Increase capex assumptions if growth-dependent.
- Add working capital requirements if understated.
- Document all adjustments with rationale.

### Downside Case (optional — recommended for LBO analysis)
- Model revenue decline reflecting recession risk or competitive pressure.
- Assume margin compression under stress.
- Test covenant compliance and liquidity.
- Assess downside protection.
- Document key risks being stress-tested.

### Documentation requirements for scenarios
- Key assumptions by scenario (revenue growth, margins, capex %).
- Rationale for each adjustment.
- Sensitivity analysis on key variables.
- Historical forecast accuracy if available.
- Comparison to industry benchmarks.

---

## Phase 5: Quality Control and Validation

### Step 5.1 — Data accuracy checks
- Every number traces to source.
- All calculations are formula-based.
- Subtotals and totals are mathematically correct.
- Years display without commas (2024 NOT 2,024).
- No formula errors: `#REF!`, `#VALUE!`, `#DIV/0!`, `#N/A`.

### Step 5.2 — Format consistency checks
- Financial data has `$` signs.
- Operational data has NO `$` signs.
- Percentages display as `%` (15.0% not 0.15).
- Negative numbers use parentheses for financial data.
- Headers are bold and left-aligned.
- Numbers are right-aligned.
- Years are text format.

### Step 5.3 — Structure and completeness checks
- All required tabs present and properly sequenced.
- Executive summary is concise (fits on one page).
- All key metrics captured comprehensively.
- Logical flow from summary to detail.
- No missing data or incomplete sections.

### Step 5.4 — Professional presentation checks
- Minimal borders (only for structure).
- Consistent indentation (2 spaces for sub-items).
- Proper accounting underlines (single and double).
- Clean, professional appearance throughout.
- Appropriate column widths.

### Step 5.5 — Documentation checks
- All normalization adjustments explained.
- Every key data cell cited from source.
- Assumptions documented with rationale.
- Any data limitations noted.
- Filename follows convention: `CompanyName_DataPack_YYYY-MM-DD.xlsx`.

---

## Phase 6: Final Delivery

### Step 6.1 — Create executive summary
Write concise, impactful summary including:
- Company overview: business model, products/services, geography (2–3 sentences).
- Key financial metrics: Revenue, EBITDA, Growth rates (table format).
- Investment highlights: 3–5 key strengths or opportunities.
- Notable risks or considerations (briefly).
- Transaction context if applicable.

### Step 6.2 — Final file preparation
- Run full checklist from `references/checklist.md`.
- Save workbook: `CompanyName_DataPack_YYYY-MM-DD.xlsx`.
