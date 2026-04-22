import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Environment, Stars, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Bloom, EffectComposer, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import Player from './components/Player';
import Arena from './components/Arena';
import HUD from './components/HUD';
import { Target } from './components/Target';

export default function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      <Suspense fallback={<div className="text-white flex items-center justify-center h-full font-black tracking-widest animate-pulse">SYNCHRONIZING SYSTEM...</div>}>
        <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }} gl={{ antialias: false }}>
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Physics gravity={[0, -9.81, 0]}>
            <Arena />
            <Player />
            
            <Target position={[5, 1, -10]} />
            <Target position={[-8, 1, -15]} />
            <Target position={[12, 1, -5]} />
            <Target position={[0, 1, -25]} />
          </Physics>

          <Environment preset="night" />
          
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.9} luminanceSmoothing={0.025} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
        
        <HUD />
      </Suspense>

      <div className="absolute top-4 right-4 pointer-events-none opacity-50 text-[10px] text-white uppercase tracking-tighter">
        Build v1.0.5-γ • WASM PHYSICS ENGINE • R3F HIGH FIDELITY
      </div>
    </div>
  );
}
