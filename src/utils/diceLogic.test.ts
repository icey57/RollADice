import { describe, it, expect } from 'vitest';
import { rollDie, parseDieType, calculateJudgment, performDiceRoll } from './diceLogic';

describe('diceLogic', () => {
  describe('rollDie', () => {
    it('should return a number between 1 and the number of sides', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie(20);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(20);
      }
    });
  });

  describe('parseDieType', () => {
    it('should parse die type correctly', () => {
      expect(parseDieType('d4')).toBe(4);
      expect(parseDieType('d6')).toBe(6);
      expect(parseDieType('d8')).toBe(8);
      expect(parseDieType('d10')).toBe(10);
      expect(parseDieType('d12')).toBe(12);
      expect(parseDieType('d20')).toBe(20);
      expect(parseDieType('d100')).toBe(100);
    });
  });

  describe('calculateJudgment - COC ruleset', () => {
    it('should return critical-success for rolls 1-5', () => {
      expect(calculateJudgment([1], 1, 'COC')).toBe('critical-success');
      expect(calculateJudgment([3], 3, 'COC')).toBe('critical-success');
      expect(calculateJudgment([5], 5, 'COC')).toBe('critical-success');
    });

    it('should return critical-failure for rolls 96-100', () => {
      expect(calculateJudgment([96], 96, 'COC')).toBe('critical-failure');
      expect(calculateJudgment([98], 98, 'COC')).toBe('critical-failure');
      expect(calculateJudgment([100], 100, 'COC')).toBe('critical-failure');
    });

    it('should return success when roll is <= target value', () => {
      expect(calculateJudgment([50], 50, 'COC', 60)).toBe('success');
      expect(calculateJudgment([60], 60, 'COC', 60)).toBe('success');
    });

    it('should return failure when roll is > target value', () => {
      expect(calculateJudgment([70], 70, 'COC', 60)).toBe('failure');
      expect(calculateJudgment([61], 61, 'COC', 60)).toBe('failure');
    });

    it('should return neutral when no target value is provided and not a critical', () => {
      expect(calculateJudgment([50], 50, 'COC')).toBe('neutral');
      expect(calculateJudgment([15], 15, 'COC')).toBe('neutral');
    });

    it('should prioritize critical success over success with target', () => {
      expect(calculateJudgment([3], 3, 'COC', 50)).toBe('critical-success');
    });

    it('should prioritize critical failure over failure with target', () => {
      expect(calculateJudgment([99], 99, 'COC', 50)).toBe('critical-failure');
    });
  });

  describe('calculateJudgment - DND ruleset', () => {
    it('should return critical-success for natural 20', () => {
      expect(calculateJudgment([20], 20, 'DND')).toBe('critical-success');
    });

    it('should return critical-failure for natural 1', () => {
      expect(calculateJudgment([1], 1, 'DND')).toBe('critical-failure');
    });

    it('should not return critical for 20 on multiple dice', () => {
      expect(calculateJudgment([10, 10], 20, 'DND', 15)).toBe('success');
    });

    it('should not return critical for 1 on multiple dice', () => {
      expect(calculateJudgment([1, 0], 1, 'DND', 5)).toBe('failure');
    });

    it('should return success when roll is >= target value', () => {
      expect(calculateJudgment([15], 15, 'DND', 15)).toBe('success');
      expect(calculateJudgment([18], 18, 'DND', 15)).toBe('success');
    });

    it('should return failure when roll is < target value', () => {
      expect(calculateJudgment([10], 10, 'DND', 15)).toBe('failure');
      expect(calculateJudgment([14], 14, 'DND', 15)).toBe('failure');
    });

    it('should return neutral when no target value is provided and not a critical', () => {
      expect(calculateJudgment([15], 15, 'DND')).toBe('neutral');
      expect(calculateJudgment([10], 10, 'DND')).toBe('neutral');
    });

    it('should prioritize critical success over success with target', () => {
      expect(calculateJudgment([20], 20, 'DND', 15)).toBe('critical-success');
    });

    it('should prioritize critical failure over failure with target', () => {
      expect(calculateJudgment([1], 1, 'DND', 15)).toBe('critical-failure');
    });
  });

  describe('performDiceRoll', () => {
    it('should create a valid dice roll object', () => {
      const roll = performDiceRoll('DND', 'd20', 1, 15);
      
      expect(roll).toHaveProperty('id');
      expect(roll).toHaveProperty('timestamp');
      expect(roll.ruleset).toBe('DND');
      expect(roll.dieType).toBe('d20');
      expect(roll.numberOfDice).toBe(1);
      expect(roll.rolls).toHaveLength(1);
      expect(roll.rolls[0]).toBeGreaterThanOrEqual(1);
      expect(roll.rolls[0]).toBeLessThanOrEqual(20);
      expect(roll.total).toBe(roll.rolls[0]);
      expect(roll.targetValue).toBe(15);
      expect(roll.judgment).toBeDefined();
    });

    it('should handle multiple dice correctly', () => {
      const roll = performDiceRoll('DND', 'd6', 3);
      
      expect(roll.numberOfDice).toBe(3);
      expect(roll.rolls).toHaveLength(3);
      expect(roll.total).toBe(roll.rolls.reduce((sum, r) => sum + r, 0));
      
      roll.rolls.forEach(r => {
        expect(r).toBeGreaterThanOrEqual(1);
        expect(r).toBeLessThanOrEqual(6);
      });
    });

    it('should work without target value', () => {
      const roll = performDiceRoll('COC', 'd100', 1);
      
      expect(roll.targetValue).toBeUndefined();
      expect(roll.judgment).toBeDefined();
    });

    it('should generate unique IDs for different rolls', () => {
      const roll1 = performDiceRoll('DND', 'd20', 1);
      const roll2 = performDiceRoll('DND', 'd20', 1);
      
      expect(roll1.id).not.toBe(roll2.id);
    });
  });

  describe('Edge cases', () => {
    it('should handle COC boundary values correctly', () => {
      expect(calculateJudgment([5], 5, 'COC')).toBe('critical-success');
      expect(calculateJudgment([6], 6, 'COC')).toBe('neutral');
      expect(calculateJudgment([95], 95, 'COC')).toBe('neutral');
      expect(calculateJudgment([96], 96, 'COC')).toBe('critical-failure');
    });

    it('should handle DND with target value at boundary', () => {
      expect(calculateJudgment([15], 15, 'DND', 15)).toBe('success');
      expect(calculateJudgment([14], 14, 'DND', 15)).toBe('failure');
    });

    it('should handle COC with target value at boundary', () => {
      expect(calculateJudgment([15], 15, 'COC', 15)).toBe('success');
      expect(calculateJudgment([16], 16, 'COC', 15)).toBe('failure');
    });

    it('should handle multiple dice totaling to critical values in COC', () => {
      expect(calculateJudgment([1, 1], 2, 'COC')).toBe('critical-success');
      expect(calculateJudgment([50, 49], 99, 'COC')).toBe('critical-failure');
    });
  });
});
