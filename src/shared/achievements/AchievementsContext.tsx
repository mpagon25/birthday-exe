import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';
import { useAudio } from '../audio/AudioContext';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  secret?: boolean;
  xp?: number;
}

export interface ToastItem {
  key: number;
  def: AchievementDef;
}

interface AchievementsApi {
  defs: AchievementDef[];
  unlocked: ReadonlySet<string>;
  has: (id: string) => boolean;
  unlock: (id: string) => boolean;
  reset: () => void;
  toasts: ToastItem[];
  dismissToast: (key: number) => void;
  count: number;
  total: number;
}

const Ctx = createContext<AchievementsApi | null>(null);
let toastKey = 0;

export function AchievementsProvider({
  children,
  defs,
  storageKey,
  completionistId,
  onUnlock,
}: {
  children: ReactNode;
  defs: AchievementDef[];
  storageKey: string;
  /** Unlocked automatically once every other achievement is unlocked. */
  completionistId?: string;
  onUnlock?: (def: AchievementDef) => void;
}) {
  const audio = useAudio();
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set(readStorage<string[]>(storageKey, [])));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const ref = useRef(unlocked);
  ref.current = unlocked;

  const unlock = useCallback(
    (id: string): boolean => {
      if (ref.current.has(id)) return false;
      const def = defs.find((a) => a.id === id);
      if (!def) return false;
      const next = new Set(ref.current);
      next.add(id);
      ref.current = next;
      setUnlocked(next);
      writeStorage(storageKey, [...next]);
      audio.play('achievement');
      toastKey += 1;
      setToasts((t) => [...t, { key: toastKey, def }]);
      onUnlock?.(def);
      return true;
    },
    [audio, defs, storageKey, onUnlock],
  );

  useEffect(() => {
    if (!completionistId) return;
    const others = defs.filter((a) => a.id !== completionistId);
    if (!unlocked.has(completionistId) && others.every((a) => unlocked.has(a.id))) {
      const t = window.setTimeout(() => unlock(completionistId), 1200);
      return () => window.clearTimeout(t);
    }
  }, [unlocked, unlock, defs, completionistId]);

  const reset = useCallback(() => {
    const next = new Set<string>();
    ref.current = next;
    setUnlocked(next);
    writeStorage(storageKey, []);
  }, [storageKey]);

  const dismissToast = useCallback((key: number) => setToasts((t) => t.filter((x) => x.key !== key)), []);
  const has = useCallback((id: string) => ref.current.has(id), []);

  const api = useMemo<AchievementsApi>(
    () => ({ defs, unlocked, has, unlock, reset, toasts, dismissToast, count: unlocked.size, total: defs.length }),
    [defs, unlocked, has, unlock, reset, toasts, dismissToast],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAchievements(): AchievementsApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAchievements outside provider');
  return ctx;
}
