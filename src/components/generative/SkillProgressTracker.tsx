'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Check, Loader2, X, ChevronDown, ChevronUp, Link } from 'lucide-react'
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

  // P4 Enhancement: Visual cue when multiple skills are chained
  const hasMultipleSkills = useMemo(() => {
    if (steps.length <= 1) return false
    const firstSkill = steps[0].skill
    for (let i = 1; i < steps.length; i++) {
      if (steps[i].skill !== firstSkill) return true
    }
    return false
  }, [steps])

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
          <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
            {allFinished ? '分析程序已完成' : 'AI 代理正在執行分析程序...'}
            {hasMultipleSkills && !allFinished && (
               <span className="flex items-center gap-1 text-xs text-brand bg-brand/10 px-2 py-0.5 rounded-full border border-brand/20">
                 <Link className="h-3 w-3" />
                 技能串接中
               </span>
            )}
          </h3>
        </div>
        {isCollapsible && (
          <button className="text-zinc-400 hover:text-zinc-200 focus:outline-none">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="mt-4 flex flex-col gap-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          {steps.map((step, idx) => (
            <div key={`${step.skill}-${idx}`} className="relative flex items-center justify-between group">
              {/* Timeline Connector Line */}
              {idx !== steps.length - 1 && (
                  <div className="absolute left-2 top-4 w-px h-[calc(100%+12px)] bg-zinc-800 -translate-x-1/2" />
              )}

              <div className="flex items-center gap-3">
                <div className="relative z-10 bg-zinc-900/50 rounded-full">
                  <StatusIcon status={step.status} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${step.status === 'pending' ? 'text-zinc-500' : step.status === 'running' ? 'text-brand' : 'text-zinc-300'}`}>
                    {step.label}
                  </span>
                  {/* Show which skill is running this step if multi-skill */}
                  {hasMultipleSkills && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1 font-mono uppercase">
                      {step.skill}
                    </span>
                  )}
                </div>
                {step.status === 'error' && (
                  <span className="text-xs text-rose-500 ml-2">(發生錯誤)</span>
                )}
              </div>

              {step.durationMs && step.status === 'done' && (
                <span className="text-xs text-zinc-500 font-mono">
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
      return (
        <div className="h-4 w-4 flex items-center justify-center rounded-full bg-brand/20 border border-brand/50 shadow-[0_0_8px_rgba(var(--brand-rgb),0.5)]">
           <div className="h-1.5 w-1.5 rounded-full bg-brand animate-ping" />
        </div>
      )
    case 'done':
      return (
        <div className="h-4 w-4 flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/50">
          <Check className="h-2.5 w-2.5 text-emerald-500 stroke-[3]" />
        </div>
      )
    case 'error':
      return (
        <div className="h-4 w-4 flex items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/50">
          <X className="h-2.5 w-2.5 text-rose-500 stroke-[3]" />
        </div>
      )
    case 'pending':
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-zinc-700 bg-zinc-900" />
  }
}
