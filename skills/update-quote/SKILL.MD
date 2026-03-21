---
name: update-quote
description: >
  Refreshes market prices, NAVs, and exchange rates in a portfolio CSV.
  Updates the value_date field to current timestamp with [auto] tag.
  Handles: Taiwan stocks/ETFs (Yahoo Finance .TW suffix), US/EU/AU equities
  (Yahoo Finance), cryptocurrencies (CoinGecko API), and exchange rates
  (Bank of Taiwan official rates). Does NOT perform investment analysis —
  outputs a refreshed CSV only. Domestic Taiwan funds (CMOGEU/CFOGEU) and
  eToro Smart Portfolios require manual confirmation; this skill will prompt
  the user for these values instead of auto-fetching.
argument-hint: "[CSV content | ticker symbol | 'FX only']"
disable-model-invocation: true
allowed-tools: Bash(curl *), Bash(python *), Read, Write
effort: medium
---

# Update-Quote Skill v1.1 — Price Refresh Execution

## Purpose & Strict Scope

This skill has ONE job: refresh prices and update `value_date`. It does NOT analyse, recommend, rebalance, or modify any field other than `最新報價`, `持有部位(原幣)`, `持有部位(台幣)`, `未實現損益(原幣)`, `未實現損益(TWD)`, `未實現報酬率`, `value_date`, and `last_updated_by`.

**HARD RULE**: Do not invoke investment analysis, routing logic, or any framework from `investment-lens`. If the user asks "and what do you think about this portfolio?", respond: "Quote refresh complete. For analysis, please use `/investment-lens`."

---

## STEP 1 — Input Parsing

Accept one of three input modes:

1. **Full CSV paste**: Parse all holdings. Apply the update matrix below to each row.
2. **Single ticker override**: e.g., `GOOG 175.50` — update only that ticker's price.
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

**For all MANUAL ONLY items**: Output a prompt in the following format:
```
⚠️ [Holding Name] ([CFI Code]) cannot be auto-fetched.
Please provide the current NAV/price manually:
- Source: [specific URL or platform]
- Expected format: [NAV per unit in original currency]
Paste the value here, or type 'skip' to leave this holding unchanged.
```

---

## STEP 3 — Staleness Pre-Check

Read the current `value_date` from the CSV header. Determine which holdings genuinely need updating:

| Days since value_date | Action |
|----------------------|--------|
| ≤ 1 trading day | Skip auto-fetchable items (already fresh). Still prompt for MANUAL items if >3 days. |
| 2–3 trading days | Fetch all auto-fetchable items. Prompt for MANUAL items. |
| 4+ trading days | Fetch all auto-fetchable items. Strongly prompt for MANUAL items with urgency flag. |

---

## STEP 4 — Price Fetch Execution

For each auto-fetchable holding, construct the appropriate API call:

**Yahoo Finance (stocks/ETFs)**:
```bash
curl -s "https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=1d" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); \
    print(d['chart']['result'][0]['meta']['regularMarketPrice'])"
```

**CoinGecko (BTC/ETH)**:
```bash
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['bitcoin']['usd'])"
```

**BTC Price Sanity Check**: If fetched BTC price < $10,000 or > $500,000, flag as `[PRICE ANOMALY — verify manually]` and do NOT write to CSV. This guards against the known anomaly (CSV showing $31.05).

---

## STEP 5 — TWD Recalculation

After all prices are updated, recalculate:

$$\text{持有部位(台幣)} = \text{持有部位(原幣)} \times \text{匯率}$$

$$\text{未實現損益(TWD)} = (\text{最新報價} - \text{平均成本(原幣)}) \times \text{單位數} \times \text{匯率}$$

$$\text{未實現報酬率} = \frac{\text{最新報價} - \text{平均成本(原幣)}}{\text{平均成本(原幣)}} \times 100\%$$

Use the exchange rates specified in the input. If not specified, use the most recent Bank of Taiwan mid-rate and note: `[FX rate: Bank of Taiwan mid-rate as of session date — verify at rate.bot.com.tw]`.

---

## STEP 6 — value_date Write-Back (MANDATORY)

After all updates are applied, update the CSV header:

```
# value_date: [YYYY-MM-DD HH:MM] (UTC+8) [auto]
# last_updated_by: investment-lens/update-quote v1.1
```

The `[auto]` tag distinguishes system-updated timestamps from user-entered ones. This is the canonical record for `investment-lens`'s Gate 0-A freshness check.

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

## Guidelines (MANDATORY constraints)

1. **No analysis**: Never output Buy/Sell/Hold recommendations. Never comment on whether a price change is "good" or "bad".
2. **No CFI reclassification**: Do not change any CFI code in the CSV, even if you believe it is incorrect. Flag suspected CFI errors as `[CFI CHECK NEEDED: current=[X], suggest=[Y]]` in the Notes column.
3. **No field deletion**: Never remove fields or rows from the CSV. Only update the price-related columns specified in the Purpose section.
4. **Domestic fund NAV**: For `CMOGEU`/`CFOGEU`/`CMOBDU` Taiwan domestic funds — mark as `T+1 NAV` and set `value_date` for these specific rows to yesterday's date: `[YYYY-MM-DD] (T+1 NAV)`.
5. **eToro Smart Portfolio**: For `CIOGMU`/`CIOGLU`/`CIOIMU` — never auto-fill. Always prompt for manual input and note the source as `(eToro platform — login required)`.
6. **BTC anomaly guard**: The known anomaly of BTC showing $31.05 in the CSV is a display error from a historical snapshot. The actual BTC price as of early 2026 is in the $80,000–$100,000+ range. Always verify fetched crypto prices against this known range before writing.

---

## Examples

**Example — Valid invocations:**
- `/update-quote [paste full CSV]`
- `/update-quote GOOG`
- `/update-quote USD=32.5`
- "更新報價"
- "Refresh my portfolio prices"

**Example — Out of scope (redirect to investment-lens):**
- "Update quotes AND tell me if I should rebalance" → Update quotes only, then say: "For rebalancing analysis, run `/investment-lens` with the updated CSV."
- "Is the new BTC price a good entry?" → "Price updated. For analysis, use `/investment-lens BTC`."
