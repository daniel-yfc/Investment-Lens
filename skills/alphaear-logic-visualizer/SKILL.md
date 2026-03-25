---
name: alphaear-logic-visualizer
description: >
  Create finance logic diagrams (Draw.io XML) to explain complex investment
  transmission chains or finance logic flows. Use when the user needs a visual
  representation of a signal chain, macro linkage, or decision tree. Do NOT use
  for data fetching, quantitative modeling, or report writing — use alphaear-search
  or alphaear-reporter instead.
compatibility: Requires standard Python library only (no external packages)
allowed-tools: Read Write Bash(python*)
metadata:
  argument-hint: "[transmission chain | logic flow | Draw.io diagram]"
  version: "1.1"
  language: "zh-tw"
  last-updated: "2026-03-26"
  effort: "medium"
  user-invocable: "true"
  upstream-primary-skill: "investment-lens"
---

# AlphaEar Logic Visualizer Skill

## Overview

Create visual representations of investment logic flows by generating Draw.io XML compatible diagrams for transmission chains, macro linkages, and decision trees.

## Workflow

1. **Generate XML** — use the **Draw.io XML Generation Prompt** from `references/PROMPTS.md` to convert the logical chain into XML.
2. **Save/Render** — call `visualizer.render_drawio_to_html(xml_content, filename)` to save as a viewable HTML file.

**Example:**
```python
from scripts.visualizer import VisualizerTools
v = VisualizerTools()
v.render_drawio_to_html(xml_content="<mxGraphModel>...", filename="chain_visual.html")
```

## Gotchas

- Draw.io XML must be valid `<mxGraphModel>` structure. Malformed XML renders as a blank diagram without error. Validate structure before calling `render_drawio_to_html`.
- The output HTML file embeds the Draw.io viewer via CDN. Opening the file requires internet access or a local Draw.io desktop install.
- Node IDs in the XML must be unique strings. Duplicate IDs cause edges to attach to the wrong nodes silently.
- This skill produces **static diagrams only** — no interactive filtering or drill-down. For dynamic analysis, export to Draw.io desktop for editing.

## Dependencies

- Standard Python library only (no external packages required).
