'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, AlertTriangle, Settings, Activity, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuantAnalysisResult } from '@/types/quant.types'

interface QuantAnalysisResultCardProps {
  data: QuantAnalysisResult
  className?: string
  onViewDetails?: (type: string) => void
}

const ModelTypeIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'Risk Analysis': return <AlertTriangle className="w-4 h-4" />
    case 'Optimization': return <Settings className="w-4 h-4" />
    case 'Statistical Modeling': return <Activity className="w-4 h-4" />
    case 'Simulation and Backtesting': return <Clock className="w-4 h-4" />
    default: return <Settings className="w-4 h-4" />
  }
}

export function QuantAnalysisResultCard({ data, className, onViewDetails }: QuantAnalysisResultCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn("rounded-xl border border-brand/20 bg-card text-card-foreground shadow-sm overflow-hidden", className)}>
      {/* Summary L1 */}
      <div
        className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-brand">量化分析結果 (Quant Analysis)</h3>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand/20 bg-brand/10 text-brand">
                <ModelTypeIcon type={data.analysis_type} />
                {data.analysis_type}
              </div>
            </div>

            <p className="text-sm font-medium text-zinc-300 mt-2">
              分析目標: {data.objective}
            </p>

            {/* Quick Metrics display (e.g., VaR) */}
            {(data.model_output.var || data.model_output.cvar) && (
               <div className="flex gap-4 mt-2">
                 {data.model_output.var && (
                   <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md text-rose-500 text-sm">
                     <span className="font-semibold">VaR:</span>
                     <span className="font-mono">{(data.model_output.var * 100).toFixed(2)}%</span>
                   </div>
                 )}
                 {data.model_output.cvar && (
                   <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md text-rose-500 text-sm">
                     <span className="font-semibold">CVaR:</span>
                     <span className="font-mono">{(data.model_output.cvar * 100).toFixed(2)}%</span>
                   </div>
                 )}
               </div>
            )}
          </div>
          <div className="shrink-0 text-muted-foreground mt-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded L2 */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-zinc-800"
          >
            <div className="p-5 space-y-6 bg-zinc-900/30">

              {/* Output Display based on analysis type */}
              <div className="space-y-3">
                 <h4 className="text-sm font-semibold flex items-center gap-2">
                   <Settings className="w-4 h-4 text-zinc-400" />
                   模型輸出 (Model Output)
                 </h4>

                 {data.model_output.optimized_weights && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(data.model_output.optimized_weights).map(([ticker, weight]) => (
                        <div key={ticker} className="flex justify-between items-center bg-zinc-800 p-2 rounded text-sm">
                          <span className="font-medium">{ticker}</span>
                          <span className="text-emerald-400 font-mono">{(weight * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <h4 className="text-sm font-semibold text-zinc-300">
                    風險發現 (Risk Findings)
                  </h4>
                  <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    {data.risk_findings.map((finding, i) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <h4 className="text-sm font-semibold text-zinc-300">
                    模型限制 (Limitations & Assumptions)
                  </h4>
                  <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    {data.limitations.map((limitation, i) => (
                      <li key={i}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* L3: Action to view deep dive */}
              <div className="pt-2 flex justify-between items-center text-xs text-zinc-500">
                <span>資料截至 (Valid As Of): {data.valid_as_of}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails?.(data.analysis_type)
                  }}
                  className="text-sm font-medium bg-brand/20 text-brand border border-brand/50 px-4 py-2 rounded-md hover:bg-brand/30 transition-colors"
                >
                  查看完整量化報告 (View Detailed Report)
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
