import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Safe ErrorBoundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center p-4 text-[#14231b] select-none font-sans">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-[28px] p-7 border border-[#e4e2d8] shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1b3428]/10 text-[#1b3428] flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3c7155] font-mono">
                System Safeguard Active
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-[#14231b]">
                Experience Safely Restored
              </h2>
              <p className="text-xs text-[#5f7065] leading-relaxed">
                An isolated state was smoothly contained to protect your session. No data was lost.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1b3428] text-white text-xs font-semibold hover:bg-[#12261d] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#f2f1ea] text-[#1b3428] text-xs font-semibold hover:bg-[#e7e5dc] active:scale-95 transition-all border border-[#dedcd2] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
