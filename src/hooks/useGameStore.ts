import { create } from 'zustand';

interface GameState {
  score: number;
  health: number;
  ammo: number;
  isGameOver: boolean;
  gameStarted: boolean;
  addScore: (pts: number) => void;
  takeDamage: (dmg: number) => void;
  useAmmo: () => void;
  resetGame: () => void;
  startGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  health: 100,
  ammo: 30,
  isGameOver: false,
  gameStarted: false,
  addScore: (pts) => set((state) => ({ score: state.score + pts })),
  takeDamage: (dmg) => set((state) => {
    const newHealth = Math.max(0, state.health - dmg);
    return { health: newHealth, isGameOver: newHealth <= 0 };
  }),
  useAmmo: () => set((state) => ({ ammo: Math.max(0, state.ammo - 1) })),
  resetGame: () => set({ score: 0, health: 100, ammo: 30, isGameOver: false, gameStarted: true }),
  startGame: () => set({ gameStarted: true }),
}));
