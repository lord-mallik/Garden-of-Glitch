"use client";

import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/store/game-store";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

interface EntropyBlockProps {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  type?: "fixed" | "dynamic";
  instabilityThreshold?: number; // Entropy level where this block starts acting up
  disappearThreshold?: number;   // Entropy level where this block might vanish
}

const noise3D = createNoise3D();

export function EntropyBlock({ 
  position, 
  size = [1, 1, 1], 
  color = "#444", 
  type = "fixed",
  instabilityThreshold = 200,
  disappearThreshold = 800
}: EntropyBlockProps) {
  const body = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const entropy = useGameStore((state) => state.entropy);
  
  // Each block has a unique random seed for noise
  const seed = useMemo(() => Math.random() * 1000, []);
  const [isGhost, setIsGhost] = useState(false);

  useFrame((state) => {
    if (!mesh.current || !body.current) return;
    
    const time = state.clock.elapsedTime;
    const instability = Math.max(0, entropy - instabilityThreshold);
    
    // 1. Position Jitter (Visual only for fixed blocks, physical for dynamic)
    if (instability > 0) {
      const jitterAmount = Math.min(0.2, instability / 2000);
      const noise = noise3D(time * 2, seed, 0) * jitterAmount;
      
      if (type === "fixed") {
          // Visual shake
          mesh.current.position.y = noise;
      }
    }
    
    // 2. Ghost Mode (No Collision)
    if (entropy > disappearThreshold) {
       // Oscillate existence based on noise
       const existNoise = noise3D(time * 0.5, seed, 100);
       const shouldBeGhost = existNoise > 0.3; // 35% chance to disappear
       
       if (shouldBeGhost !== isGhost) {
           setIsGhost(shouldBeGhost);
           // We can't easily toggle collision in Rapier at runtime without waking/sleeping or changing groups
           // A hack is to move it far away or change translation, but simpler is to rely on visual for now
           // For a "troll" game, we WANT it to lose collision. 
           // Correct way: modify collision groups or just accept we need to respawn the body.
           // Rapier component doesn't dynamic update sensor prop easily.
           // However, we can use `setLinvel` etc. 
           // Let's settle for visuals first, and maybe "sensor" logic if possible.
           
           // Actually, we can move it to a "void" layer or translation logic.
           if (shouldBeGhost) {
               body.current.setTranslation({ x: position[0], y: -1000, z: position[2] }, true);
           } else {
               body.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
           }
       }
    } else {
        if (isGhost) {
            setIsGhost(false);
            body.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
        }
    }
    
    // Color shift
    if (mesh.current) {
        const material = mesh.current.material as THREE.MeshStandardMaterial;
        if (isGhost) {
            material.opacity = 0.2;
            material.transparent = true;
            material.emissive.setHex(0xff0000);
        } else {
            material.opacity = 1;
            material.transparent = false;
            material.emissive.setHex(0x000000);
        }
    }
  });

  return (
    <RigidBody 
      ref={body} 
      type={type} 
      position={position} 
      friction={1}
      // sensor={isGhost} // This prop is not reactive in Rapier usually
    >
      <mesh ref={mesh} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
