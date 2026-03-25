# investment-lens — Scripts Index

> All scripts live under `skills/investment-lens/scripts/`.
> Run with: `uv run scripts/<file>.py [options]` or `python scripts/<file>.py [options]`
> from the skill root directory.
>
> Scripts use relative imports. Set `PYTHONPATH=skills/investment-lens` if running
> from outside the skill directory.

---

## Entry Points

### `fin_agent.py`
Main pipeline library. Provides `FinUtils` class for signal output sanitisation.

**Class:** `FinUtils(db: DatabaseManager)`

| Method | Description |
|--------|-------------|
| `sanitize_signal_output(json_data, research_data, raw_signal)` | Post-processes LLM `InvestmentSignal` output; strips hallucinated tickers not verified in local DB |

**Usage (from Python):**
```python
from scripts.fin_agent import FinUtils
from scripts.utils.database_manager import DatabaseManager

db = DatabaseManager()
utils = FinUtils(db)
cleaned = utils.sanitize_signal_output(signal_json, research_data, raw_signal_text)
```

**Gotcha:** Requires local DB to be populated. If DB is empty, all `impact_tickers` will be stripped.

---

## Prompts (`scripts/prompts/`)

| File | Prompt Class | Role |
|------|-------------|------|
| `fin_agent.py` | `FinAgentPrompts` | System prompts for FinResearcher + FinAnalyst |
| `intent_agent.py` | `IntentAgentPrompts` | Intent classification prompts |
| `isq_prompt_generator.py` | `ISQPromptGenerator` | Generates ISQ-structured analysis prompts |
| `report_agent.py` | `ReportAgentPrompts` | Report generation prompts |
| `trend_agent.py` | `TrendAgentPrompts` | Trend tracking prompts |
| `forecast_analyst.py` | `ForecastAnalystPrompts` | Price forecast prompts |
| `visualizer.py` | `VisualizerPrompts` | Chart/visual description prompts |

---

## Schema (`scripts/schema/`)

| File | Contents |
|------|----------|
| `isq_template.py` | `InvestmentSignal` Pydantic model — canonical ISQ JSON schema |
| `models.py` | Supporting data models (ticker, transmission chain, etc.) |

---

## Tools (`scripts/tools/`)

| File | Contents |
|------|----------|
| `toolkits.py` | Tool registry: price lookup, news fetch, web search, DB query |

---

## Utils (`scripts/utils/`)

| File | Contents |
|------|----------|
| `database_manager.py` | Local signal DB read/write (SQLite) |
| `hybrid_search.py` | Combined local DB + web search |
| `content_extractor.py` | Extract structured content from web pages |
| `news_tools.py` | News fetch utilities (mirrors alphaear-news) |
| `json_utils.py` | JSON parsing, validation, cleaning |
| `logging_setup.py` | Loguru configuration |
| `md_to_html.py` | Markdown to HTML renderer |
| `llm/factory.py` | LLM client factory (OpenAI, Anthropic, etc.) |
| `llm/router.py` | Model capability routing |
| `llm/capability.py` | Model capability registry |
| `predictor/kline_generate.py` | K-line (OHLCV) data generation for Kronos input |
| `predictor/evaluation.py` | Forecast evaluation metrics |
| `predictor/model/kronos.py` | Kronos time-series forecasting model |
| `predictor/model/module.py` | Kronos model modules (encoder, decoder, attention) |

---

## Dependencies

Key packages required (declare via PEP 723 in individual scripts when running standalone):

```
loguru
pydantic
torch (for predictor/)
pandas
numpy
requests
openai (or anthropic)
```

For standalone script execution with automatic dependency resolution:
```bash
uv run scripts/fin_agent.py
```
