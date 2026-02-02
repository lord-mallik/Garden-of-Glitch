"use client";

import { useGameStore } from "@/store/game-store";

export function HUD() {
  const entropy = useGameStore((state) => state.entropy);
  const maxEntropy = useGameStore((state) => state.maxEntropy);
  const glitchLevel = useGameStore((state) => state.glitchLevel);

  return (
    <div className="absolute top-0 left-0 w-full p-6 text-white pointer-events-none select-none z-50">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>
          System.Stability: {Math.max(0, 100 - (entropy / maxEntropy * 100)).toFixed(1)}%
        </h1>
        
        <div className="relative w-64 h-4 bg-gray-800 border border-gray-600">
          <div 
            className="h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${(entropy / maxEntropy) * 100}%` }}
          />
        </div>
        
        {glitchLevel > 0 && (
          <div className="text-red-500 font-mono mt-2 animate-pulse">
            WARNING: ENTROPY CRITICAL (LEVEL {glitchLevel})
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-4 max-w-xs">
          Controls: WASD to Move. SPACE to Jump. Movement generates ENTROPY.
          High entropy causes physics failure and visual decay.
        </div>
      </div>
    </div>
  );
}
