import { RiskBadgeProps, RiskLevel } from '@/types/skill.types'
import { cn } from '@/lib/utils'

const RISK_COLORS: Record<RiskLevel, string> = {
  critical: 'bg-rose-700 text-rose-100',
  high:     'bg-orange-600 text-orange-100',
  medium:   'bg-amber-500 text-amber-950',
  low:      'bg-emerald-600 text-emerald-100',
}

const SIZE_CLASSES = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export function RiskBadge({ level, label, tooltip, size = 'md' }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        RISK_COLORS[level],
        SIZE_CLASSES[size]
      )}
      title={tooltip}
      data-testid="risk-badge"
      data-risk-level={level}
      data-risk-size={size}
    >
      {label}
    </span>
  )
}
