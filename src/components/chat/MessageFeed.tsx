import { useEffect, useRef } from 'react';
import { type Message } from '@ai-sdk/ui-utils';
import { MessageBubble } from './MessageBubble';
import { AnimatePresence, motion } from 'framer-motion';

interface MessageFeedProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | undefined;
  reload: () => void;
}

export function MessageFeed({ messages, isLoading, error, reload }: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      // Smooth scroll to bottom when messages change
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble
                message={m}
                isGenerating={isLoading && index === messages.length - 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex justify-between items-center mb-4 mx-4 md:mx-6">
            <div>
              <span className="font-semibold mr-2">[⚠️ 回應不完整]</span>
              {error.message || '連線中斷'}
            </div>
            <button
              onClick={reload}
              className="px-3 py-1.5 bg-background border rounded-md hover:bg-muted font-medium"
            >
              重試
            </button>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
