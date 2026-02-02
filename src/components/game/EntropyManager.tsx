import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/game-store";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

export function EntropyManager() {
  const addEntropy = useGameStore((state) => state.addEntropy);
  const entropy = useGameStore((state) => state.entropy);
  const [, getKeys] = useKeyboardControls();

  // Increase entropy when moving
  useFrame((state, delta) => {
    const keys = getKeys();
    
    let entropyGain = 0;
    if (keys.forward || keys.backward || keys.left || keys.right) {
      entropyGain += 10 * delta; // Gain 10 entropy per second of movement
    }
    
    if (keys.jump) {
        entropyGain += 50 * delta; // Jumping causes spikes
    }

    if (entropyGain > 0) {
      addEntropy(entropyGain);
    }
  });
  
  // Visuals: Background color shift
  useFrame((state) => {
    const r = Math.min(0.2, entropy / 2000); // Shift to dark red
    state.scene.background = new THREE.Color(r, 0, 0);
  });

  return null;
}
