export type SkillStatus = 'pending' | 'running' | 'done' | 'error'

export interface SkillStep {
  skill:    string       // e.g., 'alphaear-stock'
  label:    string       // 顯示文字，e.g., '獲取台積電 OHLCV'
  status:   SkillStatus
  durationMs?: number    // 完成後顯示耗時
}

export interface SkillProgressTrackerProps {
  steps:         SkillStep[]
  currentSkill?: string
  isCollapsible?: boolean    // 完成後可折疊
}

export type Recommendation = 'Buy' | 'Hold' | 'Sell' | 'Neutral'
export type Confidence     = 'High' | 'Medium' | 'Low'

export interface RiskItem {
  id:       string
  label:    string
  severity: 'critical' | 'high' | 'medium' | 'low'
  detail?:  string
}

export interface AnalysisResultCardProps {
  // 核心輸出
  ticker:          string
  recommendation:  Recommendation
  confidence:      Confidence
  thesis:          string
  counterThesis:   string
  keyRisks:        RiskItem[]
  killConditions:  string[]
  validAsOf:       string          // ISO 8601
  // 串流控制
  isStreaming?:    boolean          // true = 顯示 Skeleton
  streamProgress?: number          // 0–100，進度條
  // 互動
  onExpandDetail?: () => void       // L2 展開回調
  onExport?:       () => void       // 匯出 PDF/Markdown
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'

export interface RiskBadgeProps {
  level:    RiskLevel
  label:    string
  tooltip?: string
  size?:    'sm' | 'md' | 'lg'
}
