---
name: alphaear-deepear-lite
description: >
  Fetch the latest financial signals and transmission-chain analyses from DeepEar Lite.
  Use when the user needs immediate insights into financial market trends, stock
  performance factors, and reasoning from the DeepEar Lite dashboard. Do NOT use
  for sentiment scoring, quantitative modeling, or portfolio analysis — use
  alphaear-sentiment or investment-lens instead.
compatibility: Requires requests, loguru, internet access to https://deepear.vercel.app
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[signal fetch | market trend | DeepEar]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# DeepEar Lite Skill

## Overview

Fetch high-frequency financial signals — titles, summaries, confidence scores, and reasoning — directly from the DeepEar Lite platform's real-time data source.

## Capabilities

### 1. Fetch Latest Financial Signals

Use `scripts/deepear_lite.py` via `DeepEarLiteTools`.

- `fetch_latest_signals()`: Retrieves all latest signals from `https://deepear.vercel.app/latest.json`.
  - Returns a formatted report of signal titles, sentiment/confidence metrics, summaries, and source links.

## Dependencies

- `requests`, `loguru`
- No local database required.

## Testing

```bash
python scripts/deepear_lite.py
```
