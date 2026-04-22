import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Arena() {
  // We can use procedural textures or nice colors for a "realistic" technical look
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#ff6600" />

      {/* Floor with grid texture simulation */}
      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={0.2} 
            metalness={0.9}
            emissive="#000"
          />
        </mesh>
        <CuboidCollider args={[100, 0.1, 100]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* Structural Pillars */}
      {[...Array(8)].map((_, i) => (
        <RigidBody key={`pillar-${i}`} type="fixed" position={[
          Math.cos(i * Math.PI / 4) * 15,
          5,
          Math.sin(i * Math.PI / 4) * 15
        ]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 10, 2]} />
            <meshStandardMaterial color="#222" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Light strips on pillars */}
          <mesh position={[0, 0, 1.05]}>
            <boxGeometry args={[0.2, 8, 0.1]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={5} />
          </mesh>
        </RigidBody>
      ))}

      {/* Central Structure */}
      <RigidBody type="fixed" position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[5, 6, 1, 32]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
      </RigidBody>

      {/* Industrial Crates */}
      {[...Array(12)].map((_, i) => (
        <RigidBody key={`crate-${i}`} colliders="cuboid" position={[
          Math.random() * 30 - 15, 
          2, 
          Math.random() * 30 - 15
        ]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#333" metalness={0.5} roughness={0.8} />
          </mesh>
        </RigidBody>
      ))}

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#000', 5, 35]} />
    </>
  );
}
