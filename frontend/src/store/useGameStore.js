import { create } from 'zustand';

const useGameStore = create((set) => ({
  // User Progress
  currentLevel: 1,
  xp: 0,
  accuracy: 0,

  // Level 1: Signal Hunter State
  signals: [],
  processedSignals: [],

  // Actions
  setCurrentLevel: (level) => set({ currentLevel: level }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  updateAccuracy: (newAccuracy) => set({ accuracy: newAccuracy }),

  // Signal Actions
  setSignals: (signals) => set({ signals }),
  processSignal: (signal, userChoice) => set((state) => ({
    processedSignals: [...state.processedSignals, { ...signal, userChoice }],
    signals: state.signals.filter(s => s.id !== signal.id)
  })),

  // Reset
  resetGame: () => set({
    currentLevel: 1,
    xp: 0,
    accuracy: 0,
    signals: [],
    processedSignals: []
  })
}));

export default useGameStore;
