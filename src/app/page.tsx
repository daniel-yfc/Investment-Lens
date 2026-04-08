'use client'

import { ChatInput } from '@/components/chat/ChatInput'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

export default function ChatPage() {
  // Single hook call — avoid calling useStreamingChat() twice
  const { messages, isLoading, handleSubmit, activeSkills } = useStreamingChat()
  const { data: session } = useSession()

  // ChatInput.onSend expects (message: string) => void
  // handleSubmit returns Promise<void>, so wrap to satisfy the type
  const onSend = useCallback(
    (message: string) => { void handleSubmit(message) },
    [handleSubmit]
  )

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="flex-none border-b border-zinc-800 bg-zinc-900/50 p-4 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Investment-Lens</h1>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <div className="text-sm text-zinc-400">
              {session?.user?.name ?? session?.user?.email ?? '登入中...'}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <MessageFeed
          messages={messages}
          isStreaming={isLoading}
          activeSkills={activeSkills}
        />
      </main>

      <footer className="flex-none p-4 pb-8 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={onSend}
            disabled={isLoading}
          />
        </div>
      </footer>
    </div>
  )
}
