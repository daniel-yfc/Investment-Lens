import { UIMessage } from '@ai-sdk/react';
import { AnalysisResultCard } from '../analysis/AnalysisResultCard';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

interface MessageFeedProps {
  messages: UIMessage[];
  isLoading: boolean;
  hasInterruptionError: boolean;
  onManualRetry: () => void;
}

export function MessageFeed({ messages, isLoading, hasInterruptionError, onManualRetry }: MessageFeedProps) {
  return (
    <ScrollArea className="flex-1 w-full px-4 py-6">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-32">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>

              {/* Tool Invocations Rendering */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {message.toolInvocations?.map((toolInvocation: any) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;
                  if (toolName === 'analyze_security') {
                    return (
                      <div key={toolCallId} className="mt-4">
                        <AnalysisResultCard result={result} />
                      </div>
                    );
                  }

                  if (toolName === 'update_quote') {
                    return (
                      <div key={toolCallId} className="mt-4 p-4 rounded-md border bg-background text-foreground text-sm">
                        ✅ Portfolio quotes updated. New base value: {result.newTotalValueBase} {result.currencyBase}
                      </div>
                    );
                  }
                } else {
                  return (
                    <div key={toolCallId} className="mt-4 p-4 rounded-md border bg-background/50 text-muted-foreground text-sm italic">
                      Running {toolName}...
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted animate-pulse text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}

        {hasInterruptionError && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Connection interrupted.</span>
              <Button size="sm" variant="outline" className="ml-2 h-7" onClick={onManualRetry}>
                重試
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
