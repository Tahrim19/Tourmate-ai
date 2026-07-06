import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught rendering exception:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="bg-[#1a1a1a] border border-[#252525] rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
            
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-[#a3a3a3] text-sm mb-6">
              An unexpected layout crash occurred. You can attempt to refresh the app or clear memory and start fresh.
            </p>

            {this.state.error && (
              <div className="bg-black/50 text-red-400 font-mono text-xs text-left p-3 rounded-lg overflow-auto max-h-32 mb-6 border border-white/5">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent-teal hover:bg-accent-teal-light text-white font-medium transition duration-200"
              >
                <RefreshCw size={16} />
                Refresh Screen
              </button>
              <button
                onClick={this.handleReset}
                className="w-full text-xs text-[#a3a3a3] hover:text-[#f5f5f5] py-2 transition"
              >
                Clear Saved Session & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
