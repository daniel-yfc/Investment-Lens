'use client'

import React, { useState, FormEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="w-full relative rounded-xl border border-zinc-700 bg-zinc-900/80 p-2 shadow-sm focus-within:ring-1 focus-within:ring-brand focus-within:border-brand transition-all">
      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入想分析的股票代號，例如 2330.TW 或 AAPL..."
          className="w-full bg-transparent p-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 disabled:opacity-50 sm:text-sm"
          disabled={disabled}
          data-testid="chat-input"
        />
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          size="icon"
          className="shrink-0 rounded-lg absolute right-1 top-1 bottom-1 h-auto"
        >
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
