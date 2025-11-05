import { describe, it, expect, beforeEach } from 'vitest';
import { useDiceStore } from './diceStore';

describe('diceStore', () => {
  beforeEach(() => {
    useDiceStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should have correct initial config', () => {
      const { config } = useDiceStore.getState();
      expect(config).toEqual({
        ruleset: 'COC',
        diceSkin: 'default',
        diceType: 'd100',
        rollCount: 1,
        targetValue: 50,
      });
    });

    it('should have empty pending rolls', () => {
      const { pendingRolls } = useDiceStore.getState();
      expect(pendingRolls).toEqual([]);
    });

    it('should have empty history', () => {
      const { history } = useDiceStore.getState();
      expect(history).toEqual({
        rolls: [],
        totalRolls: 0,
        successCount: 0,
        failureCount: 0,
      });
    });

    it('should have skipAnimation set to false', () => {
      const { skipAnimation } = useDiceStore.getState();
      expect(skipAnimation).toBe(false);
    });
  });

  describe('Config Actions', () => {
    it('should update ruleset', () => {
      useDiceStore.getState().setRuleset('DND');
      expect(useDiceStore.getState().config.ruleset).toBe('DND');
    });

    it('should update dice skin', () => {
      useDiceStore.getState().setDiceSkin('metal');
      expect(useDiceStore.getState().config.diceSkin).toBe('metal');
    });

    it('should update dice type', () => {
      useDiceStore.getState().setDiceType('d20');
      expect(useDiceStore.getState().config.diceType).toBe('d20');
    });

    it('should update roll count with validation', () => {
      useDiceStore.getState().setRollCount(5);
      expect(useDiceStore.getState().config.rollCount).toBe(5);
    });

    it('should clamp roll count to minimum of 1', () => {
      useDiceStore.getState().setRollCount(0);
      expect(useDiceStore.getState().config.rollCount).toBe(1);
      
      useDiceStore.getState().setRollCount(-5);
      expect(useDiceStore.getState().config.rollCount).toBe(1);
    });

    it('should clamp roll count to maximum of 10', () => {
      useDiceStore.getState().setRollCount(15);
      expect(useDiceStore.getState().config.rollCount).toBe(10);
    });

    it('should update target value with validation', () => {
      useDiceStore.getState().setTargetValue(75);
      expect(useDiceStore.getState().config.targetValue).toBe(75);
    });

    it('should clamp target value to minimum of 1', () => {
      useDiceStore.getState().setTargetValue(0);
      expect(useDiceStore.getState().config.targetValue).toBe(1);
      
      useDiceStore.getState().setTargetValue(-10);
      expect(useDiceStore.getState().config.targetValue).toBe(1);
    });

    it('should update multiple config values at once', () => {
      useDiceStore.getState().updateConfig({
        ruleset: 'DND',
        diceType: 'd20',
        targetValue: 15,
      });
      
      const { config } = useDiceStore.getState();
      expect(config.ruleset).toBe('DND');
      expect(config.diceType).toBe('d20');
      expect(config.targetValue).toBe(15);
    });
  });

  describe('Roll Actions', () => {
    it('should trigger a single roll', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      
      expect(pendingRolls).toHaveLength(1);
      expect(pendingRolls[0]).toHaveProperty('id');
      expect(pendingRolls[0]).toHaveProperty('timestamp');
      expect(pendingRolls[0]).toHaveProperty('targetValue', 50);
    });

    it('should trigger multiple rolls based on roll count', () => {
      useDiceStore.getState().setRollCount(3);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      expect(pendingRolls).toHaveLength(3);
    });

    it('should accumulate pending rolls from multiple triggers', () => {
      useDiceStore.getState().triggerRoll();
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      expect(pendingRolls).toHaveLength(2);
    });

    it('should generate unique IDs for each roll', () => {
      useDiceStore.getState().setRollCount(3);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      const ids = pendingRolls.map(roll => roll.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('Record Roll Results', () => {
    it('should record a successful COC roll', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      const rollId = pendingRolls[0].id;
      
      useDiceStore.getState().recordRollResult(rollId, 25);
      
      const { history, pendingRolls: updatedPending } = useDiceStore.getState();
      expect(updatedPending).toHaveLength(0);
      expect(history.rolls).toHaveLength(1);
      expect(history.rolls[0].rollValue).toBe(25);
      expect(history.rolls[0].judgment).toBe('hard-success');
      expect(history.totalRolls).toBe(1);
      expect(history.successCount).toBe(1);
      expect(history.failureCount).toBe(0);
    });

    it('should record a failed COC roll', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      const rollId = pendingRolls[0].id;
      
      useDiceStore.getState().recordRollResult(rollId, 75);
      
      const { history } = useDiceStore.getState();
      expect(history.rolls[0].rollValue).toBe(75);
      expect(history.rolls[0].judgment).toBe('failure');
      expect(history.totalRolls).toBe(1);
      expect(history.successCount).toBe(0);
      expect(history.failureCount).toBe(1);
    });

    it('should record a critical success COC roll', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      const rollId = pendingRolls[0].id;
      
      useDiceStore.getState().recordRollResult(rollId, 1);
      
      const { history } = useDiceStore.getState();
      expect(history.rolls[0].judgment).toBe('critical-success');
      expect(history.successCount).toBe(1);
    });

    it('should record a critical failure COC roll', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      const rollId = pendingRolls[0].id;
      
      useDiceStore.getState().recordRollResult(rollId, 100);
      
      const { history } = useDiceStore.getState();
      expect(history.rolls[0].judgment).toBe('critical-failure');
      expect(history.failureCount).toBe(1);
    });

    it('should record DND rolls correctly', () => {
      useDiceStore.getState().setRuleset('DND');
      useDiceStore.getState().setDiceType('d20');
      useDiceStore.getState().setTargetValue(15);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      const rollId = pendingRolls[0].id;
      
      useDiceStore.getState().recordRollResult(rollId, 20);
      
      const { history } = useDiceStore.getState();
      expect(history.rolls[0].judgment).toBe('critical-success');
      expect(history.rolls[0].diceType).toBe('d20');
      expect(history.rolls[0].ruleset).toBe('DND');
    });

    it('should handle multiple roll results', () => {
      useDiceStore.getState().setRollCount(3);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      
      useDiceStore.getState().recordRollResult(pendingRolls[0].id, 25);
      useDiceStore.getState().recordRollResult(pendingRolls[1].id, 75);
      useDiceStore.getState().recordRollResult(pendingRolls[2].id, 50);
      
      const { history, pendingRolls: updatedPending } = useDiceStore.getState();
      expect(updatedPending).toHaveLength(0);
      expect(history.rolls).toHaveLength(3);
      expect(history.totalRolls).toBe(3);
      expect(history.successCount).toBe(2);
      expect(history.failureCount).toBe(1);
    });

    it('should ignore recording for non-existent roll ID', () => {
      const initialState = useDiceStore.getState();
      useDiceStore.getState().recordRollResult('non-existent-id', 50);
      
      const finalState = useDiceStore.getState();
      expect(finalState.history).toEqual(initialState.history);
    });

    it('should prepend new rolls to history (newest first)', () => {
      useDiceStore.getState().setRollCount(2);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      
      useDiceStore.getState().recordRollResult(pendingRolls[0].id, 25);
      useDiceStore.getState().recordRollResult(pendingRolls[1].id, 75);
      
      const { history } = useDiceStore.getState();
      expect(history.rolls[0].rollValue).toBe(75);
      expect(history.rolls[1].rollValue).toBe(25);
    });
  });

  describe('Clear History', () => {
    it('should clear roll history', () => {
      useDiceStore.getState().setRollCount(2);
      useDiceStore.getState().triggerRoll();
      
      const { pendingRolls } = useDiceStore.getState();
      useDiceStore.getState().recordRollResult(pendingRolls[0].id, 25);
      useDiceStore.getState().recordRollResult(pendingRolls[1].id, 75);
      
      useDiceStore.getState().clearHistory();
      
      const { history } = useDiceStore.getState();
      expect(history).toEqual({
        rolls: [],
        totalRolls: 0,
        successCount: 0,
        failureCount: 0,
      });
    });

    it('should not affect pending rolls when clearing history', () => {
      useDiceStore.getState().triggerRoll();
      const { pendingRolls } = useDiceStore.getState();
      
      useDiceStore.getState().clearHistory();
      
      const { pendingRolls: afterClear } = useDiceStore.getState();
      expect(afterClear).toEqual(pendingRolls);
    });
  });

  describe('Toggle Animation Skip', () => {
    it('should toggle animation skip from false to true', () => {
      useDiceStore.getState().toggleAnimationSkip();
      expect(useDiceStore.getState().skipAnimation).toBe(true);
    });

    it('should toggle animation skip from true to false', () => {
      useDiceStore.getState().toggleAnimationSkip();
      useDiceStore.getState().toggleAnimationSkip();
      expect(useDiceStore.getState().skipAnimation).toBe(false);
    });
  });

  describe('Reset', () => {
    it('should reset all state to initial values', () => {
      useDiceStore.getState().setRuleset('DND');
      useDiceStore.getState().setDiceSkin('metal');
      useDiceStore.getState().setRollCount(5);
      useDiceStore.getState().toggleAnimationSkip();
      useDiceStore.getState().triggerRoll();
      
      useDiceStore.getState().reset();
      
      const state = useDiceStore.getState();
      expect(state.config).toEqual({
        ruleset: 'COC',
        diceSkin: 'default',
        diceType: 'd100',
        rollCount: 1,
        targetValue: 50,
      });
      expect(state.pendingRolls).toEqual([]);
      expect(state.history).toEqual({
        rolls: [],
        totalRolls: 0,
        successCount: 0,
        failureCount: 0,
      });
      expect(state.skipAnimation).toBe(false);
    });
  });
});
