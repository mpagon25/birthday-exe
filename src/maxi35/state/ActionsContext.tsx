import { createContext, useContext } from 'react';

/** High-level desktop actions shared by chrome, hotspots and apps. */
export interface DesktopActions {
  openApp: (appId: string, props?: Record<string, unknown>) => void;
  pourPint: () => void;
  clink: () => void;
  showLevelUp: () => void;
  showVoucher: () => void;
  startParty: () => void;
  stopParty: () => void;
  startTrip: () => void;
  stopTrip: () => void;
  cloverRain: () => void;
  confetti: (opts?: { x?: number; y?: number; count?: number }) => void;
  notify: (title: string, text: string | string[], icon?: 'info' | 'warn' | 'error' | 'ok' | 'question' | 'trophy' | 'beer' | 'whiskey') => void;
  randomNotification: () => void;
  shutdown: () => void;
  minimizeAll: () => void;
  wizardSpeak: () => void;
  cowToast: () => void;
  petAnimal: (which: 'dog' | 'cat' | 'kitten') => void;
  alien: () => void;
  fireplace: () => void;
  disco: () => void;
  partyActive: boolean;
  tripActive: boolean;
}

export const ActionsCtx = createContext<DesktopActions | null>(null);

export function useActions(): DesktopActions {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error('useActions outside provider');
  return ctx;
}
