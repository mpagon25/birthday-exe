import { useEffect } from 'react';
import './styles/pixel.css';
import { StageProvider } from '../shared/stage/StageContext';
import { AudioProvider } from '../shared/audio/AudioContext';
import { AchievementsProvider } from '../shared/achievements/AchievementsContext';
import { GameStateProvider, useGameState } from './state/GameState';
import { M_ACHIEVEMENTS } from './content/achievements';
import { MichelleGame } from './MichelleGame';
import { mMusic } from './audio/tracks';

function WithXp() {
  const gs = useGameState();
  return (
    <AchievementsProvider defs={M_ACHIEVEMENTS} storageKey="michelle33.achievements" onUnlock={(d) => gs.addXp(d.xp ?? 0)}>
      <MichelleGame />
    </AchievementsProvider>
  );
}

export function App() {
  useEffect(() => {
    document.documentElement.style.colorScheme = 'dark';
    return () => {
      document.documentElement.style.colorScheme = '';
      mMusic.stop();
    };
  }, []);
  return (
    <div className="app-michelle33">
    <StageProvider>
      <AudioProvider storagePrefix="michelle33">
        <GameStateProvider>
          <WithXp />
        </GameStateProvider>
      </AudioProvider>
    </StageProvider>
    </div>
  );
}
