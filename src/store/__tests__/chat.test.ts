import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from '../chat';

describe('useChatStore', () => {
  let sendMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      conversationId: null,
      isStreaming: false,
      activeSkills: [],
      streamError: null,
      retryCount: 0,
    });
    vi.restoreAllMocks();
  });

  it('should have correct initial state', () => {
    const state = useChatStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.conversationId).toBeNull();
    expect(state.isStreaming).toBe(false);
    expect(state.activeSkills).toEqual([]);
    expect(state.streamError).toBeNull();
    expect(state.retryCount).toBe(0);
  });

  describe('sendMessage', () => {
    it('should add user message and set streaming state', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: new ReadableStream({
          start(controller) { controller.close(); }
        }),
      });

      const promise = useChatStore.getState().sendMessage('Hello AI');

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].role).toBe('user');
      expect(state.messages[0].content).toBe('Hello AI');
      expect(state.isStreaming).toBe(true);
      expect(state.streamError).toBeNull();

      await promise;

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/chat/stream',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Hello AI', conversationId: null }),
        })
      );
    });

    it('should handle fetch errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('API Error'),
      });

      await useChatStore.getState().sendMessage('Hello AI');

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).toBeInstanceOf(Error);
      expect(state.streamError?.message).toBe('API Error');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

      await useChatStore.getState().sendMessage('Hello AI');

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).toBeInstanceOf(Error);
      expect(state.streamError?.message).toBe('Network Error');
    });
  });

  describe('appendChunk', () => {
    it('should append text chunk and create assistant message if none exists', () => {
      useChatStore.getState().appendChunk({ type: 'text', content: 'Hi ' });

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].role).toBe('assistant');
      expect(state.messages[0].content).toBe('Hi ');
    });

    it('should append text chunk to existing assistant message', () => {
      useChatStore.getState().appendChunk({ type: 'text', content: 'Hi ' });
      useChatStore.getState().appendChunk({ type: 'text', content: 'there!' });

      const state = useChatStore.getState();
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].role).toBe('assistant');
      expect(state.messages[0].content).toBe('Hi there!');
    });

    it('should append tool_call chunk to activeSkills', () => {
      useChatStore.getState().appendChunk({ type: 'tool_call', skill: 'SearchSkill', params: {} });

      const state = useChatStore.getState();
      expect(state.activeSkills).toContain('SearchSkill');

      // Should not add duplicates
      useChatStore.getState().appendChunk({ type: 'tool_call', skill: 'SearchSkill', params: {} });
      expect(useChatStore.getState().activeSkills).toHaveLength(1);
    });

    it('should append tool_result chunk', () => {
      useChatStore.setState({
        messages: [{ id: '1', role: 'assistant', content: '', createdAt: new Date() }],
      });

      useChatStore.getState().appendChunk({
        type: 'tool_result',
        component: 'WeatherComponent',
        props: { temp: 25 },
      });

      const state = useChatStore.getState();
      expect(state.messages[0].toolCalls).toHaveLength(1);
      expect(state.messages[0].toolCalls?.[0].name).toBe('WeatherComponent');
      expect(state.messages[0].toolCalls?.[0].arguments).toEqual({
        type: 'tool_result',
        component: 'WeatherComponent',
        props: { temp: 25 },
      });
    });

    it('should handle error chunk', () => {
      useChatStore.setState({ isStreaming: true });
      useChatStore.getState().appendChunk({ type: 'error', message: 'Stream failed' });

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).toBeInstanceOf(Error);
      expect(state.streamError?.message).toBe('Stream failed');
    });

    it('should handle done chunk', () => {
      useChatStore.setState({ isStreaming: true });
      useChatStore.getState().appendChunk({ type: 'done' });

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
    });
  });

  describe('other actions', () => {
    it('should setStreaming', () => {
      useChatStore.getState().setStreaming(true);
      expect(useChatStore.getState().isStreaming).toBe(true);
    });

    it('should setActiveSkills', () => {
      useChatStore.getState().setActiveSkills(['skill1', 'skill2']);
      expect(useChatStore.getState().activeSkills).toEqual(['skill1', 'skill2']);
    });

    it('should clearError', () => {
      useChatStore.setState({ streamError: new Error('test'), retryCount: 2 });
      useChatStore.getState().clearError();

      const state = useChatStore.getState();
      expect(state.streamError).toBeNull();
      expect(state.retryCount).toBe(0);
    });

    it('should resetConversation', () => {
      useChatStore.setState({
        messages: [{ id: '1', role: 'user', content: 'test', createdAt: new Date() }],
        conversationId: '123',
      });
      useChatStore.getState().resetConversation();

      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
      expect(state.conversationId).toBeNull();
    });

    it('should retryLastMessage', () => {
      sendMessageSpy = vi.fn().mockImplementation(async () => {});
      useChatStore.setState({ sendMessage: sendMessageSpy });

      useChatStore.setState({
        messages: [
          { id: '1', role: 'user', content: 'first', createdAt: new Date() },
          { id: '2', role: 'assistant', content: 'reply', createdAt: new Date() },
          { id: '3', role: 'user', content: 'last message', createdAt: new Date() },
        ],
        retryCount: 0,
      });

      useChatStore.getState().retryLastMessage();

      const state = useChatStore.getState();
      expect(state.retryCount).toBe(1);
      expect(sendMessageSpy).toHaveBeenCalledWith('last message');
    });

    it('should not retryLastMessage if no user message exists', () => {
      sendMessageSpy = vi.fn().mockImplementation(async () => {});
      useChatStore.setState({ sendMessage: sendMessageSpy });

      useChatStore.setState({
        messages: [
          { id: '1', role: 'assistant', content: 'hi', createdAt: new Date() },
        ],
        retryCount: 0,
      });

      useChatStore.getState().retryLastMessage();

      const state = useChatStore.getState();
      expect(state.retryCount).toBe(0);
      expect(sendMessageSpy).not.toHaveBeenCalled();
    });
  });
});
