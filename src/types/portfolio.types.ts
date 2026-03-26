export type HeatmapMetric = 'pnl_pct' | 'weight' | 'volatility' | 'beta'
export type ColorScale    = 'diverging' | 'sequential'

export interface HoldingItem {
  ticker:      string
  name:        string
  weight:      number       // 0–1
  pnlPct:      number
  volatility?: number
  beta?:       number
  marketValue: number
}

export interface PortfolioHeatmapProps {
  holdings:    HoldingItem[]
  metric:      HeatmapMetric
  colorScale?: ColorScale     // 預設 'diverging'
  isLoading?:  boolean
}

export interface Portfolio {
  id:           string
  name:         string
  baseCurrency: 'TWD' | 'USD' | 'EUR' | 'JPY' | 'HKD'
  holdings:     Holding[]
  totalValue:   number
  valueDate:    string
}

export interface Holding {
  ticker:        string
  name:          string
  shares:        number
  avgCost:       number
  currentPrice:  number
  marketValue:   number
  unrealizedPnl: number
  cfiCode?:      string
  exchange:      string
}
