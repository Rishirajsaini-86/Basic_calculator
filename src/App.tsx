import { useState, useEffect, useCallback, useRef } from 'react';
import { Operator, HistoryItem } from './types';
import { calculate, sanitizeNumber } from './utils/calculator';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { CalculationHistory } from './components/CalculationHistory';
import { Volume2, VolumeX, Keyboard } from 'lucide-react';

export default function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle acoustic click feedback using Web Audio API
  const playClickSound = useCallback(
    (type: 'digit' | 'op' | 'equals' | 'clear' = 'digit') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        let freq = 600;
        let duration = 0.035;

        if (type === 'digit') {
          freq = 520;
          duration = 0.025;
        } else if (type === 'op') {
          freq = 740;
          duration = 0.04;
        } else if (type === 'equals') {
          freq = 880;
          duration = 0.06;
        } else if (type === 'clear') {
          freq = 380;
          duration = 0.045;
        }

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext not allowed or failed
      }
    },
    [soundEnabled]
  );

  const handleClear = useCallback(() => {
    playClickSound('clear');
    setDisplayValue('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
    setIsError(false);
  }, [playClickSound]);

  const handleDigit = useCallback(
    (digit: string) => {
      playClickSound('digit');
      if (isError) {
        setDisplayValue(digit);
        setIsError(false);
        setPrevValue(null);
        setOperator(null);
        setExpression('');
        return;
      }

      if (waitingForOperand) {
        setDisplayValue(digit);
        setWaitingForOperand(false);
      } else {
        if (displayValue === '0') {
          setDisplayValue(digit);
        } else if (displayValue.length < 16) {
          setDisplayValue(displayValue + digit);
        }
      }
    },
    [displayValue, isError, waitingForOperand, playClickSound]
  );

  const handleDecimal = useCallback(() => {
    playClickSound('digit');
    if (isError) {
      setDisplayValue('0.');
      setIsError(false);
      setPrevValue(null);
      setOperator(null);
      setExpression('');
      return;
    }

    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, isError, waitingForOperand, playClickSound]);

  const handleToggleSign = useCallback(() => {
    playClickSound('op');
    if (isError || displayValue === '0') return;

    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  }, [displayValue, isError, playClickSound]);

  const handleBackspace = useCallback(() => {
    playClickSound('clear');
    if (isError) {
      handleClear();
      return;
    }

    if (waitingForOperand) return;

    if (
      displayValue.length === 1 ||
      (displayValue.length === 2 && displayValue.startsWith('-'))
    ) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  }, [displayValue, isError, waitingForOperand, handleClear, playClickSound]);

  const handlePercentage = useCallback(() => {
    playClickSound('op');
    if (isError) return;

    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    if (prevValue !== null && operator) {
      // Calculate percentage of prevValue
      const percentVal = sanitizeNumber((prevValue * current) / 100);
      setDisplayValue(String(percentVal));
    } else {
      const result = sanitizeNumber(current / 100);
      setDisplayValue(String(result));
    }
  }, [displayValue, isError, operator, prevValue, playClickSound]);

  const handleOperator = useCallback(
    (nextOperator: Operator) => {
      playClickSound('op');
      const inputValue = parseFloat(displayValue);

      if (isError) {
        setIsError(false);
      }

      if (prevValue === null) {
        setPrevValue(inputValue);
        setExpression(`${inputValue} ${nextOperator}`);
      } else if (operator && !waitingForOperand) {
        const { result, error } = calculate(prevValue, inputValue, operator);
        if (error || result === null) {
          setIsError(true);
          setDisplayValue(error || 'Error');
          setPrevValue(null);
          setOperator(null);
          setExpression('');
          return;
        }

        setDisplayValue(String(result));
        setPrevValue(result);
        setExpression(`${result} ${nextOperator}`);
      } else {
        // Just switching operators
        setExpression(`${prevValue} ${nextOperator}`);
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [displayValue, isError, operator, prevValue, waitingForOperand, playClickSound]
  );

  const handleEquals = useCallback(() => {
    playClickSound('equals');
    if (isError || prevValue === null || !operator) return;

    const inputValue = parseFloat(displayValue);
    const fullExpr = `${prevValue} ${operator} ${inputValue}`;
    const { result, error } = calculate(prevValue, inputValue, operator);

    if (error || result === null) {
      setIsError(true);
      setDisplayValue(error || 'Error');
      setPrevValue(null);
      setOperator(null);
      setExpression('');
      return;
    }

    const resultStr = String(result);
    setDisplayValue(resultStr);
    setExpression(`${fullExpr} =`);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);

    // Save to calculation history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: fullExpr,
      result: resultStr,
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 24)]);
  }, [displayValue, isError, operator, prevValue, playClickSound]);

  const handleSelectHistoryResult = useCallback(
    (val: string) => {
      setDisplayValue(val);
      setWaitingForOperand(false);
      setIsError(false);
    },
    []
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser shortcuts for keys we handle
      if (
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
      ) {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div
        id="calculator-card"
        className="w-full max-w-[390px] sm:max-w-[420px] bg-neutral-900/90 rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 shadow-2xl border border-neutral-800 backdrop-blur-md transition-all"
      >
        {/* Top Header with title and subtle controls */}
        <header className="flex items-center justify-between pb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <h1 className="text-sm font-semibold tracking-wider text-neutral-300 uppercase">
              Calculator
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="sound-toggle-btn"
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute click sounds' : 'Enable click sounds'}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                soundEnabled
                  ? 'text-amber-400 hover:bg-neutral-800'
                  : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* Display Output Area */}
        <CalculatorDisplay
          expression={expression}
          displayValue={displayValue}
          isError={isError}
          historyCount={history.length}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory(!showHistory)}
        />

        {/* Calculation History Tape Drawer */}
        <CalculationHistory
          history={history}
          isOpen={showHistory}
          onSelectResult={handleSelectHistoryResult}
          onClearHistory={() => setHistory([])}
          onClose={() => setShowHistory(false)}
        />

        {/* Keypad Grid */}
        <CalculatorKeypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onPercentage={handlePercentage}
          onToggleSign={handleToggleSign}
          onDecimal={handleDecimal}
          activeOperator={operator}
        />

        {/* Subtle Keyboard Hint Footer */}
        <footer className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 px-1">
          <span className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-neutral-400" />
            <span>Numpad & keyboard shortcuts active</span>
          </span>
          <span className="font-mono text-neutral-400">Esc to Clear</span>
        </footer>
      </div>
    </main>
  );
}
