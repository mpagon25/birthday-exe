import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

export interface GameData {
  pints: number;
  clinks: number;
  wisdomSeen: number;
  openedPrograms: string[];
  diceRolls: number;
  boulderWins: number;
  rabbitFound: boolean;
  reducedEffects: boolean;
}

const DEFAULT: GameData = { pints: 0, clinks: 0, wisdomSeen: 0, openedPrograms: [], diceRolls: 0, boulderWins: 0, rabbitFound: false, reducedEffects: false };

interface GameApi {
  data: GameData;
  inc: (key: 'pints' | 'clinks' | 'wisdomSeen' | 'diceRolls' | 'boulderWins') => number;
  addOpened: (appId: string) => string[];
  set: <K extends keyof GameData>(key: K, value: GameData[K]) => void;
  reset: () => void;
}

const Ctx = createContext<GameApi | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<GameData>('maxi35.state', DEFAULT);

  const inc = useCallback(
    (key: 'pints' | 'clinks' | 'wisdomSeen' | 'diceRolls' | 'boulderWins') => {
      let next = 0;
      setData((d) => {
        next = d[key] + 1;
        return { ...d, [key]: next };
      });
      return next;
    },
    [setData],
  );
  const addOpened = useCallback(
    (appId: string) => {
      let list: string[] = [];
      setData((d) => {
        list = d.openedPrograms.includes(appId) ? d.openedPrograms : [...d.openedPrograms, appId];
        return list === d.openedPrograms ? d : { ...d, openedPrograms: list };
      });
      return list;
    },
    [setData],
  );
  const set = useCallback(
    <K extends keyof GameData>(key: K, value: GameData[K]) => setData((d) => ({ ...d, [key]: value })),
    [setData],
  );
  const reset = useCallback(() => setData(DEFAULT), [setData]);

  const api = useMemo(() => ({ data, inc, addOpened, set, reset }), [data, inc, addOpened, set, reset]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGameState(): GameApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGameState outside provider');
  return ctx;
}
