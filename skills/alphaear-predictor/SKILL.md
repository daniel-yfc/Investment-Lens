---
name: alphaear-predictor
description: Market prediction skill using the Kronos time-series model for forecasting
  or news-aware market price adjustments.
allowed-tools:
- Read
- Write
- Bash
metadata:
  argument-hint: '[ticker | forecast horizon | ''adjust forecast'']'
  version: '1.1'
  language: zh-tw
  last-updated: '2026-04-20'
  effort: high
  user-invocable: 'true'
  upstream-primary-skill: investment-lens
  compatibility: Requires Python 3.9+, torch, transformers, sentence-transformers,
    pandas, numpy, scikit-learn, DatabaseManager initialized
---
# AlphaEar Predictor Skill

## Overview

Time-series forecasting and news-aware prediction adjustment using the Kronos model (`KronosPredictorUtility`).

## Gotchas

- **First run downloads ~500 MB from Hugging Face** (`amazon/chronos-t5-small`) if no local weights are found. Ensure internet access and sufficient disk space before invoking. On slow connections, this can take several minutes.
- `torch` installation size is 1–2 GB. Verify the environment has torch installed before use; do not attempt to install it inline.
- `ModelNotAvailableError` is raised (not logged silently) when neither local weights nor network access is available. Catch it and inform the user explicitly.
- Forecast horizon beyond 30 days has high uncertainty for financial time-series. Always state this limitation in output.
- The fine-tuned `kronos_news_v1.pt` weights are project-specific and **not included** in this repo. Contact the repository maintainer to obtain them. The HuggingFace fallback produces base forecasts without news-awareness.
- `sentence-transformers` is required for news-aware adjustment. If not installed, news adjustment will be skipped — **output must explicitly state: "News adjustment unavailable — base forecast only."** Do not silently return a base forecast without notifying the user.

## Capabilities

### Forecast Market Trends (Agentic Workflow)

**Workflow:**
1. **Retrieve price data** — use `alphaear-stock.get_stock_price()` to obtain the input DataFrame for the target ticker.
2. **Generate Base Forecast** — use `scripts/kronos_predictor.py` (`KronosPredictorUtility`) for the quantitative forecast.
3. **Adjust Forecast** — use the **Forecast Adjustment Prompt** in `references/PROMPTS.md` (section: `## Forecast Adjustment Prompt`) to adjust based on latest news/logic. If `references/PROMPTS.md` is unavailable, skip LLM adjustment and return the base forecast with a note: "Forecast Adjustment Prompt unavailable — base forecast returned."

**Key method:**
- `KronosPredictorUtility.get_base_forecast(df, lookback, pred_len, news_text)` — returns `List[KLinePoint]`.
  - `df`: price DataFrame from `alphaear-stock.get_stock_price()` (columns: date, open, high, low, close, volume)
  - `lookback`: number of historical bars to use as context (int)
  - `pred_len`: number of future bars to predict (int)
  - `news_text`: concatenated news string for news-aware adjustment (str, pass `""` if unavailable)

**Example:**
```python
from scripts.utils.kronos_predictor import KronosPredictorUtility
import alphaear_stock

# Step 1: retrieve price data via alphaear-stock
df = alphaear_stock.get_stock_price("600519", period="3mo")

# Step 2: generate base forecast
predictor = KronosPredictorUtility()
forecast = predictor.get_base_forecast(df, lookback=60, pred_len=7, news_text="")
print(forecast)
```

## Configuration

### Kronos Model
- Place trained weights (e.g., `kronos_news_v1.pt`) in `exports/models/`.
- **Source**: Project-specific fine-tuned weights — contact repository maintainer.
- **Fallback**: Downloads `amazon/chronos-t5-small` from Hugging Face on first run if no custom weights found.
- Set `KRONOS_MODEL_PATH` to override model loading path.

### Fallback Behaviour

| Condition | Behaviour |
|-----------|-----------|
| `kronos_news_v1.pt` found in `exports/models/` | Uses fine-tuned news-aware model |
| File not found, `KRONOS_MODEL_PATH` not set | Downloads HuggingFace base checkpoint (~500 MB) |
| Network unavailable + no local weights | Raises `ModelNotAvailableError` |

### Environment Variables
- `EMBEDDING_MODEL`: path or name of embedding model (default: `sentence-transformers/all-MiniLM-L6-v2`)
- `KRONOS_MODEL_PATH`: optional path to override model loading

## Dependencies
- `torch`, `transformers`, `sentence-transformers`, `pandas`, `numpy`, `scikit-learn`
- `DatabaseManager` must be initialised before use.
