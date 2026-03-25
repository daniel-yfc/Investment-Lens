---
name: alphaear-logic-visualizer
description: >
  Create finance logic diagrams (Draw.io XML) to explain complex investment
  transmission chains or finance logic flows. Use when the user needs a visual
  representation of a signal chain, macro linkage, or decision tree. Do NOT use
  for data fetching, quantitative modeling, or report writing — use alphaear-search
  or alphaear-reporter instead.
compatibility: Requires standard Python library only (no external packages)
allowed-tools: Read Write Bash(python *)
metadata:
  argument-hint: "[transmission chain | logic flow | Draw.io diagram]"
  version: "1.0"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "medium"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
---

# AlphaEar Logic Visualizer Skill

## Overview

Create visual representations of investment logic flows by generating Draw.io XML compatible diagrams for transmission chains, macro linkages, and decision trees.

## Capabilities

### 1. Generate Draw.io Diagrams (Agentic Workflow)

Use the prompts in `references/PROMPTS.md` to generate the XML, then render via `scripts/visualizer.py`.

**Workflow:**
1. **Generate XML**: Use the **Draw.io XML Generation Prompt** from `references/PROMPTS.md` to convert the logical chain into XML.
2. **Save/Render**: Call `visualizer.render_drawio_to_html(xml_content, filename)` to save the XML as a viewable HTML file.

**Example:**
```python
from scripts.visualizer import VisualizerTools
v = VisualizerTools()
v.render_drawio_to_html(xml_content="<mxGraphModel>...", filename="chain_visual.html")
```

## Dependencies

- Standard Python library only (no external packages required).
