import { type Message } from '@ai-sdk/ui-utils';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { StreamingTextBlock } from './StreamingTextBlock';
import { GenerativeErrorBoundary } from './GenerativeErrorBoundary';

interface MessageBubbleProps {
  message: Message;
  isGenerating?: boolean;
}

export function MessageBubble({ message, isGenerating }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-4 p-4 md:p-6 mb-4 rounded-xl border",
        isUser
          ? "bg-muted/50 border-muted"
          : "bg-background shadow-sm border-border"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex shrink-0 items-center justify-center w-8 h-8 rounded-full",
        isUser ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
      )}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-semibold text-sm opacity-80 mb-1">
          {isUser ? "You" : "AlphaEar Assistant"}
        </div>

        {/* Render text content if it exists */}
        {message.content && typeof message.content === 'string' && (
          <StreamingTextBlock
            content={message.content}
            isGenerating={isGenerating && message.role !== 'user'}
          />
        )}

        {/* Render tool calls if they exist */}
        {message.toolInvocations?.map(toolCall => {
            const toolInvocation = toolCall;
            const toolCallId = toolInvocation.toolCallId;
            const toolName = toolInvocation.toolName;

            // Note: In real implementation, these would map to Generative UI components
            return (
              <GenerativeErrorBoundary key={toolCallId}>
                 <div className="bg-muted border border-border rounded-lg p-3 text-sm my-2 font-mono">
                    <div className="font-semibold mb-1 text-muted-foreground">⚙️ Tool Call: {toolName}</div>
                    {'result' in toolInvocation ? (
                       <pre className="overflow-x-auto text-xs opacity-70">
                         {JSON.stringify(toolInvocation.result, null, 2)}
                       </pre>
                    ) : (
                       <div className="flex items-center gap-2 text-xs">
                         <span className="animate-spin inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
                         Running {toolName}...
                       </div>
                    )}
                 </div>
              </GenerativeErrorBoundary>
            )
        })}
      </div>
    </div>
  );
}
