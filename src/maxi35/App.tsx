import { useCallback, useEffect, useState } from 'react';
import './styles/global.css';
import { StageProvider } from '../shared/stage/StageContext';
import { AudioProvider, useAudio } from '../shared/audio/AudioContext';
import { AchievementsProvider } from '../shared/achievements/AchievementsContext';
import { ACHIEVEMENTS } from './achievements/defs';
import { GameStateProvider, useGameState } from './state/GameState';
import { WindowManagerProvider } from './desktop/WindowManager';
import { registry } from './apps/registry';
import { Desktop } from './Desktop';
import { music } from './audio/music';
import { BootScreen } from './overlays/BootScreen';
import type { MsgOptions } from './desktop/types';

function Shell() {
  const [booted, setBooted] = useState(false);
  const audio = useAudio();
  const game = useGameState();

  const onOpenApp = useCallback(
    (appId: string) => {
      if (registry[appId]?.program) game.addOpened(appId);
    },
    [game],
  );
  const onMessage = useCallback(
    (o: MsgOptions) => {
      const sound = o.sound ?? (o.icon === 'error' ? 'error' : o.icon === 'warn' ? 'warn' : 'info');
      if (sound !== 'none') audio.play(sound);
    },
    [audio],
  );

  return (
    <WindowManagerProvider registry={registry} onOpenApp={onOpenApp} onMessage={onMessage}>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <Desktop booted={booted} />
    </WindowManagerProvider>
  );
}

export function App() {
  useEffect(() => {
    document.documentElement.style.colorScheme = 'light';
    return () => {
      document.documentElement.style.colorScheme = '';
      music.stop();
    };
  }, []);
  return (
    <div className="app-maxi35">
    <StageProvider>
      <AudioProvider>
        <GameStateProvider>
          <AchievementsProvider defs={ACHIEVEMENTS} storageKey="maxi35.achievements" completionistId="completionist">
            <Shell />
          </AchievementsProvider>
        </GameStateProvider>
      </AudioProvider>
    </StageProvider>
    </div>
  );
}
