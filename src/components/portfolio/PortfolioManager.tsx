"use client";

import { useState } from 'react';
import { UploadCloud, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortfolioHeatmap, PortfolioHolding } from './PortfolioHeatmap';

interface PortfolioManagerProps {
  initialHoldings?: PortfolioHolding[];
  onUploadCsv?: (file: File) => Promise<void>;
  onRefreshQuotes?: () => Promise<void>;
}

export function PortfolioManager({
  initialHoldings = [],
  onUploadCsv,
  onRefreshQuotes
}: PortfolioManagerProps) {
  const [holdings] = useState<PortfolioHolding[]>(initialHoldings);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
  const [heatmapMetric, setHeatmapMetric] = useState<'changePercent' | 'returnPercent'>('returnPercent');

  const totalMarketValue = holdings.reduce((sum, h) => sum + (h.shares * h.price), 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.shares * h.costBasis), 0);
  const totalReturn = totalMarketValue - totalCostBasis;
  const totalReturnPercent = totalCostBasis > 0 ? (totalReturn / totalCostBasis) * 100 : 0;

  const handleRefresh = async () => {
    if (!onRefreshQuotes) return;
    setIsRefreshing(true);
    try {
      await onRefreshQuotes();
      // Optionally reload data here or rely on external prop updates
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCsv) {
      onUploadCsv(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">投資組合總覽 (Portfolio Overview)</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-3xl font-bold tabular-nums">
              ${totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={cn(
              "flex items-center text-sm font-semibold rounded-md px-2 py-1",
              totalReturn >= 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-1 opacity-70">
                ({totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors border">
            <UploadCloud className="w-4 h-4" />
            匯入 CSV (Import)
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            更新報價 (Update Quotes)
          </button>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode('table')}
            className={cn("text-sm font-medium pb-2 border-b-2 transition-colors", viewMode === 'table' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            列表視圖 (List)
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={cn("text-sm font-medium pb-2 border-b-2 transition-colors", viewMode === 'heatmap' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            熱力圖 (Heatmap)
          </button>
        </div>

        {viewMode === 'heatmap' && (
          <select
            value={heatmapMetric}
            onChange={(e) => setHeatmapMetric(e.target.value as 'changePercent' | 'returnPercent')}
            className="text-sm bg-transparent border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="returnPercent">總報酬 (Total Return)</option>
            <option value="changePercent">日漲跌 (Daily Change)</option>
          </select>
        )}
      </div>

      {/* Content Area */}
      {viewMode === 'heatmap' ? (
        <PortfolioHeatmap holdings={holdings} metric={heatmapMetric} className="min-h-[400px]" />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">代碼 (Symbol)</th>
                <th className="px-4 py-3 font-medium text-right">股數 (Shares)</th>
                <th className="px-4 py-3 font-medium text-right">現價 (Price)</th>
                <th className="px-4 py-3 font-medium text-right">成本 (Cost)</th>
                <th className="px-4 py-3 font-medium text-right">市值 (Market Value)</th>
                <th className="px-4 py-3 font-medium text-right">總報酬 (Return)</th>
                <th className="px-4 py-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    暫無持倉數據，請點擊上方匯入 CSV 或手動新增。
                  </td>
                </tr>
              ) : (
                holdings.map((holding) => {
                  const marketValue = holding.shares * holding.price;
                  const cost = holding.shares * holding.costBasis;
                  const returnValue = marketValue - cost;
                  const isPositive = returnValue >= 0;

                  return (
                    <tr key={holding.symbol} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold">{holding.symbol}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{holding.shares}</td>
                      <td className="px-4 py-3 text-right tabular-nums">${holding.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">${holding.costBasis.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">
                        ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={cn("px-4 py-3 text-right font-medium tabular-nums", isPositive ? "text-emerald-500" : "text-rose-500")}>
                        {isPositive ? '+' : ''}{holding.returnPercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                         <button className="text-muted-foreground hover:text-destructive transition-colors p-1" title="刪除持倉">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
