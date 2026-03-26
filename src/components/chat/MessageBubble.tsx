'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { UIMessage } from '@/store/chat'
import { AnalysisResultCard } from '@/components/generative/AnalysisResultCard'

interface MessageBubbleProps {
  message: UIMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-4 leading-relaxed",
          isUser
            ? "bg-brand text-white rounded-br-none shadow-sm"
            : "bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/50 shadow-sm w-full"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <div className="prose prose-invert max-w-none text-zinc-100 prose-p:leading-relaxed prose-pre:bg-zinc-900">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.toolCalls?.map((tc, idx) => {
              const args = tc.arguments as Record<string, unknown>
              if (args.type === 'tool_result' && args.component === 'AnalysisResultCard') {
                 return <div key={idx} className="mt-2 w-full max-w-2xl"><AnalysisResultCard {...args.props} /></div>
              }
              return null
            })}
          </div>
        )}
      </div>
    </div>
  )
}
