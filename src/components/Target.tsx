import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../hooks/useGameStore';
import * as THREE from 'three';

export function Target({ position }: { position: [number, number, number] }) {
  const rigidBody = useRef<any>(null);
  const [health, setHealth] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const addScore = useGameStore(state => state.addScore);

  const handleHit = () => {
    setHealth(h => h - 25);
    if (health <= 25) {
      setIsDead(true);
      addScore(100);
      // Respawn logic
      setTimeout(() => {
        setIsDead(false);
        setHealth(100);
      }, 5000);
    }
  };

  useEffect(() => {
    const shotHandler = (e: any) => {
      if (isDead) return;
      const { origin, direction } = e.detail;
      const ray = new THREE.Ray(origin, direction);
      const box = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(...position), 
        new THREE.Vector3(1, 2, 1)
      );
      if (ray.intersectsBox(box)) {
        handleHit();
      }
    };
    window.addEventListener('player-shot', shotHandler);
    return () => window.removeEventListener('player-shot', shotHandler);
  }, [isDead, position, health]);

  useFrame((state) => {
    if (rigidBody.current && !isDead) {
      const time = state.clock.getElapsedTime();
      const x = position[0] + Math.sin(time + position[2]) * 1.5;
      const z = position[2] + Math.cos(time + position[0]) * 1.5;
      rigidBody.current.setNextKinematicTranslation({ x, y: position[1] + Math.sin(time * 2) * 0.2, z });
    }
  });

  if (isDead) return null;

  return (
    <RigidBody ref={rigidBody} position={position} colliders="cuboid" type="kinematicPosition">
      <mesh castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color={health < 50 ? "#ff0000" : "#444"} 
          emissive={health < 50 ? "#440000" : "#000"}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Eye/Sensors */}
      <mesh position={[0, 0.6, 0.5]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
    </RigidBody>
  );
}
