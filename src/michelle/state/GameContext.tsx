import { createContext, useContext, type RefObject } from 'react';
import type { ParticleHandle } from '../../shared/fx/Particles';

export type ModalKind = 'roulette' | 'bughunter' | 'garden' | 'kimchi' | 'cocktail' | 'atelier' | 'terminal' | 'achievements' | 'voucher' | 'settings' | 'help';
export type ReactionKind = 'glass' | 'horns' | 'heart' | 'shake' | 'headbang';
export type SpriteKind = 'cat' | 'bat' | 'viking' | 'palm' | 'poolsloth' | 'football' | 'slothpaw' | 'notes';

export interface GameApi {
  modal: ModalKind | null;
  openModal: (kind: ModalKind) => void;
  closeModal: () => void;
  say: (lines: string | string[], speaker?: string) => void;
  bubble: (text: string, x: number, y: number, ms?: number) => void;
  xpPopup: (x: number, y: number, amount: number) => void;
  fx: RefObject<ParticleHandle | null>;
  shake: (ms?: number) => void;
  react: (kind: ReactionKind) => void;
  spawn: (kind: SpriteKind) => void;
  startMetal: () => void;
  startChaos: () => void;
  stopChaos: () => void;
  toggleGod: () => void;
  finale: () => void;
  registerClick: () => void;
  event: (text: string) => void;
  flags: { metal: boolean; chaos: boolean; god: boolean; finale: boolean; booted: boolean };
  effects: boolean;
  chaosMeter: number;
}

export const GameCtx = createContext<GameApi | null>(null);

export function useGame(): GameApi {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame outside provider');
  return ctx;
}
