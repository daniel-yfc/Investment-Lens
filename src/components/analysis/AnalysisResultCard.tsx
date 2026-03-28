"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type Rating = "Buy" | "Hold" | "Sell" | "Neutral";

export interface AnalysisData {
  symbol: string;
  rating: Rating;
  confidence: number;
  thesis: string;
  fullAnalysis: string;
  risks: string[];
  killConditions: string[];
}

interface AnalysisResultCardProps {
  data: AnalysisData;
  className?: string;
  onViewDetails?: (symbol: string) => void;
}

const ratingConfig = {
  Buy: {
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: TrendingUp,
    label: "買入 (Buy)",
  },
  Hold: {
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Minus,
    label: "持有 (Hold)",
  },
  Sell: {
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: TrendingDown,
    label: "賣出 (Sell)",
  },
  Neutral: {
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    icon: Minus,
    label: "中立 (Neutral)",
  },
};

export function AnalysisResultCard({ data, className, onViewDetails }: AnalysisResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = ratingConfig[data.rating];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden min-h-[320px]", className)}>
      {/* L1: Default View (Summary) */}
      <div
        className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{data.symbol}</h3>
              <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", config.color)}>
                <Icon className="w-3 h-3" />
                {config.label}
              </div>
            </div>
            <div className="text-sm font-medium">
              信心度 (Confidence): <span className={cn(
                data.confidence >= 80 ? "text-emerald-500" : data.confidence >= 60 ? "text-amber-500" : "text-rose-500"
              )}>{data.confidence}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {data.thesis}
            </p>
          </div>
          <div className="shrink-0 text-muted-foreground mt-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* L2: Expanded View (Details without Layout Shift CLS using framer-motion) */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t"
          >
            <div className="p-5 space-y-6 bg-muted/20">

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">完整分析 (Analysis)</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.fullAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                  <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    風險提示 (Risks)
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {data.risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    停損條件 (Kill Conditions)
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {data.killConditions.map((condition, i) => (
                      <li key={i}>{condition}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* L3: Action to view deep dive */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(data.symbol);
                  }}
                  className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  查看詳細數據與圖表 (View Details)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
