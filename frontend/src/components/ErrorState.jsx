import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4 my-4 flex items-center justify-between gap-3 max-w-xl mx-auto shadow-lg animate-pulse">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-red-400 shrink-0" size={20} />
        <span className="text-xs sm:text-sm font-medium">{error}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-white text-xs font-semibold py-1.5 px-3 rounded-xl transition shrink-0"
        >
          <RotateCcw size={12} />
          Retry
        </button>
      )}
    </div>
  );
}
