export type Operator = '+' | '−' | '×' | '÷';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}
