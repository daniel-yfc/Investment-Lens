---
name: alphaear-search
description: >
  Perform finance web searches and local context searches. Use when the user needs
  general finance information from the web (Jina/DDG/Baidu) or needs to retrieve
  finance information from a local document store (RAG). Do NOT use for structured
  stock price data — use alphaear-stock instead. Baidu engine is optional and
  disabled by default (set DISABLE_BAIDU=0 to enable).
compatibility: Requires duckduckgo-search, requests, scripts/database_manager.py, scripts/hybrid_search.py
allowed-tools: Read Bash(python *)
metadata:
  argument-hint: "[search query | 'local:...' | engine:jina|ddg|baidu]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "low"
  user-invocable: "true"
---

# AlphaEar Search Skill

## Overview

Unified search: web search (Jina/DDG/Baidu) and local RAG search.

## Capabilities

### 1. Web Search

Use `scripts/search_tools.py` via `SearchTools`.

- `search(query, engine, max_results)`: Search the web.
  - Engines: `jina`, `ddg`, `baidu` (optional, disabled by default), `local`.
  - Returns: JSON string (summary) or `List[Dict]` (via `search_list`).
- `aggregate_search(query)`: Combines results from multiple engines.
- **Smart Cache (Agentic)**: Use the **Search Cache Relevance Prompt** in `references/PROMPTS.md` to decide if cached results are reusable before fetching.

### 2. Local RAG

Use `scripts/hybrid_search.py` or `SearchTools` with `engine='local'`.

- Searches local `daily_news` database for previously fetched finance content.

## Dependencies

- `duckduckgo-search`, `requests`
- `scripts/database_manager.py` (search cache & local news)
