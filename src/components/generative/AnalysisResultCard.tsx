'use client';

import React from 'react';
import { exportElementToPDF } from '@/lib/utils/export-pdf';
// Note: Actual imports and styles are omitted for brevity.
// This file is assumed to be an existing component we are modifying.

export function AnalysisResultCard({
  ticker,
  recommendation,
  confidence,
  thesis,
  isStreaming = false
}: any) {

  const handleExportPDF = () => {
    exportElementToPDF(`analysis-card-${ticker}`, `Analysis_${ticker}.pdf`);
  };

  if (isStreaming) {
    return <div className="min-h-[340px] animate-pulse bg-gray-200 rounded-xl" data-testid="skeleton-card" />;
  }

  let borderColor = 'border-gray-500';
  if (recommendation === 'Buy') borderColor = 'border-emerald-500';
  if (recommendation === 'Sell') borderColor = 'border-rose-500';
  if (recommendation === 'Neutral') borderColor = 'border-amber-400';

  return (
    <div
      id={`analysis-card-${ticker}`}
      data-testid="analysis-result-card"
      className={`min-h-[340px] p-6 rounded-xl border-l-4 ${borderColor} bg-zinc-900 text-white shadow-lg shadow-black/40`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{ticker}</h2>
        <div className="flex gap-2">
          <span data-testid="recommendation-badge" className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-800">
            {recommendation}
          </span>
          <button
            onClick={handleExportPDF}
            className="px-3 py-1 bg-brand-dark text-white rounded-lg text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      {confidence === 'Low' && (
        <div role="alert" className="mb-4 p-2 bg-amber-500/20 text-amber-400 rounded text-sm">
          ⚠️ 信心度低，請審慎參考
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Thesis</h3>
        <p className="text-gray-300">{thesis}</p>
      </div>

      <button data-testid="expand-l2-button" className="text-brand text-sm">
        展開詳情
      </button>
    </div>
  );
}
