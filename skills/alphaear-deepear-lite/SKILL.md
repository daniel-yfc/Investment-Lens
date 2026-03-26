---
name: alphaear-deepear-lite
description: Fetch the latest financial signals and transmission-chain analyses from
  DeepEar Lite.
allowed-tools:
- Read
- Bash
metadata:
  argument-hint: '[signal fetch | market trend | DeepEar]'
  version: '1.1'
  language: zh-tw
  last-updated: '2026-03-26'
  effort: low
  user-invocable: 'true'
  compatibility: Requires requests, loguru, internet access to https://deepear.vercel.app
---

# DeepEar Lite Skill

## Overview

Fetch high-frequency financial signals — titles, summaries, confidence scores, and reasoning — directly from the DeepEar Lite platform’s real-time data source.

## Capabilities

### Fetch Latest Financial Signals

Use `scripts/deepear_lite.py` via `DeepEarLiteTools`:

- `fetch_latest_signals()` — retrieves all latest signals from `https://deepear.vercel.app/latest.json`.
  Returns a formatted report of signal titles, sentiment/confidence metrics, summaries, and source links.

**Example:**
```python
from scripts.deepear_lite import DeepEarLiteTools
tools = DeepEarLiteTools()
result = tools.fetch_latest_signals()
print(result)
```

## Gotchas

- `deepear.vercel.app` is an external endpoint. If the server is unreachable or returns non-200, fail gracefully and inform the user rather than retrying silently.
- Signal confidence scores are unitless floats (0.0–1.0). Do not conflate them with probability or statistical significance — they reflect the platform’s proprietary model.
- This skill is **read-only** — it does not write to any local DB. Downstream analysis still requires `investment-lens` or `alphaear-sentiment`.
- No local caching. Repeated calls hit the remote endpoint each time.

## Dependencies

- `requests`, `loguru`
- No local database required.

## Testing

```bash
python scripts/deepear_lite.py
```
