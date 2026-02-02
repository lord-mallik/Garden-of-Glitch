"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Player } from "./Player";
import { KeyboardControls, OrbitControls, Stars } from "@react-three/drei";
import { EntropyManager } from "./EntropyManager";
import { PostProcessing } from "./PostProcessing";
import { LevelManager } from "./LevelManager";
import { SoundManager } from "./SoundManager";

export function GameScene() {
  const map = [
    { name: "forward", keys: ["ArrowUp", "w", "W"] },
    { name: "backward", keys: ["ArrowDown", "s", "S"] },
    { name: "left", keys: ["ArrowLeft", "a", "A"] },
    { name: "right", keys: ["ArrowRight", "d", "D"] },
    { name: "jump", keys: ["Space"] },
    { name: "reset", keys: ["r", "R"] },
  ];

  return (
    <KeyboardControls map={map}>
      {/* SoundManager must be outside Canvas as it renders HTML */}
      <SoundManager />
      
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        className="w-full h-full bg-black"
      >
      <Suspense fallback={null}>
        <PostProcessing />
        <EntropyManager />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <LevelManager />
        </Physics>
        
        <OrbitControls makeDefault />
      </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
