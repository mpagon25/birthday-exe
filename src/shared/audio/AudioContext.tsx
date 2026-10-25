import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { engine, type SoundName } from './engine';
import { readStorage, writeStorage } from '../hooks/useLocalStorage';
import { usePageVisible } from '../hooks/usePageVisible';

interface AudioApi {
  play: (name: SoundName) => void;
  unlock: () => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
  volume: number;
  setVolume: (v: number) => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  unlocked: boolean;
}

const Ctx = createContext<AudioApi | null>(null);

export function AudioProvider({ children, storagePrefix = 'maxi35' }: { children: ReactNode; storagePrefix?: string }) {
  const [muted, setMutedState] = useState<boolean>(() => readStorage(`${storagePrefix}.muted`, false));
  const [volume, setVolumeState] = useState<number>(() => readStorage(`${storagePrefix}.volume`, 0.7));
  const [musicVolume, setMusicVolumeState] = useState<number>(() => readStorage(`${storagePrefix}.music`, 0.5));
  const [unlocked, setUnlocked] = useState(false);
  const visible = usePageVisible();

  useEffect(() => {
    engine.muted = muted;
    engine.volume = volume;
    engine.musicVolume = musicVolume;
  }, [muted, volume, musicVolume]);

  useEffect(() => {
    // Pause the whole audio graph in background tabs.
    if (visible) engine.resume();
    else engine.suspend();
  }, [visible]);

  const unlock = useCallback(() => {
    engine.unlock();
    setUnlocked(true);
  }, []);
  const play = useCallback((name: SoundName) => engine.play(name), []);
  const setMuted = useCallback(
    (m: boolean) => {
      setMutedState(m);
      writeStorage(`${storagePrefix}.muted`, m);
    },
    [storagePrefix],
  );
  const toggleMuted = useCallback(() => setMuted(!muted), [muted, setMuted]);
  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      writeStorage(`${storagePrefix}.volume`, v);
    },
    [storagePrefix],
  );
  const setMusicVolume = useCallback(
    (v: number) => {
      setMusicVolumeState(v);
      writeStorage(`${storagePrefix}.music`, v);
    },
    [storagePrefix],
  );

  const api = useMemo(
    () => ({ play, unlock, muted, setMuted, toggleMuted, volume, setVolume, musicVolume, setMusicVolume, unlocked }),
    [play, unlock, muted, setMuted, toggleMuted, volume, setVolume, musicVolume, setMusicVolume, unlocked],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio outside provider');
  return ctx;
}
