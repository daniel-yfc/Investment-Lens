import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useChatStore } from '@/store/chat'

/**
 * Vitest unit tests for useChatStore error paths in sendMessage.
 * Tests the fetch boundary: HTTP error responses and network exceptions.
 * Complements TC-010/TC-011 in chat.store.test.ts.
 */
describe('useChatStore — sendMessage stream error paths', () => {
  const initialState = {
    messages: [],
    conversationId: null,
    isStreaming: false,
    activeSkills: [],
    streamError: null,
    retryCount: 0,
  }

  beforeEach(() => {
    useChatStore.setState(initialState)
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-012: sendMessage sets streamError when fetch returns !ok response', async () => {
    const errorMessage = 'Internal Server Error'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: async () => errorMessage,
    }))

    await useChatStore.getState().sendMessage('test message')

    const state = useChatStore.getState()
    expect(state.isStreaming).toBe(false)
    expect(state.streamError).not.toBeNull()
    expect(state.streamError).toBeInstanceOf(Error)
    expect(state.streamError?.message).toBe(errorMessage)
    expect(state.messages).toHaveLength(1)
    expect(state.messages[0].content).toBe('test message')
  })

  it('TC-013: sendMessage sets streamError when fetch throws a network exception', async () => {
    const networkError = new Error('Network Error')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError))

    await useChatStore.getState().sendMessage('test message 2')

    const state = useChatStore.getState()
    expect(state.isStreaming).toBe(false)
    expect(state.streamError).toBe(networkError)
  })
})
