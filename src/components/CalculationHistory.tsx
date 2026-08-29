import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculationHistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onSelectResult: (val: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  isOpen,
  onSelectResult,
  onClearHistory,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="calculation-tape-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 my-3 text-neutral-200 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs uppercase tracking-wider font-semibold text-neutral-400">
            <span>Calculation Tape</span>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  id="clear-tape-btn"
                  type="button"
                  onClick={onClearHistory}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                  title="Clear tape"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
              <button
                id="close-tape-btn"
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                title="Close tape"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            id="calculation-tape-list"
            className="max-h-48 overflow-y-auto space-y-2 py-2 pr-1 font-mono text-sm scrollbar-thin scrollbar-thumb-neutral-700"
          >
            {history.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-500 font-sans">
                No past calculations yet.
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  id={`history-item-${item.id}`}
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className="w-full text-right p-2 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-750 hover:border-neutral-600 transition-all cursor-pointer group"
                >
                  <div className="text-xs text-neutral-400 group-hover:text-neutral-300">
                    {item.expression} =
                  </div>
                  <div className="text-base font-medium text-amber-400 group-hover:text-amber-300">
                    {item.result}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
