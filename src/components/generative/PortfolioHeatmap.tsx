'use client'

import React from 'react'
import { PortfolioHeatmapProps, HoldingItem } from '@/types/portfolio.types'
import { cn } from '@/lib/utils'

export function PortfolioHeatmap({ holdings, metric, colorScale = 'diverging', isLoading }: PortfolioHeatmapProps) {
  if (isLoading) {
    return <div className="w-full h-64 bg-zinc-900/50 rounded-xl border border-zinc-800 animate-pulse" data-testid="heatmap-skeleton" />
  }

  if (!holdings || holdings.length === 0) {
    return <div className="w-full h-64 bg-zinc-900/50 flex items-center justify-center text-zinc-500 rounded-xl">無持倉資料</div>
  }

  // Calculate total for relative sizing (mock simple tree-map like layout)
  const totalWeight = holdings.reduce((sum, h) => sum + (h.weight || 0.1), 0)

  // Sort by weight
  const sortedHoldings = [...holdings].sort((a, b) => (b.weight || 0) - (a.weight || 0))

  return (
    <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-wrap" data-testid="portfolio-heatmap">
      {sortedHoldings.map((holding) => {
        // Calculate style logic
        const basis = Math.max(10, ((holding.weight || 0.1) / totalWeight) * 100)

        // Diverging color based on pnlPct
        let bgColor = 'bg-zinc-800'
        if (metric === 'pnl_pct') {
           const pnl = holding.pnlPct
           if (pnl > 5) bgColor = 'bg-emerald-600'
           else if (pnl > 0) bgColor = 'bg-emerald-500/50'
           else if (pnl < -5) bgColor = 'bg-rose-600'
           else if (pnl < 0) bgColor = 'bg-rose-500/50'
        }

        return (
          <div
            key={holding.ticker}
            className={cn(
               "flex flex-col items-center justify-center border-r border-b border-zinc-950 p-2 text-white transition-all hover:opacity-80 cursor-pointer",
               bgColor
            )}
            style={{ width: `${basis}%`, minHeight: '100px', flexGrow: 1 }}
          >
            <div className="font-bold text-sm md:text-base tracking-tight">{holding.ticker}</div>
            <div className="text-xs opacity-80 mt-1">
              {metric === 'pnl_pct' && `${holding.pnlPct > 0 ? '+' : ''}${holding.pnlPct.toFixed(2)}%`}
              {metric === 'weight' && `${((holding.weight || 0) * 100).toFixed(1)}%`}
            </div>
          </div>
        )
      })}
    </div>
  )
}
