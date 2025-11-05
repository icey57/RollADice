import { ConfigStore } from './ConfigStore';

describe('ConfigStore', () => {
  describe('constructor', () => {
    it('should initialize with default values when no config provided', () => {
      const store = new ConfigStore();
      const config = store.getConfig();

      expect(config.ruleset).toBe('DND');
      expect(config.rollCount).toBe(1);
      expect(config.targetValue).toBe(null);
      expect(config.skipAnimation).toBe(false);
      expect(config.diceSkin).toBe('bronze');
    });

    it('should initialize with provided values', () => {
      const store = new ConfigStore({
        ruleset: 'COC',
        rollCount: 5,
        targetValue: 15,
        skipAnimation: true,
        diceSkin: 'gemstone',
      });
      const config = store.getConfig();

      expect(config.ruleset).toBe('COC');
      expect(config.rollCount).toBe(5);
      expect(config.targetValue).toBe(15);
      expect(config.skipAnimation).toBe(true);
      expect(config.diceSkin).toBe('gemstone');
    });

    it('should allow partial initialization', () => {
      const store = new ConfigStore({
        rollCount: 3,
        diceSkin: 'gold',
      });
      const config = store.getConfig();

      expect(config.ruleset).toBe('DND');
      expect(config.rollCount).toBe(3);
      expect(config.diceSkin).toBe('gold');
    });
  });

  describe('getConfig', () => {
    it('should return a copy of the configuration', () => {
      const store = new ConfigStore();
      const config1 = store.getConfig();
      const config2 = store.getConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2);
    });

    it('should not allow external mutation', () => {
      const store = new ConfigStore({ rollCount: 1 });
      const config = store.getConfig();
      
      (config as any).rollCount = 999;
      
      expect(store.getConfig().rollCount).toBe(1);
    });
  });

  describe('setRuleset', () => {
    it('should update ruleset and notify listeners', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.setRuleset('COC');

      expect(store.getConfig().ruleset).toBe('COC');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        ruleset: 'COC',
      }));
    });

    it('should not notify listeners if value unchanged', () => {
      const store = new ConfigStore({ ruleset: 'DND' });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setRuleset('DND');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('setRollCount', () => {
    it('should update roll count with valid integer', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.setRollCount(5);

      expect(store.getConfig().rollCount).toBe(5);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should throw error for non-positive integers', () => {
      const store = new ConfigStore();

      expect(() => store.setRollCount(0)).toThrow('Roll count must be a positive integer');
      expect(() => store.setRollCount(-1)).toThrow('Roll count must be a positive integer');
      expect(() => store.setRollCount(-10)).toThrow('Roll count must be a positive integer');
    });

    it('should throw error for non-integers', () => {
      const store = new ConfigStore();

      expect(() => store.setRollCount(1.5)).toThrow('Roll count must be a positive integer');
      expect(() => store.setRollCount(2.1)).toThrow('Roll count must be a positive integer');
    });

    it('should not notify listeners if value unchanged', () => {
      const store = new ConfigStore({ rollCount: 3 });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setRollCount(3);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('setTargetValue', () => {
    it('should update target value with valid number', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.setTargetValue(15);

      expect(store.getConfig().targetValue).toBe(15);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should accept null to clear target value', () => {
      const store = new ConfigStore({ targetValue: 10 });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setTargetValue(null);

      expect(store.getConfig().targetValue).toBe(null);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should throw error for negative values', () => {
      const store = new ConfigStore();

      expect(() => store.setTargetValue(-1)).toThrow('Target value must be a non-negative number or null');
      expect(() => store.setTargetValue(-10)).toThrow('Target value must be a non-negative number or null');
    });

    it('should throw error for invalid numbers', () => {
      const store = new ConfigStore();

      expect(() => store.setTargetValue(NaN)).toThrow('Target value must be a non-negative number or null');
      expect(() => store.setTargetValue(Infinity)).toThrow('Target value must be a non-negative number or null');
    });

    it('should not notify listeners if value unchanged', () => {
      const store = new ConfigStore({ targetValue: 20 });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setTargetValue(20);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('setSkipAnimation', () => {
    it('should update skip animation flag', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.setSkipAnimation(true);

      expect(store.getConfig().skipAnimation).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not notify listeners if value unchanged', () => {
      const store = new ConfigStore({ skipAnimation: false });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setSkipAnimation(false);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('setDiceSkin', () => {
    it('should update dice skin', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.setDiceSkin('gemstone');

      expect(store.getConfig().diceSkin).toBe('gemstone');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not notify listeners if value unchanged', () => {
      const store = new ConfigStore({ diceSkin: 'bronze' });
      const listener = jest.fn();
      store.subscribe(listener);

      store.setDiceSkin('bronze');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('updateConfig', () => {
    it('should update multiple values at once', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.updateConfig({
        ruleset: 'COC',
        rollCount: 3,
        diceSkin: 'gold',
      });

      const config = store.getConfig();
      expect(config.ruleset).toBe('COC');
      expect(config.rollCount).toBe(3);
      expect(config.diceSkin).toBe('gold');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should validate roll count in batch update', () => {
      const store = new ConfigStore();

      expect(() => store.updateConfig({ rollCount: 0 })).toThrow('Roll count must be a positive integer');
      expect(() => store.updateConfig({ rollCount: -5 })).toThrow('Roll count must be a positive integer');
      expect(() => store.updateConfig({ rollCount: 1.5 })).toThrow('Roll count must be a positive integer');
    });

    it('should validate target value in batch update', () => {
      const store = new ConfigStore();

      expect(() => store.updateConfig({ targetValue: -1 })).toThrow('Target value must be a non-negative number or null');
      expect(() => store.updateConfig({ targetValue: NaN })).toThrow('Target value must be a non-negative number or null');
    });

    it('should not notify if no values changed', () => {
      const store = new ConfigStore({
        ruleset: 'DND',
        rollCount: 1,
      });
      const listener = jest.fn();
      store.subscribe(listener);

      store.updateConfig({
        ruleset: 'DND',
        rollCount: 1,
      });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should only notify once for multiple changes', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      store.updateConfig({
        ruleset: 'COC',
        rollCount: 5,
        targetValue: 15,
        skipAnimation: true,
        diceSkin: 'crystal',
      });

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should allow multiple subscribers', () => {
      const store = new ConfigStore();
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      store.setRollCount(5);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const store = new ConfigStore();
      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);
      store.setRollCount(2);
      
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.setRollCount(3);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should pass config copy to listeners', () => {
      const store = new ConfigStore();
      const configs: any[] = [];
      
      store.subscribe((config) => {
        configs.push(config);
      });

      store.setRollCount(2);
      store.setRollCount(3);

      expect(configs.length).toBe(2);
      expect(configs[0]).not.toBe(configs[1]);
      expect(configs[0].rollCount).toBe(2);
      expect(configs[1].rollCount).toBe(3);
    });

    it('should handle listener errors gracefully', () => {
      const store = new ConfigStore();
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();

      store.subscribe(errorListener);
      store.subscribe(normalListener);

      expect(() => store.setRollCount(5)).toThrow('Listener error');
      expect(errorListener).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle zero as target value', () => {
      const store = new ConfigStore();
      store.setTargetValue(0);

      expect(store.getConfig().targetValue).toBe(0);
    });

    it('should handle large roll counts', () => {
      const store = new ConfigStore();
      store.setRollCount(1000000);

      expect(store.getConfig().rollCount).toBe(1000000);
    });

    it('should handle rapid updates', () => {
      const store = new ConfigStore();
      const listener = jest.fn();
      store.subscribe(listener);

      for (let i = 1; i <= 100; i++) {
        store.setRollCount(i);
      }

      expect(listener).toHaveBeenCalledTimes(100);
      expect(store.getConfig().rollCount).toBe(100);
    });

    it('should handle multiple unsubscribes safely', () => {
      const store = new ConfigStore();
      const listener = jest.fn();

      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      unsubscribe();

      store.setRollCount(5);
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
