import { create } from 'zustand';

interface GameState {
  entropy: number;
  maxEntropy: number;
  addEntropy: (amount: number) => void;
  resetEntropy: () => void;
  
  // Potential future flags for specific glitches
  glitchLevel: number; // 0 = none, 1 = mild, 2 = severe, 3 = collapse
}

export const useGameStore = create<GameState>((set) => ({
  entropy: 0,
  maxEntropy: 1000,
  glitchLevel: 0,
  
  addEntropy: (amount) => set((state) => {
    const newEntropy = Math.min(state.entropy + amount, state.maxEntropy);
    
    // Calculate glitch level based on entropy thresholds
    let newGlitchLevel = 0;
    if (newEntropy > 800) newGlitchLevel = 3;
    else if (newEntropy > 500) newGlitchLevel = 2;
    else if (newEntropy > 200) newGlitchLevel = 1;
    
    return { 
      entropy: newEntropy,
      glitchLevel: newGlitchLevel
    };
  }),
  
  resetEntropy: () => set({ entropy: 0, glitchLevel: 0 }),
}));
