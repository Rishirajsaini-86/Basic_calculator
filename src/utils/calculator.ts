import { Operator } from '../types';

/**
 * Normalizes floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
 */
export function sanitizeNumber(num: number): number {
  if (!isFinite(num) || isNaN(num)) return num;
  return parseFloat(num.toPrecision(12));
}

/**
 * Formats a number string with locale thousands separators while preserving decimals
 */
export function formatDisplayValue(val: string): string {
  if (!val || val === 'Error' || val === 'Cannot divide by zero') return val;
  
  // If in scientific notation
  if (val.includes('e') || val.includes('E')) {
    return val;
  }

  const isNegative = val.startsWith('-');
  const rawAbs = isNegative ? val.slice(1) : val;

  const parts = rawAbs.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : null;

  const formattedInt = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0';

  let result = (isNegative ? '-' : '') + formattedInt;
  if (decimalPart !== null) {
    result += '.' + decimalPart;
  }
  return result;
}

/**
 * Computes standard binary operations
 */
export function calculate(a: number, b: number, operator: Operator): { result: number | null; error?: string } {
  const cleanA = sanitizeNumber(a);
  const cleanB = sanitizeNumber(b);

  switch (operator) {
    case '+':
      return { result: sanitizeNumber(cleanA + cleanB) };
    case '−':
      return { result: sanitizeNumber(cleanA - cleanB) };
    case '×':
      return { result: sanitizeNumber(cleanA * cleanB) };
    case '÷':
      if (cleanB === 0) {
        return { result: null, error: 'Cannot divide by zero' };
      }
      return { result: sanitizeNumber(cleanA / cleanB) };
    default:
      return { result: cleanB };
  }
}
