# Model Selection Guide

## Purpose

This reference helps the agent decide which quantitative model or method is appropriate
given the user's analytical objective. Read this file when the task requires quantitative
analysis but the model type is not explicitly specified.

---

## Decision Tree

### Step 1 — What is the primary objective?

| Objective | Go to |
|-----------|-------|
| Understand portfolio risk and drawdown | Risk Analysis (Mode A) |
| Find the optimal asset mix | Optimization (Mode B) |
| Understand factor drivers of return | Statistical Modeling (Mode C) |
| Test a strategy on historical data | Simulation / Backtesting (Mode D) |
| Forecast or project forward scenarios | Simulation (Mode D) + caveat |

---

## Mode A — Risk Analysis

**Use when**: The user wants to understand how risky the portfolio is, how much it
could lose, or how it behaved during stress periods.

### VaR (Value at Risk)

- **When**: User wants a threshold loss estimate at a given confidence level.
- **Confidence levels**: 95% for internal monitoring; 99% for regulatory-style reporting.
- **Lookback**: Minimum 1 year of daily returns; 3–5 years preferred.
- **Method options**:
  - Historical simulation: no distributional assumption; preferred for fat-tailed assets.
  - Parametric (variance-covariance): assumes normality; underestimates tail risk.
  - Monte Carlo: best for non-linear positions or options.
- **Limitation**: VaR says nothing about losses beyond the threshold. Always pair with CVaR.

### CVaR (Conditional VaR / Expected Shortfall)

- **When**: User wants to know the average loss in the worst-case tail.
- **Preferred over VaR** when assets are non-normal (equities, crypto, structured products).
- **Standard**: ES at 97.5% is equivalent in spirit to VaR at 99% under Basel III.

### Drawdown Analysis

- **When**: User wants to understand maximum peak-to-trough loss, recovery time, or
  sequence-of-return risk.
- **Key metrics**: Maximum drawdown, average drawdown, recovery period, Calmar ratio.
- **Particularly useful for**: Retirement portfolios where sequence risk matters.

### Correlation and Concentration

- **When**: User wants to understand diversification quality.
- **Output**: Correlation matrix, pairwise rolling correlation, HHI (Herfindahl-Hirschman Index).
- **Warning**: Correlations spike during crises. Historical average correlation understates
  crisis-period correlation. Flag this explicitly.

---

## Mode B — Optimization

**Use when**: The user wants to find an optimal asset allocation given return expectations
and risk constraints.

### Mean-Variance Optimization (MVO)

- **When**: User provides or accepts expected return assumptions and wants an efficient frontier.
- **Limitation**: Highly sensitive to expected return inputs. Small changes in inputs
  produce dramatically different portfolios (error maximization problem).
- **Best practice**: Run sensitivity analysis across multiple return scenarios; never
  present a single optimized portfolio as "the answer".
- **Required inputs**: Expected returns, covariance matrix, constraints.

### Black-Litterman

- **When**: User has specific views on certain assets and wants to blend them with
  market-implied equilibrium returns.
- **More stable than MVO**: Starts from market weights as prior; views tilt the portfolio.
- **Required inputs**: Market cap weights, risk aversion parameter, user views with
  confidence levels.

### Risk Parity / Equal Risk Contribution (ERC)

- **When**: User wants each asset to contribute equally to portfolio risk, regardless
  of return expectations.
- **Advantage**: Does not require expected return forecasts; robust to estimation error.
- **Common use**: All-Seasons / All-Weather style portfolios.
- **Required inputs**: Asset returns (for covariance estimation), target risk contribution.

### Constraint-Aware Optimization

- **When**: User has real-world constraints (max weight, sector limits, ESG screens,
  no leverage, etc.).
- **Method**: Constrained MVO or constrained ERC via quadratic programming.
- **Always document all constraints explicitly** before reporting results.

---

## Mode C — Statistical Modeling

**Use when**: User wants to understand what drives returns, test a hypothesis, or
validate a qualitative thesis with data.

### Factor Analysis / OLS Regression

- **When**: User wants to decompose returns into factor exposures (market, size, value,
  momentum, quality, etc.).
- **Typical factors**: Fama-French 3-factor, Carhart 4-factor, Fama-French 5-factor.
- **Taiwan market**: TWSE-specific factor data is less standardized; flag data quality.
- **Output**: Factor loadings (betas), R-squared, alpha (intercept).

### Rolling Regression

- **When**: User wants to see how factor exposures change over time.
- **Typical window**: 36–60 months.
- **Useful for**: Detecting style drift, identifying regime changes in a fund or stock.

### GARCH-Family Volatility Models

- **When**: User wants to model time-varying volatility or forecast short-term vol.
- **GARCH(1,1)**: Standard starting point for equity return volatility.
- **EGARCH / GJR-GARCH**: When asymmetric volatility (leverage effect) is expected.
- **Limitation**: Volatility forecasts degrade quickly beyond 1–2 weeks.

### Event Study

- **When**: User wants to measure abnormal returns around a specific event (earnings,
  M&A announcement, macro event).
- **Method**: Estimate normal returns using a market model; compute cumulative abnormal
  return (CAR) around the event window.

---

## Mode D — Simulation and Backtesting

**Use when**: User wants to project future outcomes or test strategy performance
on historical data.

### Monte Carlo Simulation

- **When**: User wants a distribution of possible outcomes rather than a single path.
- **Common uses**: Retirement projection, probability of ruin analysis, option pricing.
- **Required inputs**: Return distribution parameters (mean, volatility), time horizon,
  correlation structure.
- **Always state**: Number of simulations run, distributional assumptions, whether
  correlations are constant or time-varying.

### Historical Backtesting

- **When**: User wants to see how a strategy would have performed using historical data.
- **Mandatory caveats**:
  - Survivorship bias: data may exclude delisted securities.
  - Look-ahead bias: ensure signals use only information available at each point in time.
  - Overfitting: strategies tested and optimized on the same data will overfit.
  - Transaction costs: always include realistic cost assumptions.
- **Preferred output**: Equity curve, Sharpe ratio, maximum drawdown, Calmar ratio,
  win rate, average win/loss ratio.

---

## Risk-Free Rate Defaults

| Base Currency | Default Risk-Free Proxy |
|---------------|-------------------------|
| TWD | Taiwan 1-year government bond yield |
| USD | US 3-month T-bill yield |
| EUR | ECB deposit facility rate |
| HKD | HIBOR 3-month |

Always state the risk-free rate used and its source date.

---

## Lookback Period Guidelines

| Purpose | Minimum | Preferred | Rationale |
|---------|---------|-----------|----------|
| VaR / CVaR | 1 year daily | 3–5 years daily | Capture at least one correction cycle |
| MVO | 3 years monthly | 5–10 years monthly | Stable covariance estimate |
| Factor regression | 3 years monthly | 5 years monthly | Sufficient degrees of freedom |
| GARCH | 2 years daily | 5 years daily | GARCH requires frequent observations |
| Monte Carlo (retirement) | N/A | 30+ year simulation | Cover full retirement horizon |
| Backtest | 5 years | 10+ years | Include multiple market regimes |

---

## Output Formatting Rules

- Always lead with the model type and assumptions before results.
- Round to meaningful precision: percentages to 1–2 decimal places; dollar amounts
  to the nearest unit appropriate for portfolio size.
- Separate descriptive statistics from predictive claims.
- Flag all data limitations explicitly.
- Do not present model output as certainty. Use language such as:
  - "The model suggests..."
  - "Based on historical data..."
  - "Under the assumption of..."
  - "The quantitative implication is..."

---

## When NOT to use a quantitative model

Do not reach for a model when:
- The question is qualitative (e.g., "Is this company well-managed?").
- The available data is too short, too sparse, or too noisy to produce stable estimates.
- The user needs a decision now and model output would add false precision without
  changing the conclusion.
- The question is better answered by `investment-lens` through scenario framing
  and bias-adjusted reasoning.

In these cases, state that quantitative modeling is not the appropriate tool and
return to `investment-lens` for qualitative judgment.
