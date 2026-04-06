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

function appendToLastAssistantMessage(messages: UIMessage[], update: Partial<UIMessage>): UIMessage[] {
  if (messages.length === 0) return messages
  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role !== 'assistant') {
      return [...messages, { id: generateId(), role: 'assistant', content: '', createdAt: new Date(), ...update }]
  }

  return messages.map((m, i) => {
    if (i === messages.length - 1) {
      return {
        ...m,
        content: update.content ? m.content + update.content : m.content,
        toolCalls: update.toolCalls ? [...(m.toolCalls || []), ...update.toolCalls] : m.toolCalls
      }
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
            activeSkills: []
        }))

        try {
            // Stream handled by hook
            const response = await fetch('/api/v1/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, conversationId: get().conversationId })
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }
        } catch (error) {
            set({ streamError: error as Error, isStreaming: false })
        }
      },
      appendChunk: (chunk: StreamChunk) => {
        if (chunk.type === 'text') {
          set((s) => {
              const lastIsAssistant = s.messages.length > 0 && s.messages[s.messages.length - 1].role === 'assistant';
              if (!lastIsAssistant) {
                 return { messages: [...s.messages, { id: generateId(), role: 'assistant', content: chunk.content, createdAt: new Date() }] }
              }
              return { messages: appendToLastAssistantMessage(s.messages, { content: chunk.content }) }
          })
        } else if (chunk.type === 'tool_result') {
          set((s) => {
             const newToolCall: ToolCall = {
                 id: generateId(),
                 name: chunk.component,
                 arguments: { type: 'tool_result', component: chunk.component, props: chunk.props }
             }
             return { messages: appendToLastAssistantMessage(s.messages, { toolCalls: [newToolCall] }) }
          })
        } else if (chunk.type === 'tool_call') {
          set((s) => {
            const newSkills = [...s.activeSkills]
            if (!newSkills.includes(chunk.skill)) {
              newSkills.push(chunk.skill)
            }
            return { activeSkills: newSkills }
          })
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
        let lastUser;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'user') {
            lastUser = messages[i];
            break;
          }
        }
        if (lastUser) {
          set(s => ({ retryCount: s.retryCount + 1 }))
          get().sendMessage(lastUser.content)
        }
      },
      loadConversation: async (id: string) => {
      },
    })),
    { name: 'chat-store' }
  )
)
