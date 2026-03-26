import { useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading, stop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
         // Create a synthetic event
         const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
         handleSubmit(formEvent);
      }
    }
  };

  return (
    <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border z-10 sticky bottom-0 w-full">
      <div className="max-w-3xl mx-auto relative group">
        <form onSubmit={handleSubmit} className="relative flex items-end w-full group-focus-within:ring-2 group-focus-within:ring-primary/50 rounded-2xl">
          <textarea
            ref={textareaRef}
            name="message"
            placeholder="請輸入股票代碼或投資問題..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            className="w-full resize-none min-h-[56px] py-4 pl-4 pr-16 bg-muted/50 border border-muted-foreground/20 rounded-2xl focus:outline-none focus:ring-0 text-sm sm:text-base scrollbar-thin scrollbar-thumb-muted-foreground/20 dark:scrollbar-thumb-muted"
            rows={1}
          />
          <div className="absolute right-2 bottom-2">
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/50"
                title="Stop generating"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                    <span className="w-3 h-3 bg-current rounded-[2px]" />
                </div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                title="Send message"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-3 pb-1 max-w-3xl mx-auto">
        AlphaEar 提供的分析結果僅供參考，不構成投資建議。
      </div>
    </div>
  );
}
