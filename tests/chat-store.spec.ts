import { test, expect } from '@playwright/test';
import { useChatStore } from '../src/store/chat';

/**
 * Playwright-based error-path tests for useChatStore.sendMessage.
 * These complement the vitest unit tests in tests/store/chat.store.test.ts.
 * They test the fetch boundary: HTTP error responses and network exceptions.
 */
test.describe('useChatStore — stream error paths', () => {
  const initialStoreState = useChatStore.getState();

  test.beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState(initialStoreState, true);
  });

  test('sendMessage sets streamError correctly when fetch returns !ok response', async () => {
    const originalFetch = global.fetch;
    const errorMessage = 'Internal Server Error';

    global.fetch = async () =>
      ({ ok: false, text: async () => errorMessage } as Response);

    try {
      await useChatStore.getState().sendMessage('test message');

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).not.toBeNull();
      expect(state.streamError).toBeInstanceOf(Error);
      expect(state.streamError?.message).toBe(errorMessage);
      expect(state.messages.length).toBe(1);
      expect(state.messages[0].content).toBe('test message');
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('sendMessage sets streamError correctly when fetch throws a network exception', async () => {
    const originalFetch = global.fetch;
    const networkError = new Error('Network Error');

    global.fetch = async () => { throw networkError; };

    try {
      await useChatStore.getState().sendMessage('test message 2');

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).toBe(networkError);
    } finally {
      global.fetch = originalFetch;
    }
  });
});
