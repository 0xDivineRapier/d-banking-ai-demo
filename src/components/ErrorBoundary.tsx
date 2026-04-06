import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="w-full h-full min-h-[60vh] flex items-center justify-center p-6 animate-in fade-in duration-700">
          <div className="relative glass-panel w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-10 md:p-14 rounded-3xl border border-destructive/20 text-center shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            {/* Ambient destructive glow backrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              <AlertTriangle size={40} className="animate-pulse" />
            </div>
            
            <h2 className="relative z-10 text-3xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              System Anomaly Detected
            </h2>
            <p className="relative z-10 text-muted-foreground/90 max-w-md mb-8 leading-relaxed">
              A critical operational invariant was breached while rendering this module. Sentinel AI has logged this telemetry trace.
            </p>
            
            <div className="relative z-10 w-full p-5 bg-card/50 dark:bg-black/40 rounded-xl text-left text-xs font-mono-banking text-muted-foreground overflow-auto shadow-inner border border-border/50 mb-10 max-h-48 scrollbar-thin">
              <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-foreground font-semibold">PANIC TRACE</span>
              </div>
              <code className="text-destructive/80 leading-relaxed whitespace-pre-wrap flex">
                {this.state.error?.stack || this.state.error?.message || 'Unknown panic state reached in render tree.'}
              </code>
            </div>
            
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="relative z-10 flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground rounded-full transition-all duration-300 font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCcw size={18} />
              Reboot Telemetry Context
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
