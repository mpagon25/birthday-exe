import { useEffect, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useInterval } from '../../shared/hooks/useInterval';
import styles from './Apps.module.css';

export function LevelUp({ close }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  const [xp, setXp] = useState(0);
  useEffect(() => {
    audio.play('levelup');
  }, [audio]);
  useInterval(() => setXp((x) => Math.min(35, x + 1)), 60, xp < 35);

  return (
    <div className={styles.pane}>
      <div className={styles.levelUpBanner}>★ LEVEL 35 UNLOCKED ★</div>
      <div className={styles.levelText}>
        <p>
          Herzlichen Glückwunsch! Du hast Level 34 erfolgreich abgeschlossen, alle Nebenquests ignoriert, die sich nicht gelohnt haben, und trotzdem genug XP gesammelt.
        </p>
        <p>
          Freigeschaltet: <b>mehr Erfahrungspunkte</b>, <b>neue Quests</b>, <b>eine zunehmend selektive Toleranz für schlechte Pubs</b> und ein ziemlich guter Tropfen.
        </p>
        <p className={styles.muted}>Skill-Tree-Update: Brettspiel-Erklärbär +3, Bouldern +2, Kaffee-Resistenz 0 (unverändert).</p>
      </div>
      <div>
        <div className={styles.statLabel}>
          <span>Experience</span>
          <span>{xp} / 35 Jahre</span>
        </div>
        <div className={`progress ${styles.xpBar}`}>
          <div className="blocks">
            {Array.from({ length: xp }).map((_, i) => (
              <span key={i} className={`block ${i >= 30 ? styles.gold : ''}`} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          className="btn primary"
          onClick={() => {
            close();
            a.showVoucher();
          }}
        >
          Claim your reward
        </button>
        <button className="btn" onClick={close}>
          Später
        </button>
      </div>
    </div>
  );
}
