import React, { useState } from 'react';
import { Copy, Check, History } from 'lucide-react';
import { formatDisplayValue } from '../utils/calculator';

interface CalculatorDisplayProps {
  expression: string;
  displayValue: string;
  isError: boolean;
  historyCount: number;
  showHistory: boolean;
  onToggleHistory: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  displayValue,
  isError,
  historyCount,
  showHistory,
  onToggleHistory,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (isError || !displayValue) return;
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const formatted = formatDisplayValue(displayValue);

  // Dynamic font sizing based on length of the formatted string
  const getFontSizeClass = (len: number) => {
    if (len > 16) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 9) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  return (
    <div
      id="calculator-display"
      className="relative flex flex-col justify-end p-5 sm:p-6 bg-neutral-900 text-neutral-100 rounded-2xl sm:rounded-3xl border border-neutral-800 shadow-inner min-h-[160px] sm:min-h-[180px] overflow-hidden"
    >
      {/* Top Header Actions: History Toggle and Copy Button */}
      <div className="flex items-center justify-between gap-2 mb-2 text-neutral-400">
        <button
          id="toggle-history-btn"
          type="button"
          onClick={onToggleHistory}
          title={showHistory ? 'Hide calculation tape' : 'Show calculation tape'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            showHistory
              ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
              : 'hover:bg-neutral-800/70 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Tape</span>
          {historyCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-neutral-700 text-neutral-300 text-[10px] rounded-full">
              {historyCount}
            </span>
          )}
        </button>

        <button
          id="copy-result-btn"
          type="button"
          onClick={handleCopy}
          disabled={isError}
          title="Copy current value"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Expression / Formula Row */}
      <div
        id="calculator-expression"
        className="h-6 text-right text-xs sm:text-sm font-mono text-neutral-400 truncate tracking-wide"
      >
        {expression || <span className="opacity-0">0</span>}
      </div>

      {/* Main Value Display */}
      <div
        id="calculator-main-value"
        className={`text-right font-light tracking-tight transition-all duration-150 select-all font-mono leading-none py-1 truncate ${
          isError ? 'text-rose-400 text-2xl sm:text-3xl font-normal' : getFontSizeClass(formatted.length)
        }`}
      >
        {formatted}
      </div>
    </div>
  );
};
