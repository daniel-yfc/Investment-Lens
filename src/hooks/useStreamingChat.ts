'use client'

import { useCallback, useRef, useState } from 'react'
import { useChatStore } from '@/store/chat'
import type { UIMessage } from '@/store/chat'

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000
const IS_DEV = process.env.NODE_ENV === 'development'

export function useStreamingChat() {
  const {
    messages,
    isStreaming,
    setStreaming,
    appendChunk,
    addUserMessage,
    getLastUserMessage,
    activeSkills,
    streamError,
  } = useChatStore()

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
            appendChunk(JSON.parse(raw))
          } catch {
            // malformed SSE line — skip silently
          }
        }
      }
    },
    [appendChunk]
  )

  const launchStream = useCallback(
    async (message: string) => {
      setStreaming(true)
      setHasInterruptionError(false)
      retryCountRef.current = 0

      const attempt = async (): Promise<void> => {
        abortRef.current = new AbortController()
        try {
          await readSSEStream(message, abortRef.current.signal)
          retryCountRef.current = 0
          setHasInterruptionError(false)
        } catch (err: unknown) {
          if ((err as Error)?.name === 'AbortError') return
          if (IS_DEV) console.error('[useStreamingChat] stream error:', err)

          if (retryCountRef.current < MAX_RETRIES) {
            const backoff = INITIAL_BACKOFF_MS * Math.pow(2, retryCountRef.current)
            retryCountRef.current += 1
            if (IS_DEV) console.warn(`[useStreamingChat] retry ${retryCountRef.current}/${MAX_RETRIES} in ${backoff}ms`)
            await new Promise((r) => setTimeout(r, backoff))
            return attempt()
          }
          setHasInterruptionError(true)
          appendChunk({ type: 'text', content: '\n\n[⚠️ 回應不完整]' })
          appendChunk({ type: 'done' })
        } finally {
          setStreaming(false)
        }
      }

      await attempt()
    },
    [readSSEStream, appendChunk, setStreaming]
  )

  const handleSubmit = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return
      addUserMessage(message)
      await launchStream(message)
    },
    [isStreaming, addUserMessage, launchStream]
  )

  const handleManualRetry = useCallback(async () => {
    const lastUser = getLastUserMessage()
    if (!lastUser || isStreaming) return
    setHasInterruptionError(false)
    retryCountRef.current = 0
    await launchStream(lastUser.content)
  }, [getLastUserMessage, isStreaming, launchStream])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [setStreaming])

  return {
    messages: messages as UIMessage[],
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
