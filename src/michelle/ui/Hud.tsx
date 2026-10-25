import { useAudio } from '../../shared/audio/AudioContext';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useGame } from '../state/GameContext';
import { PxBar, PxButton } from './PixelUI';
import { mMusic } from '../audio/tracks';
import { useEffect, useState } from 'react';
import styles from './UI.module.css';

export function Hud() {
  const audio = useAudio();
  const ach = useAchievements();
  const gs = useGameState();
  const game = useGame();
  const [musicOn, setMusicOn] = useState(mMusic.playing);
  useEffect(() => {
    const id = window.setInterval(() => setMusicOn(mMusic.playing), 500);
    return () => window.clearInterval(id);
  }, []);
  const level = 33;
  const xpInLevel = gs.data.xp % 333;

  return (
    <div className={`${styles.hud} no-print`}>
      <div className={`pxbox ${styles.hudBox}`}>
        <div className={styles.hudRow}>
          <span className={styles.hudLevel}>LVL {level}</span>
          <span className={styles.hudXp}>{gs.data.xp} XP</span>
        </div>
        <PxBar value={xpInLevel} max={333} />
        <div className={styles.hudRow} style={{ marginTop: 6 }}>
          <span className={styles.hudXp} style={{ color: 'var(--m-gold)' }}>🏆 {ach.count} / {ach.total}</span>
          <span className={styles.hudXp} style={{ color: gs.questReady || gs.data.voucherUnlocked ? '#4cd964' : 'var(--m-cream)' }}>
            QUEST {gs.data.voucherUnlocked ? '✔' : gs.questReady ? '!' : `${[gs.data.whiskeyRounds >= 1, gs.data.catsPetted.length >= 1, gs.data.slothFound].filter(Boolean).length}/3`}
          </span>
        </div>
      </div>
      <div className={styles.hudBtns}>
        <PxButton variant="ghost" title="Achievements" onClick={() => game.openModal('achievements')}>🏆</PxButton>
        <PxButton
          variant="ghost"
          title={musicOn ? 'Musik aus' : 'Musik an'}
          onClick={() => {
            audio.unlock();
            if (mMusic.playing) mMusic.stop();
            else mMusic.playTrack('main');
            setMusicOn(mMusic.playing);
          }}
        >
          {musicOn ? '♫' : '♪'}
        </PxButton>
        <PxButton variant="ghost" title={audio.muted ? 'Ton an' : 'Ton aus'} onClick={audio.toggleMuted}>{audio.muted ? '🔇' : '🔊'}</PxButton>
        <PxButton variant="ghost" title="Einstellungen" onClick={() => game.openModal('settings')}>⚙</PxButton>
        <PxButton variant="ghost" title="Hilfe" onClick={() => game.openModal('help')}>?</PxButton>
      </div>
      {game.chaosMeter > 15 && !game.flags.chaos && (
        <div className={`pxbox dark ${styles.chaos}`} style={{ padding: 6 }}>
          <div className={styles.lbl}>CHAOS METER {Math.round(game.chaosMeter)}%</div>
          <PxBar value={game.chaosMeter} max={100} />
        </div>
      )}
      {game.flags.god && <div className={styles.god}>GOD MODE: INFINITE WHISKEY VIBES</div>}
    </div>
  );
}
