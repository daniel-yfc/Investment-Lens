import { FormEvent, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SendHorizonal, StopCircle } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStop: () => void;
}

export function ChatInput({ input, isLoading, onInputChange, onSubmit, onStop }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="max-w-3xl mx-auto w-full">
        <form
          onSubmit={onSubmit}
          className="relative flex items-center w-full shadow-sm"
        >
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask about a security, portfolio, or signal..."
            value={input}
            onChange={onInputChange}
            className="pr-12 py-6 text-base"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center">
            {isLoading ? (
              <Button type="button" size="icon" variant="ghost" onClick={onStop} className="h-8 w-8 text-destructive">
                <StopCircle className="h-5 w-5" />
                <span className="sr-only">Stop Generating</span>
              </Button>
            ) : (
              <Button type="submit" size="icon" disabled={!input.trim()} className="h-8 w-8">
                <SendHorizonal className="h-4 w-4" />
                <span className="sr-only">Send Message</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
