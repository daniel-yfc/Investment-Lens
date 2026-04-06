'use client'

import { useCallback, useRef, useState } from 'react'
import { useChatStore } from '@/store/chat'
import type { UIMessage } from '@/store/chat'

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000

/**
 * useStreamingChat — consumes the custom SSE stream from /api/v1/chat/stream
 * and pipes each chunk into useChatStore.appendChunk.
 *
 * Architecture: ChatInput → handleSubmit → fetch SSE → appendChunk(store)
 * No @ai-sdk/react useChat needed — the route outputs our own StreamChunk protocol.
 */
export function useStreamingChat() {
  const {
    messages,
    isStreaming,
    setStreaming,
    appendChunk,
    activeSkills,
    streamError,
    retryLastMessage,
  } = useChatStore()

  const [input, setInput] = useState('')
  const [hasInterruptionError, setHasInterruptionError] = useState(false)
  const retryCountRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const readSSEStream = useCallback(
    async (message: string, signal: AbortSignal) => {
      const res = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText)
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') {
            appendChunk({ type: 'done' })
            return
          }
          try {
            const chunk = JSON.parse(raw)
            appendChunk(chunk)
          } catch {
            // Malformed line — skip
          }
        }
      }
    },
    [appendChunk]
  )

  const handleSubmit = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return

      setHasInterruptionError(false)
      retryCountRef.current = 0
      setStreaming(true)

      // Add user message to store
      useChatStore.getState().sendMessage(message)

      const attempt = async () => {
        abortRef.current = new AbortController()
        try {
          await readSSEStream(message, abortRef.current.signal)
          retryCountRef.current = 0
          setHasInterruptionError(false)
        } catch (err: unknown) {
          if ((err as Error)?.name === 'AbortError') return

          console.error('Stream error:', err)

          if (retryCountRef.current < MAX_RETRIES) {
            const backoff = INITIAL_BACKOFF_MS * Math.pow(2, retryCountRef.current)
            retryCountRef.current += 1
            console.log(`Retry ${retryCountRef.current}/${MAX_RETRIES} in ${backoff}ms`)
            setTimeout(attempt, backoff)
          } else {
            setHasInterruptionError(true)
            appendChunk({ type: 'text', content: '\n\n[⚠️ 回應不完整]' })
            appendChunk({ type: 'done' })
          }
        } finally {
          setStreaming(false)
        }
      }

      await attempt()
    },
    [isStreaming, setStreaming, readSSEStream, appendChunk]
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [setStreaming])

  const handleManualRetry = useCallback(() => {
    setHasInterruptionError(false)
    retryCountRef.current = 0
    retryLastMessage()
  }, [retryLastMessage])

  return {
    messages: messages as UIMessage[],
    input,
    setInput,
    handleSubmit,
    isLoading: isStreaming,
    isStreaming,
    activeSkills,
    error: streamError,
    hasInterruptionError,
    handleManualRetry,
    stop,
  }
}
