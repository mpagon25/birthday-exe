import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { ROULETTE_RESULTS } from '../content/texts';
import { PxButton } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import styles from './Games.module.css';

export function WhiskeyRoulette() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<{ text: string; xp: number } | null>(null);
  const [shuffling, setShuffling] = useState(true);

  const pick = (i: number) => {
    if (picked !== null || shuffling) return;
    setPicked(i);
    audio.play('clink');
    const r = ROULETTE_RESULTS[Math.floor(Math.random() * ROULETTE_RESULTS.length)];
    setResult(r);
    gs.addXp(r.xp);
    const n = gs.inc('whiskeyRounds');
    const total = round + 1;
    setRound(total);
    if (r.xp >= 25) game.fx.current?.sparkle(760, 550, 20);
    if (total >= 3 || n >= 3) ach.unlock('whiskeywizard');
  };

  const next = () => {
    setPicked(null);
    setResult(null);
    setShuffling(true);
    audio.play('whoosh');
  };

  return (
    <div className="stack">
      <div className={styles.score}>
        <span>RUNDE <b>{Math.min(round + (picked === null ? 1 : 0), 3)}/3</b></span>
        <span>GESAMT <b>{gs.data.whiskeyRounds}</b></span>
      </div>
      <p className="muted" style={{ margin: 0 }}>Drei Gläser. Eines davon ist eine Lebensentscheidung. Wähle weise. Oder gar nicht weise, Hauptsache wähle.</p>
      <div className={styles.glasses} onAnimationEnd={() => setShuffling(false)}>
        {[0, 1, 2].map((i) => (
          <button key={i} className={`${styles.glassCard} ${picked === i ? styles.revealed : ''} ${shuffling ? styles.shuffle : ''}`} style={{ animationDelay: `${i * 0.08}s` }} onClick={() => pick(i)} disabled={picked !== null} aria-label={`Glas ${i + 1}`}>
            {picked === i ? <Sprite name="glass" scale={8} /> : <span className={styles.q}>?</span>}
            <span className="pxsub">{picked === i ? `+${result?.xp} XP` : `GLAS ${i + 1}`}</span>
          </button>
        ))}
      </div>
      {result && (
        <div className={`pxbox dark ${styles.result}`}>
          <div className={styles.resultTitle}>{result.text}</div>
        </div>
      )}
      <div className="row" style={{ justifyContent: 'center' }}>
        {result && round < 3 && <PxButton onClick={next}>Nächste Runde</PxButton>}
        {result && round >= 3 && <PxButton variant="gold" onClick={next}>Noch eine Runde (Bonus)</PxButton>}
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}
