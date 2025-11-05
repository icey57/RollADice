import { SkinKey } from '../types/skins';

export type Ruleset = 'COC' | 'DND';

export interface DiceConfig {
  ruleset: Ruleset;
  rollCount: number;
  targetValue: number | null;
  skipAnimation: boolean;
  diceSkin: SkinKey;
}

type ConfigChangeListener = (config: DiceConfig) => void;

export class ConfigStore {
  private config: DiceConfig;
  private listeners: Set<ConfigChangeListener> = new Set();

  constructor(initialConfig?: Partial<DiceConfig>) {
    this.config = {
      ruleset: initialConfig?.ruleset || 'DND',
      rollCount: initialConfig?.rollCount || 1,
      targetValue: initialConfig?.targetValue !== undefined ? initialConfig.targetValue : null,
      skipAnimation: initialConfig?.skipAnimation || false,
      diceSkin: initialConfig?.diceSkin || 'bronze',
    };
  }

  getConfig(): Readonly<DiceConfig> {
    return { ...this.config };
  }

  setRuleset(ruleset: Ruleset): void {
    if (this.config.ruleset !== ruleset) {
      this.config.ruleset = ruleset;
      this.notifyListeners();
    }
  }

  setRollCount(count: number): void {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Roll count must be a positive integer');
    }
    if (this.config.rollCount !== count) {
      this.config.rollCount = count;
      this.notifyListeners();
    }
  }

  setTargetValue(value: number | null): void {
    if (value !== null && (!Number.isFinite(value) || value < 0)) {
      throw new Error('Target value must be a non-negative number or null');
    }
    if (this.config.targetValue !== value) {
      this.config.targetValue = value;
      this.notifyListeners();
    }
  }

  setSkipAnimation(skip: boolean): void {
    if (this.config.skipAnimation !== skip) {
      this.config.skipAnimation = skip;
      this.notifyListeners();
    }
  }

  setDiceSkin(skin: SkinKey): void {
    if (this.config.diceSkin !== skin) {
      this.config.diceSkin = skin;
      this.notifyListeners();
    }
  }

  updateConfig(updates: Partial<DiceConfig>): void {
    let changed = false;

    if (updates.ruleset !== undefined && this.config.ruleset !== updates.ruleset) {
      this.config.ruleset = updates.ruleset;
      changed = true;
    }

    if (updates.rollCount !== undefined) {
      if (!Number.isInteger(updates.rollCount) || updates.rollCount < 1) {
        throw new Error('Roll count must be a positive integer');
      }
      if (this.config.rollCount !== updates.rollCount) {
        this.config.rollCount = updates.rollCount;
        changed = true;
      }
    }

    if (updates.targetValue !== undefined) {
      if (updates.targetValue !== null && (!Number.isFinite(updates.targetValue) || updates.targetValue < 0)) {
        throw new Error('Target value must be a non-negative number or null');
      }
      if (this.config.targetValue !== updates.targetValue) {
        this.config.targetValue = updates.targetValue;
        changed = true;
      }
    }

    if (updates.skipAnimation !== undefined && this.config.skipAnimation !== updates.skipAnimation) {
      this.config.skipAnimation = updates.skipAnimation;
      changed = true;
    }

    if (updates.diceSkin !== undefined && this.config.diceSkin !== updates.diceSkin) {
      this.config.diceSkin = updates.diceSkin;
      changed = true;
    }

    if (changed) {
      this.notifyListeners();
    }
  }

  subscribe(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const configCopy = this.getConfig();
    this.listeners.forEach(listener => listener(configCopy));
  }
}
