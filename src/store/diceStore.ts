import { create } from 'zustand';
import type {
  Ruleset,
  DiceSkin,
  DiceType,
  RollOutcome,
  PendingRoll,
  DiceConfig,
  RollHistory,
} from '../types/store';
import { calculateJudgment } from '../utils/judgmentLogic';

interface DiceStoreState {
  config: DiceConfig;
  pendingRolls: PendingRoll[];
  history: RollHistory;
  skipAnimation: boolean;
}

interface DiceStoreActions {
  setRuleset: (ruleset: Ruleset) => void;
  setDiceSkin: (skin: DiceSkin) => void;
  setDiceType: (diceType: DiceType) => void;
  setRollCount: (count: number) => void;
  setTargetValue: (value: number) => void;
  updateConfig: (config: Partial<DiceConfig>) => void;
  triggerRoll: () => void;
  recordRollResult: (rollId: string, rollValue: number) => void;
  clearHistory: () => void;
  toggleAnimationSkip: () => void;
  reset: () => void;
}

type DiceStore = DiceStoreState & DiceStoreActions;

const initialConfig: DiceConfig = {
  ruleset: 'COC',
  diceSkin: 'default',
  diceType: 'd100',
  rollCount: 1,
  targetValue: 50,
};

const initialHistory: RollHistory = {
  rolls: [],
  totalRolls: 0,
  successCount: 0,
  failureCount: 0,
};

export const useDiceStore = create<DiceStore>((set, get) => ({
  config: initialConfig,
  pendingRolls: [],
  history: initialHistory,
  skipAnimation: false,

  setRuleset: (ruleset) =>
    set((state) => ({
      config: { ...state.config, ruleset },
    })),

  setDiceSkin: (skin) =>
    set((state) => ({
      config: { ...state.config, diceSkin: skin },
    })),

  setDiceType: (diceType) =>
    set((state) => ({
      config: { ...state.config, diceType },
    })),

  setRollCount: (count) =>
    set((state) => ({
      config: { ...state.config, rollCount: Math.max(1, Math.min(10, count)) },
    })),

  setTargetValue: (value) =>
    set((state) => ({
      config: { ...state.config, targetValue: Math.max(1, value) },
    })),

  updateConfig: (configUpdate) =>
    set((state) => ({
      config: { ...state.config, ...configUpdate },
    })),

  triggerRoll: () => {
    const { config } = get();
    const newPendingRolls: PendingRoll[] = Array.from(
      { length: config.rollCount },
      (_, i) => ({
        id: `${Date.now()}-${i}`,
        timestamp: Date.now(),
        targetValue: config.targetValue,
      })
    );

    set((state) => ({
      pendingRolls: [...state.pendingRolls, ...newPendingRolls],
    }));
  },

  recordRollResult: (rollId, rollValue) => {
    const state = get();
    const pendingRoll = state.pendingRolls.find((roll) => roll.id === rollId);

    if (!pendingRoll) {
      return;
    }

    const judgment = calculateJudgment(
      state.config.ruleset,
      rollValue,
      pendingRoll.targetValue,
      state.config.diceType
    );

    const outcome: RollOutcome = {
      id: rollId,
      timestamp: pendingRoll.timestamp,
      ruleset: state.config.ruleset,
      diceType: state.config.diceType,
      rollValue,
      targetValue: pendingRoll.targetValue,
      judgment,
    };

    const isSuccess = ['critical-success', 'extreme-success', 'hard-success', 'success'].includes(
      judgment
    );

    set((state) => ({
      pendingRolls: state.pendingRolls.filter((roll) => roll.id !== rollId),
      history: {
        rolls: [outcome, ...state.history.rolls],
        totalRolls: state.history.totalRolls + 1,
        successCount: state.history.successCount + (isSuccess ? 1 : 0),
        failureCount: state.history.failureCount + (isSuccess ? 0 : 1),
      },
    }));
  },

  clearHistory: () =>
    set({
      history: initialHistory,
    }),

  toggleAnimationSkip: () =>
    set((state) => ({
      skipAnimation: !state.skipAnimation,
    })),

  reset: () =>
    set({
      config: initialConfig,
      pendingRolls: [],
      history: initialHistory,
      skipAnimation: false,
    }),
}));
