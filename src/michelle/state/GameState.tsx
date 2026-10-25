import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

export interface MData {
  catsPetted: string[];
  whiskeyRounds: number;
  slothFound: boolean;
  bugBest: number;
  harvests: number;
  potato: boolean;
  kimchiWon: boolean;
  cocktailSecret: boolean;
  metal: boolean;
  atelier: boolean;
  bayern: boolean;
  travel: string[];
  voucherUnlocked: boolean;
  signClicks: number;
  xp: number;
  reducedEffects: boolean;
  godMode: boolean;
  booted: number;
}

const DEFAULT: MData = {
  catsPetted: [],
  whiskeyRounds: 0,
  slothFound: false,
  bugBest: 0,
  harvests: 0,
  potato: false,
  kimchiWon: false,
  cocktailSecret: false,
  metal: false,
  atelier: false,
  bayern: false,
  travel: [],
  voucherUnlocked: false,
  signClicks: 0,
  xp: 0,
  reducedEffects: false,
  godMode: false,
  booted: 0,
};

interface GameStateApi {
  data: MData;
  set: <K extends keyof MData>(key: K, value: MData[K]) => void;
  addXp: (n: number) => void;
  addToList: (key: 'catsPetted' | 'travel', id: string) => string[];
  inc: (key: 'whiskeyRounds' | 'harvests' | 'signClicks' | 'booted') => number;
  reset: () => void;
  questReady: boolean;
}

const Ctx = createContext<GameStateApi | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<MData>('michelle33.state', DEFAULT);

  const set = useCallback(<K extends keyof MData>(key: K, value: MData[K]) => setData((d) => ({ ...d, [key]: value })), [setData]);
  const addXp = useCallback((n: number) => setData((d) => ({ ...d, xp: d.xp + n })), [setData]);
  const addToList = useCallback(
    (key: 'catsPetted' | 'travel', id: string) => {
      let list: string[] = [];
      setData((d) => {
        list = d[key].includes(id) ? d[key] : [...d[key], id];
        return list === d[key] ? d : { ...d, [key]: list };
      });
      return list;
    },
    [setData],
  );
  const inc = useCallback(
    (key: 'whiskeyRounds' | 'harvests' | 'signClicks' | 'booted') => {
      let n = 0;
      setData((d) => {
        n = d[key] + 1;
        return { ...d, [key]: n };
      });
      return n;
    },
    [setData],
  );
  const reset = useCallback(() => setData(DEFAULT), [setData]);
  const questReady = data.whiskeyRounds >= 1 && data.catsPetted.length >= 1 && data.slothFound;

  const api = useMemo(() => ({ data, set, addXp, addToList, inc, reset, questReady }), [data, set, addXp, addToList, inc, reset, questReady]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGameState(): GameStateApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGameState outside provider');
  return ctx;
}
