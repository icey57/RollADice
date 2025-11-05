export type Ruleset = 'COC' | 'DND';

export type DiceSkin = 'default' | 'metal' | 'wood' | 'crystal';

export type DiceType = 'd20' | 'd100' | 'd6' | 'd8' | 'd10' | 'd12';

export interface RollOutcome {
  id: string;
  timestamp: number;
  ruleset: Ruleset;
  diceType: DiceType;
  rollValue: number;
  targetValue: number;
  judgment: ResultJudgment;
}

export type ResultJudgment = 
  | 'critical-success'
  | 'extreme-success'
  | 'hard-success'
  | 'success'
  | 'failure'
  | 'critical-failure';

export interface PendingRoll {
  id: string;
  timestamp: number;
  targetValue: number;
}

export interface DiceConfig {
  ruleset: Ruleset;
  diceSkin: DiceSkin;
  diceType: DiceType;
  rollCount: number;
  targetValue: number;
}

export interface RollHistory {
  rolls: RollOutcome[];
  totalRolls: number;
  successCount: number;
  failureCount: number;
}
