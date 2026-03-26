'use client'

import React, { useState, useEffect } from 'react'
import { Check, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { SkillProgressTrackerProps, SkillStatus } from '@/types/skill.types'

export function SkillProgressTracker({ steps, currentSkill, isCollapsible = true }: SkillProgressTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // All steps finished
  const allFinished = steps.length > 0 && steps.every(s => s.status === 'done' || s.status === 'error')

  // Automatically collapse after 2 seconds when all steps are finished
  useEffect(() => {
    if (allFinished && isCollapsible) {
      const timer = setTimeout(() => {
        setIsCollapsed(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      Promise.resolve().then(() => setIsCollapsed(false))
    }
  }, [allFinished, isCollapsible])

  if (steps.length === 0) return null

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 mb-4" data-testid="skill-progress-tracker">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {allFinished ? (
            <Check className="h-5 w-5 text-emerald-500" />
          ) : (
             <Loader2 className="h-5 w-5 animate-spin text-brand" />
          )}
          <h3 className="text-sm font-medium text-zinc-100">
            {allFinished ? '分析程序已完成' : 'AI 代理正在執行分析程序...'}
          </h3>
        </div>
        {isCollapsible && (
          <button className="text-zinc-400 hover:text-zinc-200 focus:outline-none">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="mt-4 flex flex-col gap-3">
          {steps.map((step, idx) => (
            <div key={`${step.skill}-${idx}`} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={step.status} />
                <span className={`text-sm ${step.status === 'pending' ? 'text-zinc-500' : 'text-zinc-300'}`}>
                  {step.label}
                </span>
                {step.status === 'error' && (
                  <span className="text-xs text-rose-500 ml-2">(發生錯誤)</span>
                )}
              </div>

              {step.durationMs && step.status === 'done' && (
                <span className="text-xs text-zinc-500">
                  {step.durationMs}ms
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: SkillStatus }) {
  switch (status) {
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-brand" />
    case 'done':
      return <Check className="h-4 w-4 text-emerald-500" />
    case 'error':
      return <X className="h-4 w-4 text-rose-500" />
    case 'pending':
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-zinc-700" />
  }
}
