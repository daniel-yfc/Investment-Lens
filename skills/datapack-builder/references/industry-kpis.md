# Datapack Builder — Industry-Specific KPIs

Load this file when the target company operates in one of the industries below.
Select the relevant section; skip others to conserve context.

---

## Technology / SaaS

**Key metrics to capture:**
- ARR (Annual Recurring Revenue) and MRR
- Customer count by cohort
- CAC (Customer Acquisition Cost) and LTV (Lifetime Value)
- Churn rate (gross and net)
- Net revenue retention
- Rule of 40 (Growth % + EBITDA Margin %)
- Magic number (sales efficiency)

**Format notes:**
- ARR/MRR → currency (`$`)
- Customer count → number format (no `$`)
- Churn, retention, Rule of 40 components → `%`

---

## Manufacturing / Industrial

**Key metrics to capture:**
- Production capacity and capacity utilization %
- Units produced by product line
- Inventory turns
- Gross margin by product line
- Order backlog

**Format notes:**
- Units, capacity → number format (no `$`)
- Utilization → `%`
- Revenue, costs, backlog value → currency (`$`)

---

## Real Estate / Hospitality

**Key metrics to capture:**
- Properties / rooms / square footage
- Occupancy rates %
- ADR (Average Daily Rate) — currency
- RevPAR (Revenue per Available Room) — currency
- NOI (Net Operating Income) — currency
- Cap rates %
- FF&E reserve

**Format notes:**
- Rooms, sqft → number format (no `$`)
- Occupancy, cap rates → `%`
- ADR, RevPAR, NOI → currency (`$`)

---

## Healthcare / Services

**Key metrics to capture:**
- Locations / facilities
- Providers / employees
- Patients / visits (volume metrics)
- Revenue per visit — currency
- Payor mix %
- Same-store growth %

**Format notes:**
- Locations, visits, headcount → number format (no `$`)
- Revenue per visit → currency (`$`)
- Payor mix, same-store growth → `%`

---

## Format Rule Reminder

When context is mixed, each metric gets its own appropriate format:

```
Segment Analysis    2022      2023      2024
Retail Revenue     $50.0     $55.0     $60.0
  Stores             100       110       120
  Revenue/Store      $0.5      $0.5      $0.5
```

Revenue and per-store metrics use `$`; store count uses number format.
