import { useChat } from '@ai-sdk/react';
import type { UseChatOptions, UseChatHelpers } from '@ai-sdk/react';
import { useChatStore } from '@/store/chat';
import type { UIMessage as StoreUIMessage } from '@/store/chat';
import type { UIMessage } from 'ai';
import { useCallback, useRef, useState } from 'react';

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

export function useStreamingChat() {
  const {
    messages: storeMessages,
    isStreaming: storeLoading,
    setStreaming,
    sendMessage,
    activeSkills
  } = useChatStore();

  const retryCountRef = useRef(0);
  const [hasInterruptionError, setHasInterruptionError] = useState(false);

  const chatHelpers = useChat({
    api: '/api/v1/chat/stream',
    initialMessages: storeMessages as unknown as UIMessage[],
    onResponse: (response: Response) => {
      if (response.ok) {
        retryCountRef.current = 0;
        setHasInterruptionError(false);
      }
    },
    onFinish: () => {
      setStreaming(false);
    },
    onError: (err: Error) => {
      console.error('Chat stream interrupted:', err);
      setStreaming(false);
      setHasInterruptionError(true);
      handleStreamWithFallback();
    }
  } as UseChatOptions<any>) as unknown as UseChatHelpers<any>;

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
  } = chatHelpers as unknown as {
    messages: UIMessage[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: Error | undefined;
    reload: () => Promise<string | null | undefined>;
    stop: () => void;
    append: (message: any) => Promise<string | null | undefined>;
    setMessages: (messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void;
  };

  const handleStreamWithFallback = useCallback(() => {
    if (retryCountRef.current >= MAX_RETRIES) {
      console.warn('Max retries reached. Stream interruption fallback failed.');
      // FA-04: Show [⚠️ 回應不完整] marker on the last assistant message
      setMessages((prev: UIMessage[]) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            {
               ...lastMsg,
               content: typeof (lastMsg as any).content === 'string' ? (lastMsg as any).content + '\n\n[⚠️ 回應不完整]' : (lastMsg as any).content,
            }
          ] as unknown as UIMessage[];
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
      reload().catch((reloadErr: Error) => {
         console.error('Retry failed:', reloadErr);
      });
    }, backoffMs);
  }, [reload, setStreaming, setMessages]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!input.trim() || storeLoading) return;

      setHasInterruptionError(false);
      retryCountRef.current = 0;
      setStreaming(true);

      try {
        originalHandleSubmit(e);
      } catch (submitErr) {
         console.error('Submit error:', submitErr);
         setStreaming(false);
      }
    },
    [input, storeLoading, setStreaming, originalHandleSubmit]
  );

  const handleManualRetry = useCallback(() => {
     setHasInterruptionError(false);
     retryCountRef.current = 0;
     setStreaming(true);
     reload();
  }, [reload, setStreaming]);

  return {
    messages: messages as unknown as StoreUIMessage[],
    input,
    handleInputChange,
    handleSubmit,
    isLoading: aiIsLoading || storeLoading,
    isStreaming: aiIsLoading || storeLoading,
    sendMessage,
    activeSkills,
    error,
    hasInterruptionError,
    handleManualRetry,
    stop,
    append,
    setMessages
  };
}
