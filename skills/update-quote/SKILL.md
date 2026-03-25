---
name: update-quote
description: >
  Refreshes current market prices, NAVs, and exchange rates in a portfolio CSV,
  then recalculates TWD values and updates the value_date field. Use when the
  user says 'refresh prices', 'update quotes', '更新報價', or when investment-lens
  flags stale data. Supports Taiwan stocks/ETFs (.TW via Yahoo Finance), US/EU/AU
  equities (Yahoo Finance), cryptocurrencies (CoinGecko), and exchange rates
  (Bank of Taiwan). Outputs a refreshed CSV only — does NOT perform investment
  analysis. Do NOT use to retrieve historical OHLCV series for analysis —
  use alphaear-stock for that. Domestic Taiwan funds and eToro Smart Portfolios
  require manual confirmation; this skill will prompt for those values.
compatibility: Requires curl, python3, internet access to Yahoo Finance, CoinGecko API, and rate.bot.com.tw
allowed-tools: Bash(curl *) Bash(python *) Read Write
metadata:
  argument-hint: "[CSV content | ticker symbol | 'FX only']"
  disable-model-invocation: "true"
  version: "1.1"
  last-updated: "2026-03-26"
  effort: "medium"
---

# Update-Quote Skill v1.1 — Price Refresh Execution

## Purpose & Strict Scope

This skill has ONE job: refresh current prices in a portfolio CSV and update `value_date`.

**Hard boundaries:**

| In scope | Out of scope — redirect |
|----------|------------------------|
| Fetch latest price for each holding | Investment analysis → `investment-lens` |
| Recalculate TWD position values | Historical OHLCV series → `alphaear-stock` |
| Update `value_date` with `[auto]` tag | Portfolio rebalancing → `investment-lens` |
| Prompt for MANUAL-only holdings | Quantitative modelling → `quant-analysis` |

**HARD RULE**: Do not invoke investment analysis or any framework from `investment-lens`.
If user asks “and what do you think about this portfolio?” respond:
> “Quote refresh complete. For analysis, please use `/investment-lens`.”

**Boundary with `alphaear-stock`**: `update-quote` writes to your CSV and updates
`value_date`. `alphaear-stock` provides historical OHLCV DataFrames for analysis
or modelling — it never writes to your CSV. Use the right tool for the right job.

---

## STEP 1 — Input Parsing

Accept one of three input modes:

1. **Full CSV paste**: parse all holdings, apply update matrix to each row.
2. **Single ticker override**: e.g. `GOOG 175.50` — update only that ticker.
3. **FX-only update**: e.g. `USD=32.5, EUR=35.2, AUD=20.8` — recalculate all TWD values without fetching equity prices.

---

## STEP 2 — CFI-to-Source Routing Matrix

Load `references/asset-classification.md` to resolve ambiguous tickers. Apply:

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

For all MANUAL ONLY items, output:
```
⚠️ [Holding Name] ([CFI Code]) cannot be auto-fetched.
Please provide the current NAV/price manually:
- Source: [specific URL or platform]
- Expected format: [NAV per unit in original currency]
Paste the value here, or type 'skip' to leave unchanged.
```

---

## STEP 3 — Staleness Pre-Check

| Days since value_date | Action |
|----------------------|--------|
| ≤ 1 trading day | Skip auto-fetchable (already fresh). Prompt MANUAL if >3 days. |
| 2–3 trading days | Fetch all auto-fetchable. Prompt MANUAL. |
| 4+ trading days | Fetch all auto-fetchable. Strongly prompt MANUAL with urgency flag. |

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

**BTC Sanity Check**: If fetched BTC price < $10,000 or > $500,000, flag as
`[PRICE ANOMALY — verify manually]` and do NOT write to CSV.

---

## STEP 5 — TWD Recalculation

- `持有部位(台幣) = 持有部位(原幣) × 匯率`
- `未實現損益(TWD) = (最新報價 - 平均成本(原幣)) × 單位數 × 匯率`
- `未實現報酬率 = (最新報價 - 平均成本(原幣)) / 平均成本(原幣) × 100%`

If FX rate not specified, use Bank of Taiwan mid-rate and note:
`[FX rate: Bank of Taiwan mid-rate as of session date — verify at rate.bot.com.tw]`

---

## STEP 6 — value_date Write-Back (MANDATORY)

```
# value_date: [YYYY-MM-DD HH:MM] (UTC+8) [auto]
# last_updated_by: investment-lens/update-quote v1.1
```

The `[auto]` tag distinguishes system-updated from user-entered timestamps.
This is the canonical record for `investment-lens` Gate 0-A freshness check.

---

## STEP 7 — Update Summary Report

```
✅ Update-Quote Complete — [YYYY-MM-DD HH:MM UTC+8]

Auto-updated (Yahoo Finance): [N] holdings
Auto-updated (CoinGecko): [N] holdings
Manual confirmation pending: [list]
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

1. **No analysis**: never output Buy/Sell/Hold or comment on price changes.
2. **No CFI reclassification**: flag suspected errors as `[CFI CHECK NEEDED: current=[X], suggest=[Y]]`.
3. **No field deletion**: never remove fields or rows from the CSV.
4. **Domestic fund NAV**: mark as `T+1 NAV`, set row `value_date` to yesterday.
5. **eToro Smart Portfolio**: never auto-fill; always prompt; note `(eToro platform — login required)`.
6. **BTC anomaly guard**: BTC as of early 2026 is in the $80,000–$100,000+ range. Always verify.

---

## Valid Invocation Examples

- `/update-quote [paste full CSV]`
- `/update-quote GOOG`
- `/update-quote USD=32.5`
- "更新報價" / "Refresh my portfolio prices"

**Out of scope — redirect:**
- "Update quotes AND tell me if I should rebalance" → update only, then: "For rebalancing, run `/investment-lens`."
- "Is the new BTC price a good entry?" → "Price updated. For analysis, use `/investment-lens BTC`."
- "Show me BTC price history for 2024" → "For historical OHLCV data, use `/alphaear-stock BTC-USD`."
