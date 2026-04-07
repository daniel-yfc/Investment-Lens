import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { StreamChunk } from '@/types/stream.types'

export interface ToolCall {
  id: string
  name: string
  arguments: unknown
}

export interface UIMessage {
  id:        string
  role:      'user' | 'assistant' | 'system'
  content:   string
  toolCalls?: ToolCall[]
  createdAt: Date
}

export interface ChatState {
  messages:       UIMessage[]
  conversationId: string | null
  isStreaming:    boolean
  activeSkills:   string[]
  streamError:    Error | null
  retryCount:     number

  // sendMessage: kept for backward-compat with existing tests — adds user bubble AND does fetch
  sendMessage:        (content: string) => Promise<void>
  // addUserMessage: used by useStreamingChat — only adds bubble, no fetch
  addUserMessage:     (content: string) => UIMessage
  appendChunk:        (chunk: StreamChunk) => void
  setStreaming:       (v: boolean) => void
  setActiveSkills:    (skills: string[]) => void
  clearError:         () => void
  resetConversation:  () => void
  retryLastMessage:   () => void
  getLastUserMessage: () => UIMessage | undefined
  loadConversation:   (id: string) => Promise<void>
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

function appendToLastAssistant(
  messages: UIMessage[],
  update: Partial<UIMessage>
): UIMessage[] {
  if (messages.length === 0) return messages
  const last = messages[messages.length - 1]
  if (last.role !== 'assistant') {
    return [
      ...messages,
      { id: generateId(), role: 'assistant', content: '', createdAt: new Date(), ...update },
    ]
  }
  return messages.map((m, i) =>
    i === messages.length - 1
      ? {
          ...m,
          content: update.content ? m.content + update.content : m.content,
          toolCalls: update.toolCalls
            ? [...(m.toolCalls ?? []), ...update.toolCalls]
            : m.toolCalls,
        }
      : m
  )
}

export const useChatStore = create<ChatState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      messages:       [],
      conversationId: null,
      isStreaming:    false,
      activeSkills:   [],
      streamError:    null,
      retryCount:     0,

      // Full send: adds bubble + fires fetch (for test compatibility)
      sendMessage: async (content: string) => {
        const userMsg: UIMessage = {
          id: generateId(),
          role: 'user',
          content,
          createdAt: new Date(),
        }
        set((s) => ({
          messages: [...s.messages, userMsg],
          isStreaming: true,
          streamError: null,
          retryCount: 0,
          activeSkills: [],
        }))
        try {
          const response = await fetch('/api/v1/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: content, conversationId: get().conversationId }),
          })
          if (!response.ok) {
            const text = await response.text()
            throw new Error(text)
          }
        } catch (error) {
          set({ streamError: error as Error, isStreaming: false })
        }
      },

      // Bubble-only: used by useStreamingChat (fetch handled by hook)
      addUserMessage: (content: string): UIMessage => {
        const userMsg: UIMessage = {
          id: generateId(),
          role: 'user',
          content,
          createdAt: new Date(),
        }
        set((s) => ({
          messages: [...s.messages, userMsg],
          isStreaming: true,
          streamError: null,
          activeSkills: [],
        }))
        return userMsg
      },

      appendChunk: (chunk: StreamChunk) => {
        if (chunk.type === 'text') {
          set((s) => {
            const lastIsAssistant =
              s.messages.length > 0 &&
              s.messages[s.messages.length - 1].role === 'assistant'
            if (!lastIsAssistant) {
              return {
                messages: [
                  ...s.messages,
                  { id: generateId(), role: 'assistant', content: chunk.content, createdAt: new Date() },
                ],
              }
            }
            return { messages: appendToLastAssistant(s.messages, { content: chunk.content }) }
          })
        } else if (chunk.type === 'tool_result') {
          set((s) => {
            const newToolCall: ToolCall = {
              id: generateId(),
              name: chunk.component,
              arguments: { type: 'tool_result', component: chunk.component, props: chunk.props },
            }
            return { messages: appendToLastAssistant(s.messages, { toolCalls: [newToolCall] }) }
          })
        } else if (chunk.type === 'tool_call') {
          set((s) => {
            const skills = [...s.activeSkills]
            if (!skills.includes(chunk.skill)) skills.push(chunk.skill)
            return { activeSkills: skills }
          })
        } else if (chunk.type === 'error') {
          set({ streamError: new Error(chunk.message), isStreaming: false })
        } else if (chunk.type === 'done') {
          set({ isStreaming: false })
        }
      },

      setStreaming:      (v) => set({ isStreaming: v }),
      setActiveSkills:   (skills) => set({ activeSkills: skills }),
      clearError:        () => set({ streamError: null, retryCount: 0 }),
      resetConversation: () => set({ messages: [], conversationId: null }),

      retryLastMessage: () => {
        const { messages } = get()
        let lastUser: UIMessage | undefined
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'user') { lastUser = messages[i]; break }
        }
        if (lastUser) {
          set((s) => ({ retryCount: s.retryCount + 1 }))
          get().sendMessage(lastUser.content)
        }
      },

      getLastUserMessage: () => {
        const { messages } = get()
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'user') return messages[i]
        }
        return undefined
      },

      loadConversation: async (_id: string) => {},
    })),
    { name: 'chat-store' }
  )
)
