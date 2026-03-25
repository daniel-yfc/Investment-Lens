# Datapack Builder — Excel Formula Patterns

Correct patterns and common mistakes for building formula-based Excel models via the xlsx skill.

---

## Row Reference Tracking — Copy This Pattern

Store row numbers when writing data, then reference them in formulas.

```python
# ✅ CORRECT — Track row numbers as you write
revenue_row = row
write_data_row(ws, row, "Revenue", revenue_values)
row += 1

ebitda_row = row
write_data_row(ws, row, "EBITDA", ebitda_values)
row += 1

# Use stored row numbers in formulas
margin_row = row
for col in year_columns:
    cell = ws.cell(row=margin_row, column=col)
    cell.value = f"={get_column_letter(col)}{ebitda_row}/{get_column_letter(col)}{revenue_row}"
```

For complex models, use a dictionary:

```python
row_refs = {
    'revenue': 5,
    'cogs': 6,
    'gross_profit': 7,
    'ebitda': 12
}

# Later in formulas
margin_formula = f"=B{row_refs['ebitda']}/B{row_refs['revenue']}"
```

---

## Common Mistakes — WRONG: Hardcoded Row Offsets

Don't use relative offsets — they break when table structure changes.

```python
# ❌ WRONG — Fragile offset-based references
formula = f"=B{row-15}/B{row-19}"  # What is row-15? What is row-19?

# ❌ WRONG — Magic numbers
formula = f"=B{current_row-10}*C{current_row-20}"
```

**Why this fails:**
- Breaks silently when you add/remove rows.
- Impossible to verify correctness by reading code.
- Creates debugging nightmares in the delivered Excel file.

---

## Formatting Application Order

1. Set column widths first.
2. Write all data rows (tracking row numbers).
3. Apply number formats per data type.
4. Apply font colors (blue for hardcoded inputs, black for formulas, green for cross-sheet links).
5. Apply underlines (single above subtotals, double below final totals).
6. Freeze panes last (freeze at row 2, column 2 for most tabs).

---

## Negative Number Formatting

| Data type | Correct | Incorrect |
|-----------|---------|-----------|
| Financial | `$(15.0)` | `-$15.0` |
| Operational | `(15)` | `-15` |
| Percentage | `(15.0%)` | `-15.0%` |

Use accounting format `_($* #,##0.0_);_($* (#,##0.0)` for financial data.
