"use client";

import { EffectComposer, Glitch, Pixelation, Noise } from "@react-three/postprocessing";
import { useGameStore } from "@/store/game-store";
import { Vector2 } from "three";

export function PostProcessing() {
  const entropy = useGameStore((state) => state.entropy);
  
  // Calculate effect intensities based on entropy
  // Entropy 0-1000
  const glitchActive = entropy > 300;
  const pixelationGranularity = Math.max(0, (entropy - 500) / 50); // Start pixelating after 500
  const noiseOpacity = Math.min(0.5, entropy / 2000);

  return (
    <EffectComposer>
        <Noise opacity={noiseOpacity} />
        <Glitch 
            delay={new Vector2(1, 3)} 
            duration={new Vector2(0.1, 0.5)} 
            strength={new Vector2(0.01 + (entropy/5000), 0.1 + (entropy/2000))} 
            mode={1} // 1 = constant mild glitches, 0 = sporadic
            active={glitchActive}
            ratio={0.85}
        />
        {pixelationGranularity > 0 ? (
             <Pixelation granularity={10 + pixelationGranularity} /> 
             // Note: effectively pixelation granularity is usually higher number = more blocks? 
             // No, in some passes lower = more blocks. Let's start with no pixelation for now to be safe.
        ) : <></>}
    </EffectComposer>
  );
}
