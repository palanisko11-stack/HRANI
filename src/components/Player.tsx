import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../hooks/useGameStore';

export default function Player() {
  const rigidBody = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3());
  const { rapier, world } = useRapier();
  const { camera } = useThree();
  const { useAmmo } = useGameStore();

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
        case 'Space': setMovement(m => ({ ...m, jump: true })); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
        case 'Space': setMovement(m => ({ ...m, jump: false })); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleShoot = () => {
    useAmmo();
    // Raycasting logic for shooting
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(world as any, true);
    // Emit shot event or handle hits locally
    const event = new CustomEvent('player-shot', { 
      detail: { 
        origin: camera.position.clone(), 
        direction: raycaster.ray.direction.clone() 
      } 
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const clickHandler = () => handleShoot();
    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, [camera]);

  useFrame((state, delta) => {
    if (!rigidBody.current) return;

    const velocityValue = rigidBody.current.linvel();
    const translation = rigidBody.current.translation();

    // Movement logic
    const moveDir = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(movement.backward) - Number(movement.forward));
    const sideVector = new THREE.Vector3(Number(movement.left) - Number(movement.right), 0, 0);

    moveDir
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(7) // Speed
      .applyEuler(camera.rotation);

    rigidBody.current.setLinvel({ x: moveDir.x, y: velocityValue.y, z: moveDir.z }, true);

    // Update camera position to follow player body
    camera.position.set(translation.x, translation.y + 0.75, translation.z);

    // Jump logic
    if (movement.jump && Math.abs(velocityValue.y) < 0.05) {
      rigidBody.current.setLinvel({ x: velocityValue.x, y: 5, z: velocityValue.z }, true);
    }
  });

  return (
    <>
      <PointerLockControls />
      <RigidBody 
        ref={rigidBody} 
        colliders={false} 
        position={[0, 5, 0]} 
        enabledRotations={[false, false, false]}
        mass={1}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      
      {/* Visual Weapon attached to camera */}
      <WeaponModel />
    </>
  );
}

function WeaponModel() {
  const group = useRef<THREE.Group>(null);
  const muzzleFlash = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const [kick, setKick] = useState(0);

  useEffect(() => {
    const handleShot = () => {
      setKick(0.15); // Weapon kick
      if (muzzleFlash.current) {
        muzzleFlash.current.intensity = 10;
        setTimeout(() => {
          if (muzzleFlash.current) muzzleFlash.current.intensity = 0;
        }, 50);
      }
    };
    window.addEventListener('player-shot', handleShot);
    return () => window.removeEventListener('player-shot', handleShot);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Smooth weapon positioning (sway/bobbing)
    const factor = state.clock.getElapsedTime();
    group.current.position.copy(camera.position);
    group.current.rotation.copy(camera.rotation);
    
    // Weapon offset + kickback
    group.current.translateX(0.35);
    group.current.translateY(-0.35);
    group.current.translateZ(-0.5 + kick);

    // Cool down kick
    if (kick > 0) setKick(k => Math.max(0, k - delta * 2));

    // Idle sway
    group.current.position.y += Math.sin(factor * 2) * 0.005;
    group.current.position.x += Math.cos(factor * 1.5) * 0.005;
  });

  return (
    <group ref={group}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.1, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.1]} />
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Muzzle flash light */}
      <pointLight ref={muzzleFlash} position={[0, 0, -0.4]} intensity={0} color="#ffaa00" distance={5} />
    </group>
  );
}
