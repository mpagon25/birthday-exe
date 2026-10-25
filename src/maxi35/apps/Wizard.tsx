import { useEffect, useRef, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { WIZARD_WISDOM } from '../content/texts';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import styles from './Apps.module.css';

export function Wizard({ close }: AppComponentProps) {
  const game = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(() => Math.floor(Math.random() * WIZARD_WISDOM.length));
  const [shown, setShown] = useState(0);
  const text = WIZARD_WISDOM[index];
  const counted = useRef(false);

  useEffect(() => {
    counted.current = false;
    setShown(reduced ? text.length : 0);
    if (reduced) return;
    const id = window.setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          window.clearInterval(id);
          return s;
        }
        if (s % 3 === 0) audio.play('tick');
        return s + 1;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [text, audio, reduced]);

  useEffect(() => {
    if (shown >= text.length && !counted.current) {
      counted.current = true;
      const n = game.inc('wisdomSeen');
      if (n >= 5) ach.unlock('greywisdom');
    }
  }, [shown, text.length, game, ach]);

  const next = () => {
    audio.play('open');
    if (shown < text.length) {
      setShown(text.length);
      return;
    }
    setIndex((i) => (i + 1 + Math.floor(Math.random() * (WIZARD_WISDOM.length - 1))) % WIZARD_WISDOM.length);
  };

  return (
    <div className={styles.pane} style={{ background: '#000' }}>
      <div className={styles.rpg}>
        <div className={styles.rpgPortrait} aria-hidden>🧙</div>
        <div style={{ flex: 1 }}>
          <div className={styles.rpgName}>DER GRAUE · LVL ??? · HP: ∞ · MANA: Whiskey</div>
          <div aria-live="polite">
            {text.slice(0, shown)}
            <span className={styles.rpgCursor}>▌</span>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={next}>
          {shown < text.length ? 'Überspringen ▶' : 'Weiter ▶'}
        </button>
        <button className="btn" onClick={close}>
          Danke, Meister
        </button>
      </div>
      <div className={styles.muted} style={{ color: '#aaa', textAlign: 'center' }}>
        Weisheiten gehört: {game.data.wisdomSeen}
      </div>
    </div>
  );
}
