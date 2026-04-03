import { test, expect } from '@playwright/test';
import { useChatStore } from '../src/store/chat';

test.describe('useChatStore', () => {
  const initialStoreState = useChatStore.getState();

  test.beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState(initialStoreState, true);
  });

  test('sendMessage handles streamError correctly when fetch fails', async () => {
    // Mock fetch to simulate an error response
    const originalFetch = global.fetch;
    const errorMessage = 'Internal Server Error';

    global.fetch = async () => {
      return {
        ok: false,
        text: async () => errorMessage
      } as Response;
    };

    try {
      const store = useChatStore.getState();

      // Call the action
      await store.sendMessage('test message');

      // Verify state updates
      const updatedStore = useChatStore.getState();

      // isStreaming should be false after error
      expect(updatedStore.isStreaming).toBe(false);

      // streamError should be an Error object with the correct message
      expect(updatedStore.streamError).not.toBeNull();
      expect(updatedStore.streamError).toBeInstanceOf(Error);
      expect(updatedStore.streamError?.message).toBe(errorMessage);

      // message should still be appended
      expect(updatedStore.messages.length).toBe(1);
      expect(updatedStore.messages[0].content).toBe('test message');
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });

  test('sendMessage handles network exception correctly', async () => {
    // Mock fetch to simulate a network exception
    const originalFetch = global.fetch;
    const networkError = new Error('Network Error');

    global.fetch = async () => {
      throw networkError;
    };

    try {
      const store = useChatStore.getState();

      // Call the action
      await store.sendMessage('test message 2');

      // Verify state updates
      const updatedStore = useChatStore.getState();

      // isStreaming should be false after error
      expect(updatedStore.isStreaming).toBe(false);

      // streamError should be the thrown error
      expect(updatedStore.streamError).toBe(networkError);
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
});
