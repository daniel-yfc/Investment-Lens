---
name: update-quote
description: >
  Refreshes market prices, NAVs, and exchange rates in a portfolio CSV.
  Updates the value_date field to current timestamp with [auto] tag.
  Handles: Taiwan stocks/ETFs (Yahoo Finance .TW suffix), US/EU/AU equities
  (Yahoo Finance), cryptocurrencies (CoinGecko API), and exchange rates
  (Bank of Taiwan official rates). Does NOT perform investment analysis —
  outputs a refreshed CSV only. Use when the user says 'refresh prices',
  'update quotes', '更新報價', or when investment-lens flags stale data.
  Domestic Taiwan funds (CMOGEU/CFOGEU) and eToro Smart Portfolios require
  manual confirmation; this skill will prompt for those values.
compatibility: Requires curl, python3, internet access to Yahoo Finance, CoinGecko API, and rate.bot.com.tw
allowed-tools: Bash(curl *) Bash(python *) Read Write
metadata:
  argument-hint: "[CSV content | ticker symbol | 'FX only']"
  disable-model-invocation: "true"
  effort: "medium"
---

# Update-Quote Skill v1.1 — Price Refresh Execution

## Purpose & Strict Scope

This skill has ONE job: refresh prices and update `value_date`. It does NOT analyse, recommend, rebalance, or modify any field other than `最新報價`, `持有部位(原幣)`, `持有部位(台幣)`, `未實現損益(原幣)`, `未實現損益(TWD)`, `未實現報酬率`, `value_date`, and `last_updated_by`.

**HARD RULE**: Do not invoke investment analysis, routing logic, or any framework from `investment-lens`. If the user asks “and what do you think about this portfolio?”, respond: “Quote refresh complete. For analysis, please use `/investment-lens`.”

---

## STEP 1 — Input Parsing

Accept one of three input modes:

1. **Full CSV paste**: Parse all holdings. Apply the update matrix below to each row.
2. **Single ticker override**: e.g., `GOOG 175.50` — update only that ticker’s price.
3. **FX-only update**: e.g., `USD=32.5, EUR=35.2, AUD=20.8` — recalculate all TWD values using new rates without fetching new equity prices.

---

## STEP 2 — CFI-to-Source Routing Matrix

Load `references/asset-classification.md` to resolve ambiguous tickers. Apply the source routing table:

| CFI Code | Asset Type | Ticker Format | Primary Source | Fallback |
|---------|-----------|--------------|---------------|---------|
| `ESVUFR` / `CEOGDU` / `CEOBDU` (Taiwan) | TW stocks/ETFs | `{code}.TW` | Yahoo Finance | Manual |
| `CEOBDU` (00720B) | TW Bond ETF | `00720B.TW` | Yahoo Finance | Manual |
| `ESVTFR` / `CEORDU` (US) | US stocks/ETFs | Ticker as-is | Yahoo Finance | Manual |
| `ESVUFR` (EUR listed) | EU stocks | `{code}.MI`, `{code}.AS` etc. | Yahoo Finance | Manual |
| `ESVUFR` (AUD listed) | AU stocks | `{code}.AX` | Yahoo Finance | Manual |
| `CIOGBU` | Crypto (BTC/ETH) | CoinGecko ID | CoinGecko API | Manual |
| `CMOGEU` / `CFOGEU` / `CMOBDU` | Domestic TW funds (T+1 NAV) | ISIN | ⚠️ MANUAL ONLY | — |
| `CIOGMU` / `CIOGLU` / `CIOIMU` | eToro Smart Portfolios | — | ⚠️ MANUAL ONLY | — |
| `CFOGEU` | Foreign currencies | — | Bank of Taiwan official rates | Manual |
| `CEOGEU` / `CEOIBU` (LU/IE ISIN) | Foreign funds | ISIN | ⚠️ MANUAL ONLY (monthly) | — |

**For all MANUAL ONLY items**, output a prompt in this format:
```
⚠️ [Holding Name] ([CFI Code]) cannot be auto-fetched.
Please provide the current NAV/price manually:
- Source: [specific URL or platform]
- Expected format: [NAV per unit in original currency]
Paste the value here, or type 'skip' to leave this holding unchanged.
```

---

## STEP 3 — Staleness Pre-Check

Read the current `value_date` from the CSV header and determine which holdings need updating:

| Days since value_date | Action |
|----------------------|--------|
| ≤ 1 trading day | Skip auto-fetchable items (already fresh). Still prompt for MANUAL items if >3 days. |
| 2–3 trading days | Fetch all auto-fetchable items. Prompt for MANUAL items. |
| 4+ trading days | Fetch all auto-fetchable items. Strongly prompt for MANUAL items with urgency flag. |

---

## STEP 4 — Price Fetch Execution

**Yahoo Finance (stocks/ETFs):**
```bash
curl -s "https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=1d" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); \
    print(d['chart']['result'][0]['meta']['regularMarketPrice'])"
```

**CoinGecko (BTC/ETH):**
```bash
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['bitcoin']['usd'])"
```

**BTC Price Sanity Check**: If fetched BTC price < $10,000 or > $500,000, flag as `[PRICE ANOMALY — verify manually]` and do NOT write to CSV.

---

## STEP 5 — TWD Recalculation

After all prices are updated, recalculate:
- `持有部位(台幣) = 持有部位(原幣) × 匯率`
- `未實現損益(TWD) = (最新報價 - 平均成本(原幣)) × 單位數 × 匯率`
- `未實現報酬率 = (最新報價 - 平均成本(原幣)) / 平均成本(原幣) × 100%`

If FX rate not specified, use Bank of Taiwan mid-rate and note: `[FX rate: Bank of Taiwan mid-rate as of session date — verify at rate.bot.com.tw]`.

---

## STEP 6 — value_date Write-Back (MANDATORY)

After all updates are applied, update the CSV header:

```
# value_date: [YYYY-MM-DD HH:MM] (UTC+8) [auto]
# last_updated_by: investment-lens/update-quote v1.1
```

The `[auto]` tag distinguishes system-updated timestamps from user-entered ones. This is the canonical record for `investment-lens`’s Gate 0-A freshness check.

---

## STEP 7 — Update Summary Report

Output a structured summary before returning the updated CSV:

```
✅ Update-Quote Complete — [YYYY-MM-DD HH:MM UTC+8]

Auto-updated (Yahoo Finance): [N] holdings
Auto-updated (CoinGecko): [N] holdings
Manual confirmation pending: [list of holdings]
Skipped (already fresh): [N] holdings
Anomalies flagged: [list, or 'None']

FX rates used:
  USD/TWD: [X]
  EUR/TWD: [X]
  AUD/TWD: [X]

Portfolio total (TWD): NT$[X]
Change from previous value_date: [+/-]NT$[Y] ([+/-]Z%)

⚠️ Pending manual updates for: [list]
To proceed with analysis: /investment-lens [paste updated CSV]
```

---

## Mandatory Constraints

1. **No analysis**: Never output Buy/Sell/Hold recommendations or comment on whether a price change is “good” or “bad”.
2. **No CFI reclassification**: Do not change any CFI code. Flag suspected errors as `[CFI CHECK NEEDED: current=[X], suggest=[Y]]` in the Notes column.
3. **No field deletion**: Never remove fields or rows from the CSV.
4. **Domestic fund NAV**: For `CMOGEU`/`CFOGEU`/`CMOBDU` — mark as `T+1 NAV` and set `value_date` for those rows to yesterday: `[YYYY-MM-DD] (T+1 NAV)`.
5. **eToro Smart Portfolio**: For `CIOGMU`/`CIOGLU`/`CIOIMU` — never auto-fill; always prompt and note source as `(eToro platform — login required)`.
6. **BTC anomaly guard**: Actual BTC price as of early 2026 is in the $80,000–$100,000+ range. Always verify fetched crypto prices before writing.

---

## Valid Invocation Examples

- `/update-quote [paste full CSV]`
- `/update-quote GOOG`
- `/update-quote USD=32.5`
- "更新報價"
- "Refresh my portfolio prices"

**Out of scope — redirect to investment-lens:**
- "Update quotes AND tell me if I should rebalance" → Update quotes only, then: "For rebalancing analysis, run `/investment-lens` with the updated CSV."
- "Is the new BTC price a good entry?" → "Price updated. For analysis, use `/investment-lens BTC`."
