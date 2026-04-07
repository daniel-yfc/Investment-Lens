'use client'

import React, { useRef, useEffect } from 'react'
import type { UIMessage } from '@/store/chat'
import { MessageBubble } from './MessageBubble'
import { SkillProgressTracker } from '@/components/generative/SkillProgressTracker'
import type { SkillStep } from '@/types/skill.types'
import { useTranslate } from '@/hooks/useTranslate'

interface MessageFeedProps {
  messages: UIMessage[]
  isStreaming: boolean
  activeSkills?: string[]
}

export function MessageFeed({ messages, isStreaming, activeSkills = [] }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming, activeSkills])

  // #4: fixed label — use skill name directly, don't try to string-replace the i18n key
  const skillSteps: SkillStep[] = activeSkills.map((s) => ({
    skill: s,
    label: isStreaming
      ? `${t.chat.analyzing.replace('...', '')} · ${s}...`
      : `${t.chat.analysisComplete} · ${s}`,
    status: isStreaming ? 'running' : 'done',
  }))

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-20">
            <h2 className="text-xl font-medium text-zinc-300 mb-2">{t.chat.welcome}</h2>
            <p>{t.chat.welcomeSub}</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {skillSteps.length > 0 && (
          <SkillProgressTracker
            steps={skillSteps}
            currentSkill={activeSkills[activeSkills.length - 1]}
          />
        )}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  )
}
