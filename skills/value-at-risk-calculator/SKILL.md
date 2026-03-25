---
name: value-at-risk-calculator
description: Calculate Value at Risk (VaR) and related risk metrics for financial and operational risk assessment. Use when the user requires historical simulation VaR, parametric VaR, Monte Carlo VaR, CVaR/Expected Shortfall, stress testing, or backtesting. Do NOT use for qualitative investment interpretation or portfolio rebalancing advice — use investment-lens or quant-analysis instead.
compatibility: Requires Python 3.9+, scipy, numpy, arch, riskfolio-lib
allowed-tools: Read Write Glob Grep Bash
metadata:
  specialization: decision-intelligence
  domain: business
  category: risk
  priority: medium
  tools-libraries: "scipy.stats, numpy, arch, riskfolio-lib"
---

# Value at Risk Calculator

## Overview

Comprehensive VaR and related risk metrics using multiple methodologies: parametric, historical simulation, and Monte Carlo. Supports stress testing, backtesting, and regulatory reporting (Basel III/IV).

## Capabilities

- Historical simulation VaR
- Parametric VaR (variance-covariance)
- Monte Carlo VaR
- Conditional VaR (CVaR / Expected Shortfall)
- Incremental and component VaR
- Stress testing
- Backtesting and validation
- Regulatory reporting support

## Used By Processes

- Monte Carlo Simulation for Decision Support
- Risk Assessment
- Decision Quality Assessment

## Usage

### Historical Simulation VaR

```python
historical_var_config = {
    "method": "historical_simulation",
    "data": {
        "returns": portfolio_returns,  # historical return series
        "period": "daily",
        "history_length": 252          # 1 year of trading days
    },
    "confidence_levels": [0.95, 0.99],
    "holding_period": 1,
    "options": {
        "age_weighting": {"enabled": True, "decay_factor": 0.97}
    }
}
```

### Parametric VaR

```python
parametric_var_config = {
    "method": "parametric",
    "portfolio": {
        "positions": {
            "Asset_A": {"value": 1000000, "weight": 0.4},
            "Asset_B": {"value": 750000,  "weight": 0.3},
            "Asset_C": {"value": 750000,  "weight": 0.3}
        }
    },
    "parameters": {
        "volatilities": {"Asset_A": 0.20, "Asset_B": 0.15, "Asset_C": 0.25},
        "correlation_matrix": [
            [1.0, 0.3, 0.2],
            [0.3, 1.0, 0.5],
            [0.2, 0.5, 1.0]
        ]
    },
    "confidence_level": 0.99,
    "holding_period": 10
}
```

### Monte Carlo VaR

```python
monte_carlo_var_config = {
    "method": "monte_carlo",
    "simulations": 100000,
    "model": {
        "type": "geometric_brownian_motion",
        "parameters": {"drift": "historical", "volatility": "garch"}
    },
    "portfolio_valuation": "full_revaluation",
    "confidence_levels": [0.95, 0.99],
    "holding_period": 10
}
```

### Conditional VaR (Expected Shortfall)

CVaR represents the expected loss given that VaR is exceeded:
- CVaR at 95% = average loss in the worst 5% of scenarios
- Required by Basel III/IV for market risk capital
- More coherent risk measure than VaR

### Stress Testing

```python
stress_tests = {
    "scenarios": [
        {"name": "2008 Financial Crisis",  "shocks": {"equity": -0.40, "credit_spreads": 0.03, "rates": -0.02}},
        {"name": "COVID-19 March 2020",    "shocks": {"equity": -0.30, "volatility": 0.50,  "credit_spreads": 0.02}},
        {"name": "Interest Rate Spike",    "shocks": {"rates": 0.03,  "equity": -0.15}}
    ],
    "output": ["portfolio_loss", "position_contributions"]
}
```

## Input Schema

```json
{
  "method": "historical|parametric|monte_carlo",
  "portfolio": {"positions": "object", "total_value": "number"},
  "data": {"returns": "array or path", "period": "string"},
  "parameters": {
    "confidence_levels": ["number"],
    "holding_period": "number",
    "volatility_model": "string"
  },
  "stress_testing": {"scenarios": ["object"]},
  "backtesting": {"enabled": "boolean", "test_period": "string"}
}
```

## Output Schema

```json
{
  "var_results": {
    "confidence_level": {
      "VaR": "number", "VaR_percent": "number",
      "CVaR": "number", "CVaR_percent": "number"
    }
  },
  "component_var": {
    "position": {
      "marginal_var": "number", "component_var": "number",
      "contribution_percent": "number"
    }
  },
  "stress_test_results": {
    "scenario_name": {"portfolio_loss": "number", "loss_percent": "number"}
  },
  "backtesting": {
    "exceptions": "number", "exception_rate": "number",
    "traffic_light": "green|yellow|red",
    "kupiec_test": "object", "christoffersen_test": "object"
  },
  "risk_attribution": "object"
}
```

## Best Practices

1. Use multiple methods and compare results
2. Validate with backtesting regularly
3. Include fat tails (t-distribution or historical) for parametric VaR
4. Update volatility and correlation parameters frequently
5. Complement VaR with stress testing
6. Report CVaR alongside VaR for tail risk
7. Document all assumptions and limitations

## VaR Interpretation

| Metric | Meaning |
|--------|---------|
| VaR 95% = $1M | 95% confident loss won't exceed $1M |
| CVaR 95% = $1.5M | If loss exceeds VaR, average loss is $1.5M |
| Incremental VaR | Change in portfolio VaR from adding a position |
| Component VaR | Position's contribution to total portfolio VaR |

## Backtesting Standards (Basel Traffic Light — 250 trading days)

| Exceptions | Zone | Interpretation |
|-----------|------|----------------|
| 0–4 | Green | Model acceptable |
| 5–9 | Yellow | Model may have issues |
| 10+ | Red | Model needs review |

## Integration Points

- Receives simulations from Monte Carlo Engine
- Connects with Risk Register Manager for risk assessment
- Supports Risk Analyst agent
- Integrates with Decision Visualization for risk charts
