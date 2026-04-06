'use client'

import React, { useRef, useMemo } from 'react'
import { usePortfolioStore } from '@/store/portfolio'
import { PortfolioHeatmap } from '@/components/generative/PortfolioHeatmap'
import { Button } from '@/components/ui/button'
import { RefreshCw, Upload, Download } from 'lucide-react'
import { useTranslate } from '@/hooks/useTranslate'

export default function PortfolioPage() {
  const { t } = useTranslate()
  const { portfolios, activePortfolioId, isRefreshing, importFromCSV, refreshQuotes } = usePortfolioStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activePortfolio = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return undefined
    return portfolios.find((p) => p.id === activePortfolioId) || portfolios[0]
  }, [portfolios, activePortfolioId])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) importFromCSV(file)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.portfolio.title}</h1>
          <p className="text-zinc-400 mt-1">管理與分析您的投資組合配置</p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            {t.portfolio.uploadCSV}
          </Button>
          <Button
            onClick={() => refreshQuotes()}
            disabled={isRefreshing || portfolios.length === 0}
            className="bg-brand text-white hover:bg-brand-dark"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t.portfolio.refreshQuotes}
          </Button>
        </div>
      </header>

      {portfolios.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <Download className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">尚無投資組合資料</h3>
          <p className="text-zinc-400 max-w-sm">
            請上傳包含 ticker, name, shares, avgCost 欄位的 CSV 檔案以匯入您的持倉資料。
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400 mb-1">總資產價値</h3>
              <p className="text-3xl font-bold text-white tracking-tight" data-testid="total-value">
                ${activePortfolio?.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400 mb-1">未實現損益</h3>
              <p className="text-3xl font-bold text-emerald-500 tracking-tight">+7.4%</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
              <h3 className="text-sm font-medium text-zinc-400 mb-1">最後更新時間</h3>
              <p className="text-lg font-medium text-white tracking-tight mt-1">
                {activePortfolio?.valueDate
                  ? new Date(activePortfolio.valueDate).toLocaleTimeString()
                  : '-'}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{t.portfolio.heatmap}</h3>
            </div>
            <PortfolioHeatmap
              holdings={
                // #9: guard against totalValue === 0 to avoid NaN weight
                activePortfolio && activePortfolio.totalValue > 0
                  ? activePortfolio.holdings.map((h) => ({
                      ticker: h.ticker,
                      name: h.name,
                      weight: h.marketValue / activePortfolio.totalValue,
                      pnlPct: h.currentPrice
                        ? ((h.currentPrice - h.avgCost) / h.avgCost) * 100
                        : 0,
                      marketValue: h.marketValue,
                    }))
                  : []
              }
              metric="pnl_pct"
              isLoading={isRefreshing}
            />
          </div>
        </div>
      )}
    </div>
  )
}
