---
name: alphaear-predictor
description: Market prediction skill using Kronos. Use when user needs finance market time-series forecasting or news-aware finance market adjustments.
---

# AlphaEar Predictor Skill

## Overview

This skill utilizes the Kronos model (via `KronosPredictorUtility`) to perform time-series forecasting and adjust predictions based on news sentiment.

## Capabilities

### 1. Forecast Market Trends (Agentic Workflow)

**Workflow:**
1.  **Generate Base Forecast**: Use `scripts/kronos_predictor.py` (via `KronosPredictorUtility`) to generate the technical/quantitative forecast.
2.  **Adjust Forecast (Agentic)**: Use the **Forecast Adjustment Prompt** in `references/PROMPTS.md` to subjectively adjust the numbers based on latest news/logic.

**Key Tools:**
-   `KronosPredictorUtility.get_base_forecast(df, lookback, pred_len, news_text)`: Returns `List[KLinePoint]`.

**Example Usage (Python):**

```python
from scripts.utils.kronos_predictor import KronosPredictorUtility
from scripts.utils.database_manager import DatabaseManager

db = DatabaseManager()
predictor = KronosPredictorUtility()

# Forecast
forecast = predictor.predict("600519", horizon="7d")
print(forecast)
```


## Configuration

This skill requires the **Kronos** model and an embedding model.

### 1. Kronos Model

-   Ensure `exports/models` directory exists in the project root.
-   Place trained news projector weights (e.g., `kronos_news_v1.pt`) in `exports/models/`.
    -   **Source**: Fine-tuned weights are project-specific and must be trained or provided separately. Contact the repository maintainer for pre-trained weights.
    -   **Base model**: If no custom weights are provided, the skill falls back to the Hugging Face base Kronos checkpoint (`amazon/chronos-t5-small` or equivalent) which will be downloaded automatically on first run.
-   Set `KRONOS_MODEL_PATH` environment variable to point to a custom checkpoint if needed.

### 2. Fallback Behaviour

| Condition | Behaviour |
|-----------|----------|
| `kronos_news_v1.pt` found in `exports/models/` | Uses fine-tuned news-aware model |
| File not found, `KRONOS_MODEL_PATH` not set | Downloads and uses Hugging Face base checkpoint |
| Network unavailable + no local weights | Raises `ModelNotAvailableError`; agent should inform user and suggest providing historical data for simpler statistical fallback |

### 3. Environment Variables

-   `EMBEDDING_MODEL`: Path or name of the embedding model (default: `sentence-transformers/all-MiniLM-L6-v2`).
-   `KRONOS_MODEL_PATH`: Optional path to override model loading.

## Dependencies

-   `torch`
-   `transformers`
-   `sentence-transformers`
-   `pandas`
-   `numpy`
-   `scikit-learn`
