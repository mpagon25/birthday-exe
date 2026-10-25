import { useEffect, useMemo, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { RABBIT_HOLE_SECRET } from '../content/texts';
import { useActions } from '../state/ActionsContext';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { Icon } from '../desktop/icons';
import styles from './Apps.module.css';

export function RabbitDialog({ close }: AppComponentProps) {
  const a = useActions();
  const go = () => {
    close();
    a.openApp('rabbithole');
  };
  return (
    <div className={styles.pane}>
      <div className={styles.row}>
        <Icon name="question" size={32} />
        <div style={{ fontSize: 14 }}>
          <b>Follow the white rabbit?</b>
          <div className={styles.muted}>Das Kaninchen richtet seine Sonnenbrille und wartet.</div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={go}>Ja</button>
        <button className="btn" onClick={go}>Natürlich</button>
      </div>
    </div>
  );
}

const CHARS = 'ｱｲｳｴｵｶｷｸｹｺ0123456789ABCDEF🍀🥃';

export function RabbitHole({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [shown, setShown] = useState(1);
  const columns = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ left: i * 32, delay: Math.random() * 4, dur: 3 + Math.random() * 4, text: Array.from({ length: 18 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('\n') })),
    [],
  );

  useEffect(() => {
    ach.unlock('whiterabbit');
    game.set('rabbitFound', true);
    audio.play('glitch');
    const id = window.setInterval(() => setShown((s) => (s < RABBIT_HOLE_SECRET.length ? s + 1 : s)), 900);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.pane} style={{ background: '#000', padding: 6 }}>
      <div className={styles.matrix}>
        {columns.map((c, i) => (
          <span key={i} className={styles.matrixRain} style={{ left: c.left, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }} aria-hidden>
            {c.text}
          </span>
        ))}
        <div className={styles.matrixText}>
          <div>&gt; wake up, level 35...</div>
          {RABBIT_HOLE_SECRET.slice(0, shown).map((l, i) => (
            <div key={i}>&gt; {l}</div>
          ))}
          {shown >= RABBIT_HOLE_SECRET.length && (
            <div style={{ marginTop: 12 }}>
              &gt; Wähle:{' '}
              <button className={`btn ${styles.pill}`} style={{ color: '#c00' }} onClick={() => { audio.play('xp'); a.startParty(); }} aria-label="Rote Pille">
                🔴
              </button>{' '}
              <button className={`btn ${styles.pill}`} style={{ color: '#00c' }} onClick={() => { audio.play('xp'); a.notify('Blaue Pille', 'Du wachst in deinem Bett auf und glaubst, was du glauben willst: dass ein Pint genug ist.', 'info'); }} aria-label="Blaue Pille">
                🔵
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn" onClick={close}>Zurück in die Matrix</button>
      </div>
    </div>
  );
}
