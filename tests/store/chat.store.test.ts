import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChatStore } from '@/store/chat'

describe('ChatStore — P1 acceptance criteria', () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      conversationId: null,
      isStreaming: false,
      activeSkills: [],
      streamError: null,
      retryCount: 0,
    })
    vi.restoreAllMocks()
  })

  it('TC-010: setStreaming(false) + streamError set correctly on stream interrupt', () => {
    useChatStore.setState({ isStreaming: true })
    useChatStore.getState().appendChunk({ type: 'error', message: 'Network reset' })

    const state = useChatStore.getState()
    expect(state.isStreaming).toBe(false)
    expect(state.streamError).not.toBeNull()
    expect(state.streamError?.message).toBe('Network reset')
  })

  it('TC-011: retryLastMessage increments retryCount and re-sends last user message', () => {
    const sendMessageSpy = vi.fn().mockResolvedValue(undefined)

    useChatStore.setState({
      sendMessage: sendMessageSpy,
      messages: [{ id: '1', role: 'user', content: 'test message', createdAt: new Date() }],
      retryCount: 0,
    })

    useChatStore.getState().retryLastMessage()

    const state = useChatStore.getState()
    expect(state.retryCount).toBe(1)
    expect(sendMessageSpy).toHaveBeenCalledWith('test message')
  })
})
