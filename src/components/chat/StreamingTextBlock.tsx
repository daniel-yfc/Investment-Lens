"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface StreamingTextBlockProps {
  content: string;
  isGenerating?: boolean;
  className?: string;
}

export function StreamingTextBlock({ content, isGenerating, className }: StreamingTextBlockProps) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none break-words min-h-[24px]", className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={{
          // Tailwind prose doesn't always handle deeply nested lists well by default
          // Add custom component overrides if needed for specific Markdown features
          p: ({ children, ...props }) => (
            <p {...props} className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4 w-full">
              <table {...props} className="min-w-full divide-y divide-border border rounded-md">{children}</table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th {...props} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td {...props} className="px-3 py-2 whitespace-nowrap text-sm border-t">{children}</td>
          ),
        }}
      >
        {content || (isGenerating ? "..." : "")}
      </ReactMarkdown>

      {/* Render a blinking cursor if generation is ongoing */}
      {isGenerating && (
        <span className="inline-block w-2 h-4 bg-primary align-middle ml-1 animate-pulse" />
      )}
    </div>
  );
}
