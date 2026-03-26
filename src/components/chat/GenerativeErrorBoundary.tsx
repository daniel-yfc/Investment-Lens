"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GenerativeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Generative UI rendering error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive my-2 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">
              {this.props.fallbackMessage || "無法正確顯示此內容 (Rendering Error)"}
            </h4>
            <p className="text-destructive/80 text-xs mb-3 font-mono break-all line-clamp-2">
              {this.state.error?.message}
            </p>
            {this.props.onRetry && (
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-background px-2 py-1 rounded-md border shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RefreshCcw className="h-3 w-3" />
                重新嘗試 (Retry)
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
