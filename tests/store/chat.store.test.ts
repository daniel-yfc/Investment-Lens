import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from '@/store/chat'

describe('ChatStore', () => {
  beforeEach(() => {
    useChatStore.getState().resetConversation()
  })

  it('TC-010: setStreaming(false) + streamError 在 stream 中斷時正確設定', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => result.current.appendChunk({ type: 'error', message: 'Network reset' }))
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.streamError).not.toBeNull()
    expect(result.current.streamError?.message).toBe('Network reset')
  })

  it('TC-011: retryLastMessage 遞增 retryCount', () => {
    const { result } = renderHook(() => useChatStore())
    act(() => {
        // Mock sendMessage or setup state to make retryLastMessage work without crashing on unhandled fetch
        result.current.sendMessage = async () => {}
        result.current.messages = [{ id: '1', role: 'user', content: 'test', createdAt: new Date() }]
        result.current.retryLastMessage()
    })
    expect(result.current.retryCount).toBe(1)
  })
})
