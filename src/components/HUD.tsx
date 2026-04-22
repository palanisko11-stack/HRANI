import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../hooks/useGameStore';
import { Crosshair, Shield, Zap } from 'lucide-react';

export default function HUD() {
  const { score, health, ammo, isGameOver, resetGame, gameStarted, startGame } = useGameStore();

  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black mb-8 tracking-tighter"
        >
          KINETICS FPS
        </motion.h1>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          Wasm-Powered Physics • Realistic Lighting • Survival Protocol
          <br />
          <span className="text-xs uppercase mt-4 block">WASD to Move • Click to Shoot • ESC to Menu</span>
        </p>
        <button 
          onClick={startGame}
          className="px-8 py-4 bg-white text-black font-bold text-xl hover:bg-orange-500 hover:text-white transition-colors cursor-pointer rounded-full"
        >
          INITIALIZE SYSTEM
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute w-6 h-[1px] bg-white opacity-30" />
        <div className="absolute w-[1px] h-6 bg-white opacity-30" />
      </div>

      {/* Bottom Left: Health & Score */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2">
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 border-l-4 border-orange-500">
          <Shield className="w-5 h-5 text-orange-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Vital Integrity</span>
            <span className="text-3xl font-mono font-bold text-white leading-none">{health}%</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 border-l-4 border-white/20">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Protocol Score</span>
            <span className="text-2xl font-mono font-bold text-white leading-none">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Right: Ammo */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md px-8 py-5 border-r-4 border-orange-500">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Capacitor State</span>
            <span className="text-4xl font-mono font-bold text-white leading-none">{ammo} / INF</span>
          </div>
          <Zap className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-xl z-50 pointer-events-auto"
          >
            <h2 className="text-8xl font-black text-white mb-4 tracking-tighter">INTEGRITY LOST</h2>
            <p className="text-white/60 mb-8 uppercase tracking-widest font-bold">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-10 py-5 bg-white text-black font-black text-2xl hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
            >
              REBOOT SYSTEM
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
