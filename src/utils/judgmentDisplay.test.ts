import { describe, it, expect } from 'vitest';
import { getJudgmentDisplay } from './judgmentDisplay';

describe('judgmentDisplay', () => {
  describe('getJudgmentDisplay', () => {
    it('should return correct display for critical-success', () => {
      const display = getJudgmentDisplay('critical-success');
      
      expect(display.label).toBe('Critical Success');
      expect(display.color).toBe('text-green-400');
      expect(display.bgColor).toBe('bg-green-900/30');
      expect(display.borderColor).toBe('border-green-600');
      expect(display.icon).toBe('★');
    });

    it('should return correct display for success', () => {
      const display = getJudgmentDisplay('success');
      
      expect(display.label).toBe('Success');
      expect(display.color).toBe('text-green-300');
      expect(display.bgColor).toBe('bg-green-800/20');
      expect(display.borderColor).toBe('border-green-700');
      expect(display.icon).toBe('✓');
    });

    it('should return correct display for failure', () => {
      const display = getJudgmentDisplay('failure');
      
      expect(display.label).toBe('Failure');
      expect(display.color).toBe('text-red-300');
      expect(display.bgColor).toBe('bg-red-800/20');
      expect(display.borderColor).toBe('border-red-700');
      expect(display.icon).toBe('✗');
    });

    it('should return correct display for critical-failure', () => {
      const display = getJudgmentDisplay('critical-failure');
      
      expect(display.label).toBe('Critical Failure');
      expect(display.color).toBe('text-red-400');
      expect(display.bgColor).toBe('bg-red-900/30');
      expect(display.borderColor).toBe('border-red-600');
      expect(display.icon).toBe('☠');
    });

    it('should return correct display for neutral', () => {
      const display = getJudgmentDisplay('neutral');
      
      expect(display.label).toBe('Roll');
      expect(display.color).toBe('text-gray-300');
      expect(display.bgColor).toBe('bg-gray-800/20');
      expect(display.borderColor).toBe('border-gray-600');
      expect(display.icon).toBe('●');
    });

    it('should have consistent structure for all judgment types', () => {
      const judgments = ['critical-success', 'success', 'failure', 'critical-failure', 'neutral'] as const;
      
      judgments.forEach(judgment => {
        const display = getJudgmentDisplay(judgment);
        
        expect(display).toHaveProperty('label');
        expect(display).toHaveProperty('color');
        expect(display).toHaveProperty('bgColor');
        expect(display).toHaveProperty('borderColor');
        expect(display).toHaveProperty('icon');
        
        expect(typeof display.label).toBe('string');
        expect(typeof display.color).toBe('string');
        expect(typeof display.bgColor).toBe('string');
        expect(typeof display.borderColor).toBe('string');
        expect(typeof display.icon).toBe('string');
        
        expect(display.label.length).toBeGreaterThan(0);
        expect(display.icon.length).toBeGreaterThan(0);
      });
    });
  });
});
