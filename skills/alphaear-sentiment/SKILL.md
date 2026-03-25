---
name: alphaear-sentiment
description: >
  Analyze financial text sentiment using FinBERT (local) or LLM (agentic). Use when
  the user needs to determine the sentiment (positive/negative/neutral) and score of
  financial news, earnings releases, or market commentary. Supports both high-speed
  batch processing via FinBERT and higher-accuracy reasoning via LLM. Do NOT use for
  price retrieval or quantitative modeling — use alphaear-stock or quant-analysis instead.
compatibility: Requires Python 3.9+, torch, transformers (for FinBERT local mode), sqlite3 (built-in), DatabaseManager initialized
allowed-tools: Read Bash(python*)
metadata:
  argument-hint: "[financial text | news item | batch sentiment]"
  version: "1.1"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "medium"
  user-invocable: "true"
---

# AlphaEar Sentiment Skill

## Overview

Sentiment analysis tailored for financial texts, supporting two modes:
- **FinBERT (local)** — high-speed, offline batch processing
- **LLM (agentic)** — higher accuracy with natural language reasoning

## Gotchas

- **FinBERT requires GPU for acceptable batch throughput.** On CPU only, processing 100 items takes ~60–120 s. If latency is unacceptable, switch to LLM mode or reduce batch size.
- FinBERT is fine-tuned on English financial text. Non-English input (Traditional Chinese, Japanese, etc.) will produce unreliable scores — use LLM mode for non-English.
- `DatabaseManager` must be initialised before any method call. If not initialised, all DB-writing methods raise `RuntimeError` silently and return `None`. Check init status first.
- `batch_update_news_sentiment` skips items that already have a sentiment score. If you want to re-score, clear the existing `sentiment_score` column first.
- Score range is -1.0 to 1.0. The neutral band (-0.1 to 0.1) is wider than typical ML classifiers — do not interpret 0.05 as meaningfully positive.

## Capabilities

### 1. Analyze Sentiment (FinBERT / Local)

Use `scripts/sentiment_tools.py` via `SentimentTools`:

- `analyze_sentiment(text)` — returns `{'score': float, 'label': str, 'reason': str}`
  - Score range: -1.0 (Negative) to 1.0 (Positive)
- `batch_update_news_sentiment(source, limit)` — batch-process unanalyzed news in DB.

### 2. Analyze Sentiment (LLM / Agentic)

For non-English text or higher accuracy, use the prompt below directly, then update DB if required.

#### Sentiment Analysis Prompt

```
Analyze the sentiment polarity of the following financial/news text.
Return strict JSON only:
{"score": <float: -1.0 to 1.0>, "label": "<positive|negative|neutral>", "reason": "<brief rationale>"}

Text: {text}
```

**Scoring guide:**
- Positive (0.1–1.0): optimistic news, profit growth, policy support, bullish signals
- Negative (-1.0–-0.1): losses, sanctions, price drops, pessimistic outlook
- Neutral (-0.1–0.1): factual reporting, sideways movement, ambiguous impact

#### Helper Methods

- `update_single_news_sentiment(id, score, reason)` — save manual LLM result to DB.

## Dependencies

- `torch`, `transformers` (for FinBERT)
- `sqlite3` (built-in)
- `DatabaseManager` must be initialised before any call.
