import type { Ruleset, ResultJudgment, DiceType } from '../types/store';

export function calculateJudgment(
  ruleset: Ruleset,
  rollValue: number,
  targetValue: number,
  diceType: DiceType
): ResultJudgment {
  if (ruleset === 'COC') {
    return calculateCOCJudgment(rollValue, targetValue);
  } else {
    return calculateDNDJudgment(rollValue, targetValue, diceType);
  }
}

function calculateCOCJudgment(
  rollValue: number,
  targetValue: number
): ResultJudgment {
  if (rollValue === 1) {
    return 'critical-success';
  }
  
  if (rollValue === 100) {
    return 'critical-failure';
  }
  
  if (rollValue <= targetValue / 5) {
    return 'extreme-success';
  }
  
  if (rollValue <= targetValue / 2) {
    return 'hard-success';
  }
  
  if (rollValue <= targetValue) {
    return 'success';
  }
  
  if (rollValue >= 96) {
    return 'critical-failure';
  }
  
  return 'failure';
}

function calculateDNDJudgment(
  rollValue: number,
  targetValue: number,
  diceType: DiceType
): ResultJudgment {
  const maxValue = getDiceMaxValue(diceType);
  
  if (rollValue === maxValue) {
    return 'critical-success';
  }
  
  if (rollValue === 1) {
    return 'critical-failure';
  }
  
  if (rollValue >= targetValue) {
    return 'success';
  }
  
  return 'failure';
}

function getDiceMaxValue(diceType: DiceType): number {
  const maxValues: Record<DiceType, number> = {
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
    'd20': 20,
    'd100': 100,
  };
  
  return maxValues[diceType];
}
