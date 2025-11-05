import type { Ruleset, DieType, JudgmentType, DiceRoll } from '../types/dice';

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function parseDieType(dieType: DieType): number {
  return parseInt(dieType.substring(1), 10);
}

export function calculateJudgment(
  rolls: number[],
  total: number,
  ruleset: Ruleset,
  targetValue?: number
): JudgmentType {
  if (ruleset === 'COC') {
    return calculateCOCJudgment(total, targetValue);
  } else if (ruleset === 'DND') {
    return calculateDNDJudgment(rolls, total, targetValue);
  }
  return 'neutral';
}

function calculateCOCJudgment(total: number, targetValue?: number): JudgmentType {
  if (total >= 1 && total <= 5) {
    return 'critical-success';
  }
  if (total >= 96 && total <= 100) {
    return 'critical-failure';
  }
  
  if (targetValue !== undefined) {
    return total <= targetValue ? 'success' : 'failure';
  }
  
  return 'neutral';
}

function calculateDNDJudgment(
  rolls: number[],
  total: number,
  targetValue?: number
): JudgmentType {
  if (rolls.length === 1 && rolls[0] === 20) {
    return 'critical-success';
  }
  if (rolls.length === 1 && rolls[0] === 1) {
    return 'critical-failure';
  }
  
  if (targetValue !== undefined) {
    return total >= targetValue ? 'success' : 'failure';
  }
  
  return 'neutral';
}

export function performDiceRoll(
  ruleset: Ruleset,
  dieType: DieType,
  numberOfDice: number,
  targetValue?: number
): DiceRoll {
  const sides = parseDieType(dieType);
  const rolls = Array.from({ length: numberOfDice }, () => rollDie(sides));
  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  const judgment = calculateJudgment(rolls, total, ruleset, targetValue);
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    ruleset,
    dieType,
    numberOfDice,
    rolls,
    total,
    targetValue,
    judgment,
  };
}
