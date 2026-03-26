'use client'

import React, { useState } from 'react'
import { AlertTriangle, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { AnalysisResultCardProps, Recommendation } from '@/types/skill.types'
import { useTranslate } from '@/hooks/useTranslate'
import { RiskBadge } from './RiskBadge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const REC_COLORS: Record<Recommendation, string> = {
  Buy: 'border-emerald-500 text-emerald-500',
  Hold: 'border-zinc-500 text-zinc-300',
  Sell: 'border-rose-500 text-rose-500',
  Neutral: 'border-amber-400 text-amber-400',
}

const REC_BG: Record<Recommendation, string> = {
  Buy: 'bg-emerald-500/10',
  Hold: 'bg-zinc-500/10',
  Sell: 'bg-rose-500/10',
  Neutral: 'bg-amber-400/10',
}

export function AnalysisResultCard(props: AnalysisResultCardProps) {
  const { t } = useTranslate()
  const [expanded, setExpanded] = useState(false)

  const {
    ticker,
    recommendation,
    confidence,
    thesis,
    counterThesis,
    keyRisks,
    killConditions,
    validAsOf,
    isStreaming,
    onExpandDetail,
    onExport,
  } = props

  if (isStreaming) {
    return (
      <div
        className="w-full min-h-[340px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 animate-pulse"
        data-testid="skeleton-card"
      >
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  const handleExpand = () => {
    setExpanded(!expanded)
    onExpandDetail?.()
  }

  return (
    <div
      className={cn(
        "w-full rounded-xl border bg-zinc-900/80 shadow-lg shadow-black/40 overflow-hidden transition-all duration-300 border-l-4 min-h-[340px]",
        REC_COLORS[recommendation]
      )}
      data-testid="analysis-result-card"
    >
      {/* L1: Metadata & Summary */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{ticker}</h2>
            <div className="text-xs text-zinc-400">
              Valid as of: {new Date(validAsOf).toLocaleString()}
            </div>
          </div>
          <div
            className={cn(
              "px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2",
              REC_COLORS[recommendation],
              REC_BG[recommendation]
            )}
            data-testid="recommendation-badge"
          >
            {t.analysis.recommendation[recommendation]}
          </div>
        </div>

        {confidence === 'Low' && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-400"
          >
            <AlertTriangle className="h-4 w-4" />
            {t.analysis.lowConfidenceWarning}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">{t.analysis.thesis}</h3>
          <p className="text-zinc-100 leading-relaxed">{thesis}</p>
        </div>

        {/* Toggle Button for L2 */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
           <Button variant="ghost" size="sm" onClick={handleExpand} className="text-zinc-400 hover:text-white -ml-2" data-testid="expand-l2-button">
             {expanded ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
             {expanded ? t.analysis.collapse : t.analysis.expand}
           </Button>

           {onExport && (
             <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
               <Download className="h-4 w-4" />
               {t.analysis.export}
             </Button>
           )}
        </div>
      </div>

      {/* L2: Detailed Analysis */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-zinc-950/30 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
               <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">{t.analysis.counterThesis}</h3>
               <p className="text-zinc-300 text-sm leading-relaxed">{counterThesis}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">{t.analysis.keyRisks}</h3>
                <div className="flex flex-wrap gap-2">
                  {keyRisks.map(risk => (
                    <RiskBadge
                      key={risk.id}
                      level={risk.severity}
                      label={risk.label}
                      tooltip={risk.detail}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">{t.analysis.killConditions}</h3>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-300">
                  {killConditions.map((cond, idx) => (
                    <li key={idx} className="leading-snug">{cond}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
