---
name: alphaear-predictor
description: >
  Market prediction skill using the Kronos time-series model. Use when the user
  needs finance market time-series forecasting or news-aware market price
  adjustments. Do NOT use for qualitative investment analysis or portfolio
  recommendations — use investment-lens instead. Requires Kronos model weights
  or internet access to download Hugging Face base checkpoint on first run.
compatibility: Requires Python 3.9+, torch, transformers, sentence-transformers, pandas, numpy, scikit-learn, DatabaseManager initialized
allowed-tools: Read Write Bash(python *)
metadata:
  argument-hint: "[ticker | forecast horizon | 'adjust forecast']"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "high"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
---

# AlphaEar Predictor Skill

## Overview

Time-series forecasting and news-aware prediction adjustment using the Kronos model (`KronosPredictorUtility`).

## Capabilities

### 1. Forecast Market Trends (Agentic Workflow)

**Workflow:**
1. **Generate Base Forecast**: Use `scripts/kronos_predictor.py` (`KronosPredictorUtility`) for the technical/quantitative forecast.
2. **Adjust Forecast**: Use the **Forecast Adjustment Prompt** in `references/PROMPTS.md` to adjust based on latest news/logic.

**Key method:**
- `KronosPredictorUtility.get_base_forecast(df, lookback, pred_len, news_text)` — Returns `List[KLinePoint]`.

**Example:**
```python
from scripts.utils.kronos_predictor import KronosPredictorUtility
from scripts.utils.database_manager import DatabaseManager

db = DatabaseManager()
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
| File not found, `KRONOS_MODEL_PATH` not set | Downloads HuggingFace base checkpoint |
| Network unavailable + no local weights | Raises `ModelNotAvailableError`; prompt user to provide data for statistical fallback |

### Environment Variables

- `EMBEDDING_MODEL`: Path or name of embedding model (default: `sentence-transformers/all-MiniLM-L6-v2`)
- `KRONOS_MODEL_PATH`: Optional path to override model loading

## Dependencies

- `torch`, `transformers`, `sentence-transformers`, `pandas`, `numpy`, `scikit-learn`
