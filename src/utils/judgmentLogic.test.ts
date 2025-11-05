import { describe, it, expect } from 'vitest';
import { calculateJudgment } from './judgmentLogic';

describe('calculateJudgment - COC Ruleset', () => {
  describe('Critical Success', () => {
    it('should return critical-success for roll of 1', () => {
      expect(calculateJudgment('COC', 1, 50, 'd100')).toBe('critical-success');
      expect(calculateJudgment('COC', 1, 100, 'd100')).toBe('critical-success');
      expect(calculateJudgment('COC', 1, 25, 'd100')).toBe('critical-success');
    });
  });

  describe('Extreme Success', () => {
    it('should return extreme-success for rolls <= targetValue/5', () => {
      expect(calculateJudgment('COC', 10, 50, 'd100')).toBe('extreme-success');
      expect(calculateJudgment('COC', 5, 50, 'd100')).toBe('extreme-success');
      expect(calculateJudgment('COC', 20, 100, 'd100')).toBe('extreme-success');
      expect(calculateJudgment('COC', 2, 25, 'd100')).toBe('extreme-success');
    });

    it('should handle boundary at targetValue/5', () => {
      expect(calculateJudgment('COC', 10, 50, 'd100')).toBe('extreme-success');
      expect(calculateJudgment('COC', 11, 50, 'd100')).not.toBe('extreme-success');
      expect(calculateJudgment('COC', 5, 25, 'd100')).toBe('extreme-success');
      expect(calculateJudgment('COC', 6, 25, 'd100')).not.toBe('extreme-success');
    });
  });

  describe('Hard Success', () => {
    it('should return hard-success for rolls <= targetValue/2 but > targetValue/5', () => {
      expect(calculateJudgment('COC', 15, 50, 'd100')).toBe('hard-success');
      expect(calculateJudgment('COC', 25, 50, 'd100')).toBe('hard-success');
      expect(calculateJudgment('COC', 40, 100, 'd100')).toBe('hard-success');
      expect(calculateJudgment('COC', 10, 25, 'd100')).toBe('hard-success');
    });

    it('should handle boundary at targetValue/2', () => {
      expect(calculateJudgment('COC', 25, 50, 'd100')).toBe('hard-success');
      expect(calculateJudgment('COC', 26, 50, 'd100')).not.toBe('hard-success');
      expect(calculateJudgment('COC', 12, 25, 'd100')).toBe('hard-success');
      expect(calculateJudgment('COC', 13, 25, 'd100')).not.toBe('hard-success');
    });
  });

  describe('Regular Success', () => {
    it('should return success for rolls <= targetValue but > targetValue/2', () => {
      expect(calculateJudgment('COC', 30, 50, 'd100')).toBe('success');
      expect(calculateJudgment('COC', 50, 50, 'd100')).toBe('success');
      expect(calculateJudgment('COC', 75, 100, 'd100')).toBe('success');
      expect(calculateJudgment('COC', 20, 25, 'd100')).toBe('success');
    });

    it('should handle boundary at targetValue', () => {
      expect(calculateJudgment('COC', 50, 50, 'd100')).toBe('success');
      expect(calculateJudgment('COC', 51, 50, 'd100')).not.toBe('success');
      expect(calculateJudgment('COC', 25, 25, 'd100')).toBe('success');
      expect(calculateJudgment('COC', 26, 25, 'd100')).not.toBe('success');
    });
  });

  describe('Critical Failure', () => {
    it('should return critical-failure for roll of 100', () => {
      expect(calculateJudgment('COC', 100, 50, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('COC', 100, 95, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('COC', 100, 25, 'd100')).toBe('critical-failure');
    });

    it('should return critical-failure for rolls >= 96 when > targetValue', () => {
      expect(calculateJudgment('COC', 96, 50, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('COC', 97, 50, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('COC', 98, 50, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('COC', 99, 50, 'd100')).toBe('critical-failure');
    });
  });

  describe('Regular Failure', () => {
    it('should return failure for rolls > targetValue but < 96', () => {
      expect(calculateJudgment('COC', 51, 50, 'd100')).toBe('failure');
      expect(calculateJudgment('COC', 75, 50, 'd100')).toBe('failure');
      expect(calculateJudgment('COC', 95, 50, 'd100')).toBe('failure');
      expect(calculateJudgment('COC', 26, 25, 'd100')).toBe('failure');
    });

    it('should handle boundary at 95', () => {
      expect(calculateJudgment('COC', 95, 50, 'd100')).toBe('failure');
      expect(calculateJudgment('COC', 96, 50, 'd100')).toBe('critical-failure');
    });
  });
});

describe('calculateJudgment - DND Ruleset', () => {
  describe('Critical Success', () => {
    it('should return critical-success for maximum dice value', () => {
      expect(calculateJudgment('DND', 20, 15, 'd20')).toBe('critical-success');
      expect(calculateJudgment('DND', 100, 50, 'd100')).toBe('critical-success');
      expect(calculateJudgment('DND', 6, 4, 'd6')).toBe('critical-success');
      expect(calculateJudgment('DND', 8, 5, 'd8')).toBe('critical-success');
      expect(calculateJudgment('DND', 10, 6, 'd10')).toBe('critical-success');
      expect(calculateJudgment('DND', 12, 7, 'd12')).toBe('critical-success');
    });
  });

  describe('Critical Failure', () => {
    it('should return critical-failure for roll of 1', () => {
      expect(calculateJudgment('DND', 1, 15, 'd20')).toBe('critical-failure');
      expect(calculateJudgment('DND', 1, 50, 'd100')).toBe('critical-failure');
      expect(calculateJudgment('DND', 1, 4, 'd6')).toBe('critical-failure');
      expect(calculateJudgment('DND', 1, 5, 'd8')).toBe('critical-failure');
      expect(calculateJudgment('DND', 1, 6, 'd10')).toBe('critical-failure');
      expect(calculateJudgment('DND', 1, 7, 'd12')).toBe('critical-failure');
    });
  });

  describe('Regular Success', () => {
    it('should return success for rolls >= targetValue (but not max)', () => {
      expect(calculateJudgment('DND', 15, 15, 'd20')).toBe('success');
      expect(calculateJudgment('DND', 16, 15, 'd20')).toBe('success');
      expect(calculateJudgment('DND', 19, 15, 'd20')).toBe('success');
      expect(calculateJudgment('DND', 50, 50, 'd100')).toBe('success');
      expect(calculateJudgment('DND', 75, 50, 'd100')).toBe('success');
    });

    it('should handle boundary at targetValue', () => {
      expect(calculateJudgment('DND', 15, 15, 'd20')).toBe('success');
      expect(calculateJudgment('DND', 14, 15, 'd20')).not.toBe('success');
      expect(calculateJudgment('DND', 10, 10, 'd20')).toBe('success');
      expect(calculateJudgment('DND', 9, 10, 'd20')).not.toBe('success');
    });
  });

  describe('Regular Failure', () => {
    it('should return failure for rolls < targetValue (but not 1)', () => {
      expect(calculateJudgment('DND', 10, 15, 'd20')).toBe('failure');
      expect(calculateJudgment('DND', 14, 15, 'd20')).toBe('failure');
      expect(calculateJudgment('DND', 2, 15, 'd20')).toBe('failure');
      expect(calculateJudgment('DND', 40, 50, 'd100')).toBe('failure');
    });
  });

  describe('Different Dice Types', () => {
    it('should handle d6 correctly', () => {
      expect(calculateJudgment('DND', 6, 4, 'd6')).toBe('critical-success');
      expect(calculateJudgment('DND', 5, 4, 'd6')).toBe('success');
      expect(calculateJudgment('DND', 4, 4, 'd6')).toBe('success');
      expect(calculateJudgment('DND', 3, 4, 'd6')).toBe('failure');
      expect(calculateJudgment('DND', 1, 4, 'd6')).toBe('critical-failure');
    });

    it('should handle d8 correctly', () => {
      expect(calculateJudgment('DND', 8, 5, 'd8')).toBe('critical-success');
      expect(calculateJudgment('DND', 7, 5, 'd8')).toBe('success');
      expect(calculateJudgment('DND', 5, 5, 'd8')).toBe('success');
      expect(calculateJudgment('DND', 4, 5, 'd8')).toBe('failure');
      expect(calculateJudgment('DND', 1, 5, 'd8')).toBe('critical-failure');
    });

    it('should handle d10 correctly', () => {
      expect(calculateJudgment('DND', 10, 6, 'd10')).toBe('critical-success');
      expect(calculateJudgment('DND', 9, 6, 'd10')).toBe('success');
      expect(calculateJudgment('DND', 6, 6, 'd10')).toBe('success');
      expect(calculateJudgment('DND', 5, 6, 'd10')).toBe('failure');
      expect(calculateJudgment('DND', 1, 6, 'd10')).toBe('critical-failure');
    });

    it('should handle d12 correctly', () => {
      expect(calculateJudgment('DND', 12, 7, 'd12')).toBe('critical-success');
      expect(calculateJudgment('DND', 11, 7, 'd12')).toBe('success');
      expect(calculateJudgment('DND', 7, 7, 'd12')).toBe('success');
      expect(calculateJudgment('DND', 6, 7, 'd12')).toBe('failure');
      expect(calculateJudgment('DND', 1, 7, 'd12')).toBe('critical-failure');
    });

    it('should handle d100 correctly', () => {
      expect(calculateJudgment('DND', 100, 50, 'd100')).toBe('critical-success');
      expect(calculateJudgment('DND', 99, 50, 'd100')).toBe('success');
      expect(calculateJudgment('DND', 50, 50, 'd100')).toBe('success');
      expect(calculateJudgment('DND', 49, 50, 'd100')).toBe('failure');
      expect(calculateJudgment('DND', 1, 50, 'd100')).toBe('critical-failure');
    });
  });
});
