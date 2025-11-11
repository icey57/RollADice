import { Rule, DiceRoll, RollResult } from '../types';

export const getMaxValue = (rule: Rule): number => {
  return rule === 'COC' ? 100 : 20;
};

export const getMinValue = (): number => {
  return 1;
};

export const rollDice = (rule: Rule): number => {
  const max = getMaxValue(rule);
  return Math.floor(Math.random() * max) + 1;
};

export const evaluateRoll = (
  value: number,
  rule: Rule,
  targetValue?: number
): DiceRoll['result'] => {
  const maxValue = getMaxValue(rule);

  if (targetValue === undefined) {
    if (value === maxValue) return 'critical-success';
    if (value === 1) return 'critical-failure';
    return 'value';
  }

  if (value >= targetValue) return 'success';
  return 'failure';
};

export const rollMultipleTimes = (
  rule: Rule,
  times: number,
  targetValue?: number
): RollResult => {
  const rolls: number[] = [];
  const results: DiceRoll['result'][] = [];

  for (let i = 0; i < times; i++) {
    const roll = rollDice(rule);
    rolls.push(roll);
    results.push(evaluateRoll(roll, rule, targetValue));
  }

  return {
    rule,
    rolls,
    targetValue,
    results,
    sum: rolls.reduce((a, b) => a + b, 0),
    max: Math.max(...rolls),
    min: Math.min(...rolls),
    timestamp: Date.now(),
  };
};

export const formatRollResult = (result: DiceRoll['result']): string => {
  switch (result) {
    case 'critical-success':
      return '大成功';
    case 'critical-failure':
      return '大失败';
    case 'success':
      return '成功';
    case 'failure':
      return '失败';
    default:
      return '结果';
  }
};

export const getResultColor = (result: DiceRoll['result']): string => {
  switch (result) {
    case 'critical-success':
      return '#10b981';
    case 'success':
      return '#3b82f6';
    case 'failure':
      return '#f97316';
    case 'critical-failure':
      return '#ef4444';
    default:
      return '#9ca3af';
  }
};
