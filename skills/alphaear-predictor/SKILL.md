---
name: alphaear-predictor
description: >
  Market prediction skill using the Kronos time-series model. Use when the user
  needs finance market time-series forecasting or news-aware market price
  adjustments. Do NOT use for qualitative investment analysis or portfolio
  recommendations — use investment-lens instead. Requires Kronos model weights
  or internet access to download Hugging Face base checkpoint on first run.
compatibility: Requires Python 3.9+, torch, transformers, sentence-transformers, pandas, numpy, scikit-learn, DatabaseManager initialized
allowed-tools: Read Write Bash(python*)
metadata:
  argument-hint: "[ticker | forecast horizon | 'adjust forecast']"
  version: "1.1"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
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
- `sentence-transformers` is required for news-aware adjustment. If not installed, news adjustment will silently skip and return the base forecast only.

## Capabilities

### Forecast Market Trends (Agentic Workflow)

**Workflow:**
1. **Generate Base Forecast** — use `scripts/kronos_predictor.py` (`KronosPredictorUtility`) for the quantitative forecast.
2. **Adjust Forecast** — use the **Forecast Adjustment Prompt** in `references/PROMPTS.md` to adjust based on latest news/logic.

**Key method:**
- `KronosPredictorUtility.get_base_forecast(df, lookback, pred_len, news_text)` — returns `List[KLinePoint]`.

**Example:**
```python
from scripts.utils.kronos_predictor import KronosPredictorUtility

predictor = KronosPredictorUtility()
forecast = predictor.predict("600519", horizon="7d")
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
|-----------|----------|
| `kronos_news_v1.pt` found in `exports/models/` | Uses fine-tuned news-aware model |
| File not found, `KRONOS_MODEL_PATH` not set | Downloads HuggingFace base checkpoint (~500 MB) |
| Network unavailable + no local weights | Raises `ModelNotAvailableError` |

### Environment Variables

- `EMBEDDING_MODEL`: path or name of embedding model (default: `sentence-transformers/all-MiniLM-L6-v2`)
- `KRONOS_MODEL_PATH`: optional path to override model loading

## Dependencies

- `torch`, `transformers`, `sentence-transformers`, `pandas`, `numpy`, `scikit-learn`
- `DatabaseManager` must be initialised before use.
