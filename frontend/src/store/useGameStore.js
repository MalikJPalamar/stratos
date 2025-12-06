import { create } from 'zustand';

const useGameStore = create((set) => ({
  // User Progress
  currentLevel: 1,
  xp: 0,
  accuracy: 0,
  currentStreak: 0,
  bestStreak: 0,

  // Level 1: Signal Hunter State
  signals: [],
  processedSignals: [],

  // Level 2: Pattern Matcher State
  level2Signals: [],
  level2ProcessedSignals: [],
  level2Categories: [],

  // Actions
  setCurrentLevel: (level) => set({ currentLevel: level }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  updateAccuracy: (newAccuracy) => set({ accuracy: newAccuracy }),
  incrementStreak: () => set((state) => {
    const newStreak = state.currentStreak + 1;
    return {
      currentStreak: newStreak,
      bestStreak: Math.max(newStreak, state.bestStreak)
    };
  }),
  resetStreak: () => set({ currentStreak: 0 }),

  // Level 1: Signal Actions
  setSignals: (signals) => set({ signals }),
  processSignal: (signal, userChoice) => set((state) => ({
    processedSignals: [...state.processedSignals, { ...signal, userChoice }],
    signals: state.signals.filter(s => s.id !== signal.id)
  })),

  // Level 2: Pattern Matcher Actions
  setLevel2Signals: (signals) => set({ level2Signals: signals }),
  setLevel2Categories: (categories) => set({ level2Categories: categories }),
  processLevel2Signal: (signal, userCategory, isCorrect, correctCategory) => set((state) => ({
    level2ProcessedSignals: [
      ...state.level2ProcessedSignals,
      { ...signal, userCategory, isCorrect, correctCategory }
    ],
    level2Signals: state.level2Signals.filter(s => s.id !== signal.id)
  })),

  // Reset
  resetGame: () => set({
    currentLevel: 1,
    xp: 0,
    accuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    signals: [],
    processedSignals: [],
    level2Signals: [],
    level2ProcessedSignals: [],
    level2Categories: []
  })
}));

export default useGameStore;
