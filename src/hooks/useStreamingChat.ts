import { useChat } from '@ai-sdk/react';
import { useChatStore } from '@/store/chat';
import { useCallback, useRef, useState } from 'react';

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

export function useStreamingChat() {
  const {
    messages: storeMessages,
    isStreaming: storeLoading,
    setStreaming,
    activeSkills
  } = useChatStore();
  const retryCountRef = useRef(0);
  const [hasInterruptionError, setHasInterruptionError] = useState(false);

  const chatHelpers = useChat({
    api: '/api/v1/chat/stream',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialMessages: storeMessages as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onResponse: (response: any) => {
      if (response.ok) {
        retryCountRef.current = 0;
        setHasInterruptionError(false);
      }
    },
    onFinish: () => {
      setStreaming(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error('Chat stream interrupted:', err);
      setStreaming(false);
      setHasInterruptionError(true);
      handleStreamWithFallback();
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading: aiIsLoading,
    error,
    reload,
    stop,
    append,
    setMessages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = chatHelpers as any;

  const handleStreamWithFallback = useCallback(() => {
    if (retryCountRef.current >= MAX_RETRIES) {
      console.warn('Max retries reached. Stream interruption fallback failed.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMessages((prev: any[]) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            {
               ...lastMsg,
               content: lastMsg.content + '\n\n[⚠️ 回應不完整]',
            }
          ];
        }
        return prev;
      });
      return;
    }

    const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, retryCountRef.current);
    retryCountRef.current += 1;

    console.log(`Retrying connection in ${backoffMs}ms... (Attempt ${retryCountRef.current}/${MAX_RETRIES})`);

    setTimeout(() => {
      setStreaming(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reload().catch((reloadErr: any) => {
         console.error('Retry failed:', reloadErr);
      });
    }, backoffMs);
  }, [reload, setStreaming, setMessages]);

  const handleSubmit = useCallback(
    (message: string) => {
      if (!message.trim() || storeLoading) return;

      setHasInterruptionError(false);
      retryCountRef.current = 0;
      setStreaming(true);

      try {
        append({ role: 'user', content: message });
        originalHandleSubmit(undefined, { data: { message } });
      } catch (submitErr) {
         console.error('Submit error:', submitErr);
         setStreaming(false);
      }
    },
    [storeLoading, setStreaming, append, originalHandleSubmit]
  );

  const handleManualRetry = useCallback(() => {
     setHasInterruptionError(false);
     retryCountRef.current = 0;
     setStreaming(true);
     reload();
  }, [reload, setStreaming]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: aiIsLoading || storeLoading,
    isStreaming: aiIsLoading || storeLoading,
    sendMessage: (content: string) => append({ role: 'user', content }),
    activeSkills,
    error,
    hasInterruptionError,
    handleManualRetry,
    stop,
    append,
    setMessages
  };
}
