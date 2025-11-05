export type Ruleset = 'COC' | 'DND';

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type JudgmentType = 
  | 'critical-success'
  | 'success'
  | 'failure'
  | 'critical-failure'
  | 'neutral';

export interface DiceRoll {
  id: string;
  timestamp: number;
  ruleset: Ruleset;
  dieType: DieType;
  numberOfDice: number;
  rolls: number[];
  total: number;
  targetValue?: number;
  judgment: JudgmentType;
}
