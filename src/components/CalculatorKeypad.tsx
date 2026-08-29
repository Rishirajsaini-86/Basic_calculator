import React from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';
import { Operator } from '../types';

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onPercentage: () => void;
  onToggleSign: () => void;
  onDecimal: () => void;
  activeOperator: Operator | null;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onPercentage,
  onToggleSign,
  onDecimal,
  activeOperator,
}) => {
  const digitBtnClass =
    'h-14 sm:h-16 text-xl sm:text-2xl font-medium rounded-2xl bg-neutral-800 hover:bg-neutral-750 active:bg-neutral-700 text-neutral-100 border border-neutral-700/60 shadow-sm flex items-center justify-center cursor-pointer select-none transition-colors';

  const funcBtnClass =
    'h-14 sm:h-16 text-lg sm:text-xl font-medium rounded-2xl bg-neutral-700/80 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 border border-neutral-600/60 shadow-sm flex items-center justify-center cursor-pointer select-none transition-colors';

  const getOpBtnClass = (op: Operator) => {
    const isActive = activeOperator === op;
    return `h-14 sm:h-16 text-xl sm:text-2xl font-medium rounded-2xl shadow-sm flex items-center justify-center cursor-pointer select-none transition-all ${
      isActive
        ? 'bg-amber-400 text-neutral-950 font-semibold ring-2 ring-amber-300 ring-offset-2 ring-offset-neutral-900 shadow-amber-500/20'
        : 'bg-amber-600/90 hover:bg-amber-500 active:bg-amber-600 text-white border border-amber-500/50'
    }`;
  };

  return (
    <div id="calculator-keypad" className="grid grid-cols-4 gap-2.5 sm:gap-3 mt-4">
      {/* Row 1: AC, Backspace, %, ÷ */}
      <motion.button
        id="btn-clear"
        whileTap={{ scale: 0.94 }}
        onClick={onClear}
        className={`${funcBtnClass} text-rose-300 hover:text-rose-200`}
        aria-label="All Clear"
      >
        AC
      </motion.button>

      <motion.button
        id="btn-backspace"
        whileTap={{ scale: 0.94 }}
        onClick={onBackspace}
        className={funcBtnClass}
        aria-label="Backspace"
      >
        <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      <motion.button
        id="btn-percent"
        whileTap={{ scale: 0.94 }}
        onClick={onPercentage}
        className={funcBtnClass}
        aria-label="Percent"
      >
        %
      </motion.button>

      <motion.button
        id="btn-divide"
        whileTap={{ scale: 0.94 }}
        onClick={() => onOperator('÷')}
        className={getOpBtnClass('÷')}
        aria-label="Divide"
      >
        ÷
      </motion.button>

      {/* Row 2: 7, 8, 9, × */}
      <motion.button
        id="btn-digit-7"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('7')}
        className={digitBtnClass}
      >
        7
      </motion.button>

      <motion.button
        id="btn-digit-8"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('8')}
        className={digitBtnClass}
      >
        8
      </motion.button>

      <motion.button
        id="btn-digit-9"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('9')}
        className={digitBtnClass}
      >
        9
      </motion.button>

      <motion.button
        id="btn-multiply"
        whileTap={{ scale: 0.94 }}
        onClick={() => onOperator('×')}
        className={getOpBtnClass('×')}
        aria-label="Multiply"
      >
        ×
      </motion.button>

      {/* Row 3: 4, 5, 6, − */}
      <motion.button
        id="btn-digit-4"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('4')}
        className={digitBtnClass}
      >
        4
      </motion.button>

      <motion.button
        id="btn-digit-5"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('5')}
        className={digitBtnClass}
      >
        5
      </motion.button>

      <motion.button
        id="btn-digit-6"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('6')}
        className={digitBtnClass}
      >
        6
      </motion.button>

      <motion.button
        id="btn-subtract"
        whileTap={{ scale: 0.94 }}
        onClick={() => onOperator('−')}
        className={getOpBtnClass('−')}
        aria-label="Subtract"
      >
        −
      </motion.button>

      {/* Row 4: 1, 2, 3, + */}
      <motion.button
        id="btn-digit-1"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('1')}
        className={digitBtnClass}
      >
        1
      </motion.button>

      <motion.button
        id="btn-digit-2"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('2')}
        className={digitBtnClass}
      >
        2
      </motion.button>

      <motion.button
        id="btn-digit-3"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('3')}
        className={digitBtnClass}
      >
        3
      </motion.button>

      <motion.button
        id="btn-add"
        whileTap={{ scale: 0.94 }}
        onClick={() => onOperator('+')}
        className={getOpBtnClass('+')}
        aria-label="Add"
      >
        +
      </motion.button>

      {/* Row 5: +/-, 0, ., = */}
      <motion.button
        id="btn-toggle-sign"
        whileTap={{ scale: 0.94 }}
        onClick={onToggleSign}
        className={funcBtnClass}
        aria-label="Toggle Sign"
      >
        ±
      </motion.button>

      <motion.button
        id="btn-digit-0"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDigit('0')}
        className={digitBtnClass}
      >
        0
      </motion.button>

      <motion.button
        id="btn-decimal"
        whileTap={{ scale: 0.94 }}
        onClick={onDecimal}
        className={digitBtnClass}
        aria-label="Decimal point"
      >
        .
      </motion.button>

      <motion.button
        id="btn-equals"
        whileTap={{ scale: 0.94 }}
        onClick={onEquals}
        className="h-14 sm:h-16 text-2xl font-semibold rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 shadow-md shadow-amber-500/25 flex items-center justify-center cursor-pointer select-none transition-all"
        aria-label="Equals"
      >
        =
      </motion.button>
    </div>
  );
};
