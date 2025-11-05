import { create } from 'zustand';

interface AppState {
  backgroundColor: string;
  objectColor: string;
  rotationSpeed: number;
  textureUrl: string;
  results: string[];
  setBackgroundColor: (color: string) => void;
  setObjectColor: (color: string) => void;
  setRotationSpeed: (speed: number) => void;
  setTextureUrl: (url: string) => void;
  addResult: (result: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  backgroundColor: '#1a1a2e',
  objectColor: '#0f4c75',
  rotationSpeed: 1,
  textureUrl: '',
  results: [],
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setObjectColor: (color) => set({ objectColor: color }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
  setTextureUrl: (url) => set({ textureUrl: url }),
  addResult: (result) =>
    set((state) => ({ results: [...state.results, result] })),
}));
