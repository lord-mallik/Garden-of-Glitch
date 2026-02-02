import { RigidBody, RapierRigidBody, useRapier } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();
  const { rapier } = useRapier();

  useFrame((state, delta) => {
    if (!body.current) return;

    const { forward, backward, left, right, jump } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    
    // Movement force / Impulse
    // We modify velocity directly or apply impulse. 
    // For a "rolling ball" feel like Marble Madness/Monkey Ball:
    const speed = 0.2 * delta * 60; // Normalize speed by frame time roughly
    const maxVelocity = 10;
    
    // Check current velocity
    const linvel = body.current.linvel();
    
    if (forward && linvel.z > -maxVelocity) {
      impulse.z -= speed;
      torque.x -= speed;
    }
    if (backward && linvel.z < maxVelocity) {
      impulse.z += speed;
      torque.x += speed;
    }
    if (left && linvel.x > -maxVelocity) {
      impulse.x -= speed;
      torque.z += speed;
    }
    if (right && linvel.x < maxVelocity) {
      impulse.x += speed;
      torque.z -= speed;
    }

    // Wake up body if sleeping
    body.current.wakeUp();
    body.current.applyImpulse(impulse, true);
    body.current.applyTorqueImpulse(torque, true);

    // Jump Logic (Raycast down to check ground)
    if (jump) {
      if (Math.abs(linvel.y) < 0.1) {
         body.current.applyImpulse({ x: 0, y: 5, z: 0 }, true);
      }
    }
    
    // Camera Follow
    const translation = body.current.translation();
    
    // Respawn if fallen
    if (translation.y < -10) {
        body.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    const cameraPosition = new THREE.Vector3(translation.x, translation.y + 5, translation.z + 10);
    // Smooth lerp
    state.camera.position.lerp(cameraPosition, 0.1);
    state.camera.lookAt(translation.x, translation.y, translation.z);
  });

  return (
    <RigidBody 
      ref={body} 
      colliders="ball" 
      restitution={0.2} 
      friction={1} 
      linearDamping={1}
      angularDamping={1}
      position={[0, 5, 0]}
      // Keep rotations enabled for a rolling ball character, feels good for "glitch" games
      // If we wanted a standard platformer, we'd lock rotations.
    >
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#00ff00" emissive="#00cc00" emissiveIntensity={0.2} wireframe />
      </mesh>
    </RigidBody>
  );
}
