---
name: alphaear-sentiment
description: Analyze financial text sentiment using FinBERT (local) or LLM (agentic). Use when the user needs to determine the sentiment (positive/negative/neutral) and score of financial news, earnings releases, or market commentary. Supports both high-speed batch processing via FinBERT and higher-accuracy reasoning via LLM. Do NOT use for price retrieval or quantitative modeling.
compatibility: Requires Python 3.9+, torch, transformers (for FinBERT local mode), sqlite3 (built-in), DatabaseManager initialized
---

# AlphaEar Sentiment Skill

## Overview

Sentiment analysis tailored for financial texts, supporting two modes:
- **FinBERT (local)** — high-speed, offline batch processing
- **LLM (agentic)** — higher accuracy with natural language reasoning

## Capabilities

### 1. Analyze Sentiment (FinBERT / Local)

Use `scripts/sentiment_tools.py` via `SentimentTools`.

**Key Methods:**

- `analyze_sentiment(text)`: Get sentiment score and label using localized FinBERT model.
  - **Returns**: `{'score': float, 'label': str, 'reason': str}`
  - **Score Range**: -1.0 (Negative) to 1.0 (Positive)
- `batch_update_news_sentiment(source, limit)`: Batch-process unanalyzed news items in the database (FinBERT only).

### 2. Analyze Sentiment (LLM / Agentic)

For higher accuracy or reasoning, perform analysis directly using the prompt below, then update the database if required.

#### Sentiment Analysis Prompt

```
Analyze the sentiment polarity of the following financial/news text.
Return strict JSON only:
{"score": <float: -1.0 to 1.0>, "label": "<positive|negative|neutral>", "reason": "<brief rationale>"}

Text: {text}
```

**Scoring Guide:**
- **Positive (0.1 to 1.0)**: Optimistic news, profit growth, policy support, bullish signals.
- **Negative (-1.0 to -0.1)**: Losses, sanctions, price drops, pessimistic outlook.
- **Neutral (-0.1 to 0.1)**: Factual reporting, sideways movement, ambiguous impact.

#### Helper Methods

- `update_single_news_sentiment(id, score, reason)`: Save manual LLM analysis result to the database.

## Dependencies

- `torch` (for FinBERT)
- `transformers` (for FinBERT)
- `sqlite3` (built-in)

Ensure `DatabaseManager` is initialized before calling any method.
