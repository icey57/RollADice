export type Rule = 'COC' | 'DND';

export interface DiceRoll {
  rule: Rule;
  value: number;
  targetValue?: number;
  result: 'critical-success' | 'success' | 'failure' | 'critical-failure' | 'value';
}

export interface RollResult {
  rule: Rule;
  rolls: number[];
  targetValue?: number;
  results: ('critical-success' | 'success' | 'failure' | 'critical-failure' | 'value')[];
  sum: number;
  max: number;
  min: number;
  timestamp: number;
}

export interface DiceSkin {
  id: string;
  name: string;
  type: 'builtin' | 'custom';
  imageUrl: string;
  colors?: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}
