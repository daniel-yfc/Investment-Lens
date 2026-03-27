export type QuantAnalysisType = 'Risk Analysis' | 'Optimization' | 'Statistical Modeling' | 'Simulation and Backtesting'

export interface QuantModelOutput {
  var?: number;
  cvar?: number;
  optimized_weights?: Record<string, number>;
  beta?: number;
  factor_exposures?: Record<string, number>;
  drawdown?: number;
  scenario_results?: unknown;
}

export interface QuantAnalysisResult {
  analysis_type: QuantAnalysisType;
  objective: string;
  inputs_used: {
    tickers?: string[];
    portfolio_weights?: Record<string, number>;
    base_currency?: string;
    benchmark?: string;
    lookback_period?: string;
    risk_free_proxy?: string;
    model_type?: string;
    constraints?: string[];
  };
  assumptions: string[];
  summary_statistics?: Record<string, unknown>;
  model_output: QuantModelOutput;
  risk_findings: string[];
  limitations: string[];
  valid_as_of: string;
  reintegration_note: string;
}

export type SignalNodeStatus = 'pending' | 'running' | 'done' | 'error'

export interface SignalNode {
  id: string;
  label: string;
  status: SignalNodeStatus;
  type?: 'lens' | 'quant' | 'optimization' | 'var' | 'report';
  data?: Record<string, unknown>;
  description?: string;
}

export interface SignalEdge {
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface SignalChainGraphProps {
  nodes: SignalNode[];
  edges: SignalEdge[];
  className?: string;
  direction?: 'horizontal' | 'vertical';
}
