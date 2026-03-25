---
name: alphaear-search
description: >
  Web search and local RAG retrieval for finance context. Use when the user
  needs to search the web for finance information (DuckDuckGo or Jina reader)
  OR retrieve previously fetched finance content from the local document store
  (engine='local'). The local engine queries content already ingested by
  alphaear-news — it does NOT fetch new content from the internet.
  Do NOT use for structured stock price data (use alphaear-stock) or for
  fetching new live news (use alphaear-news to ingest first, then
  engine='local' here to retrieve). Do NOT use Baidu engine — removed.
compatibility: Requires duckduckgo-search, requests, scripts/database_manager.py, scripts/hybrid_search.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[search query | 'local: ...' | engine: jina | ddg | local]"
  version: "2.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar Search Skill

## Purpose

Two distinct functions under one skill:

| Mode | Engine | Data source | Use when |
|------|--------|-------------|----------|
| Web search | `jina` or `ddg` | Live internet | Need current finance information from the web |
| Local retrieval | `local` | `daily_news` SQLite DB | Need to query content already ingested by `alphaear-news` |

**Critical distinction:**
- `engine='local'` is a **read-only query** against the local DB. It only returns
  content that `alphaear-news` has already fetched and stored. If the DB is empty
  or stale, run `alphaear-news` first.
- Web engines (`jina`, `ddg`) fetch **live internet content** and do not write to
  the local DB.

## Do Not Use

- For structured OHLCV price data → use `alphaear-stock`.
- For fetching new live news and storing it → use `alphaear-news`.
- For Baidu search → removed; not supported.

## Capabilities

Use `scripts/search_tools.py` via `SearchTools`:

- `search(query, engine, max_results)` — returns JSON summary string.
  - `engine`: `'jina'` | `'ddg'` | `'local'`
- `search_list(query, engine, max_results)` — returns `List[Dict]`.
- `aggregate_search(query)` — combines `jina` + `ddg` results (web only).

For local retrieval only:
- `scripts/hybrid_search.py` — BM25 + semantic hybrid search over `daily_news` DB.

## Smart Cache (web engines)

Before fetching live, check if a recent cached result is reusable.
Use the **Search Cache Relevance Prompt** in `references/PROMPTS.md`.

## Dependencies

- `duckduckgo-search`, `requests`
- `scripts/database_manager.py` — search cache + `daily_news` DB access
- `scripts/hybrid_search.py` — local BM25/semantic retrieval
