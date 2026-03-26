import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { StreamChunk } from '@/types/stream.types'

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
  activeSkills:   string[]           // 當前執行中的技能名稱
  streamError:    Error | null
  retryCount:     number

  sendMessage:        (content: string) => Promise<void>
  appendChunk:        (chunk: StreamChunk) => void
  setStreaming:       (v: boolean) => void
  setActiveSkills:    (skills: string[]) => void
  clearError:         () => void
  resetConversation:  () => void
  retryLastMessage:   () => void     // Stream 中斷 Fallback 觸發
  loadConversation:   (id: string) => Promise<void>
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function appendToLastAssistantMessage(messages: UIMessage[], content: string): UIMessage[] {
  if (messages.length === 0) return messages
  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'assistant') {
      return [...messages, { id: generateId(), role: 'assistant', content, createdAt: new Date() }]
  }

  return messages.map((m, i) => {
    if (i === messages.length - 1) {
      return { ...m, content: m.content + content }
    }
    return m
  })
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

      sendMessage: async (content: string) => {
        const userMsg: UIMessage = {
            id: generateId(),
            role: 'user',
            content,
            createdAt: new Date()
        }
        set((state) => ({
            messages: [...state.messages, userMsg],
            isStreaming: true,
            streamError: null,
            retryCount: 0,
            activeSkills: [] // Reset active skills on new message
        }))

        try {
            // This is handled in the UI/hook for now to stream text
            const response = await fetch('/api/v1/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, conversationId: get().conversationId })
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            // Fallback for full SSE is implemented via custom hooks
        } catch (error) {
            set({ streamError: error as Error, isStreaming: false })
        }
      },
      appendChunk: (chunk: StreamChunk) => {
        if (chunk.type === 'text') {
          set((s) => {
              // Create an assistant message if the last one isn't assistant
              const lastIsAssistant = s.messages.length > 0 && s.messages[s.messages.length - 1].role === 'assistant';
              if (!lastIsAssistant) {
                 return { messages: [...s.messages, { id: generateId(), role: 'assistant', content: chunk.content, createdAt: new Date() }] }
              }
              return { messages: appendToLastAssistantMessage(s.messages, chunk.content) }
          })
        } else if (chunk.type === 'tool_call') {
          // Track active skills
          set((s) => {
            const newSkills = [...s.activeSkills]
            if (!newSkills.includes(chunk.skill)) {
              newSkills.push(chunk.skill)
            }
            return { activeSkills: newSkills }
          })
        } else if (chunk.type === 'skill_progress') {
           // We might handle more fine-grained updates here later
        } else if (chunk.type === 'error') {
          set({ streamError: new Error(chunk.message), isStreaming: false })
        } else if (chunk.type === 'done') {
          set({ isStreaming: false })
        }
      },
      setStreaming:      (v: boolean) => set({ isStreaming: v }),
      setActiveSkills:   (skills: string[]) => set({ activeSkills: skills }),
      clearError:        () => set({ streamError: null, retryCount: 0 }),
      resetConversation: () => set({ messages: [], conversationId: null }),
      retryLastMessage:  () => {
        const messages = get().messages
        const lastUser = [...messages].reverse().find(m => m.role === 'user')
        if (lastUser) {
          set(s => ({ retryCount: s.retryCount + 1 }))
          get().sendMessage(lastUser.content)
        }
      },
      loadConversation: async (id: string) => {
        // Implement load logic
      },
    })),
    { name: 'chat-store' }
  )
)
