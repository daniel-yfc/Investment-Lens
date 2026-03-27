"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, Link, X } from "lucide-react";

export type SkillStatus = 'pending' | 'running' | 'done' | 'error';

export interface SkillStep {
  skill: string;       // e.g., 'alphaear-stock'
  label: string;       // Display text, e.g., '獲取台積電 OHLCV'
  status: SkillStatus;
  durationMs?: number; // Time taken in milliseconds
}

export interface SkillProgressTrackerProps {
  steps: SkillStep[];
  currentSkill?: string;
  isCollapsible?: boolean;
  className?: string;
}

function StatusIcon({ status }: { status: SkillStatus }) {
  if (status === 'done') {
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  }
  if (status === 'running') {
    return (
      <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin shrink-0" />
    );
  }

  // pending
  return (
    <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0" />
  );
}

export function SkillProgressTracker({ steps, currentSkill, isCollapsible = true, className }: SkillProgressTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const allDone = steps.length > 0 && steps.every(s => s.status === 'done' || s.status === 'error');
  const errorCount = steps.filter(s => s.status === 'error').length;

  if (allDone && isCollapsible && !hasFinished) {
    setHasFinished(true);
  }

  useEffect(() => {
    if (hasFinished) {
      const timer = setTimeout(() => setIsCollapsed(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasFinished]);

  if (steps.length === 0) return null;

  // P4 Enhancement: Visual cue when multiple skills are chained
  const hasMultipleSkills = Array.from(new Set(steps.map(s => s.skill))).length > 1;

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900", className)}>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 transition-colors cursor-pointer",
          isCollapsible && "hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            allDone ? (errorCount > 0 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400") : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          )}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v2" />
              <path d="M8 8V6a4 4 0 0 1 8 0" />
              <rect x="2" y="8" width="20" height="12" rx="2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="8" y1="14" x2="16" y2="14" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {allDone
                ? (errorCount > 0 ? `Completed with ${errorCount} error${errorCount > 1 ? 's' : ''}` : "Analysis Complete")
                : "Agent Thinking..."}
              {hasMultipleSkills && !allDone && (
               <span className="flex items-center gap-1 text-xs text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                 <Link className="h-3 w-3" />
                 Chain Active
               </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {steps.filter(s => s.status === 'done').length} / {steps.length} steps
            </p>
          </div>
        </div>

        {isCollapsible && (
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={cn("transition-transform duration-200", isCollapsed ? "rotate-180" : "rotate-0")}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        )}
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
        )}
      >
        <div className="p-4 flex flex-col gap-4">
          {steps.map((step, index) => {
            const isCurrent = step.skill === currentSkill && step.status === 'running';
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <StatusIcon status={step.status} />
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-full min-h-[16px] my-1 rounded-full",
                      step.status === 'done' ? "bg-emerald-500/50" : "bg-slate-200 dark:bg-slate-700"
                    )} />
                  )}
                </div>
                <div className={cn(
                  "flex-1 pb-4",
                  index === steps.length - 1 && "pb-0",
                  step.status === 'pending' ? "opacity-50" : "opacity-100"
                )}>
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium",
                      step.status === 'error' ? "text-red-600 dark:text-red-400" :
                      isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {step.label}
                    </p>
                    {step.durationMs !== undefined && (
                      <span className="text-xs font-mono text-slate-400 tabular-nums">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                    {step.skill}
                  </p>

                  {/* Detailed error area if needed (could be expanded) */}
                  {step.status === 'error' && (
                     <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 font-mono">
                        Error executing {step.skill}
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
