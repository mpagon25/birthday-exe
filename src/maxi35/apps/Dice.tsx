import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppComponentProps } from '../desktop/types';
import { DICE_RESULTS } from '../content/texts';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import styles from './Apps.module.css';

export function Dice({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const reduced = useReducedMotion();
  const [value, setValue] = useState(20);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<{ text: string; kind: 'crit' | 'fail' | 'normal' } | null>(null);
  const [spin, setSpin] = useState(0);
  const timer = useRef(0);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    audio.play('dice');
    setSpin((s) => s + 720 + Math.floor(Math.random() * 360));
    const final = 1 + Math.floor(Math.random() * 20);
    let ticks = 0;
    const step = () => {
      ticks += 1;
      setValue(1 + Math.floor(Math.random() * 20));
      if (ticks < 14) timer.current = window.setTimeout(step, 40 + ticks * 12);
      else finish(final);
    };
    const finish = (v: number) => {
      setValue(v);
      setRolling(false);
      game.inc('diceRolls');
      if (v === 1) {
        setResult({ text: DICE_RESULTS.nat1, kind: 'fail' });
        audio.play('error');
      } else if (v === 20) {
        setResult({ text: DICE_RESULTS.nat20, kind: 'crit' });
        audio.play('fanfare');
        a.confetti({ count: 100 });
        ach.unlock('natural20');
      } else if (v < 10) {
        setResult({ text: DICE_RESULTS.low, kind: 'normal' });
        audio.play('warn');
      } else {
        setResult({ text: DICE_RESULTS.mid, kind: 'normal' });
        audio.play('xp');
      }
    };
    if (reduced) finish(final);
    else step();
  };

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>W20.exe</div>
      <div className={styles.diceArea}>
        <motion.div className={styles.d20} animate={{ rotate: spin, scale: rolling ? [1, 1.2, 0.9, 1.1, 1] : 1 }} transition={{ duration: reduced ? 0 : 1.1, ease: 'easeOut' }} aria-live="polite" aria-label={`Würfel zeigt ${value}`}>
          <svg viewBox="0 0 100 100">
            <polygon points="50,2 95,27 95,73 50,98 5,73 5,27" fill="#b3202a" stroke="#000" strokeWidth="3" />
            <polygon points="50,20 78,65 22,65" fill="#e03040" stroke="#000" strokeWidth="2" />
            <line x1="50" y1="2" x2="50" y2="20" stroke="#000" strokeWidth="2" />
            <line x1="95" y1="27" x2="78" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="5" y1="27" x2="22" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="95" y1="73" x2="78" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="5" y1="73" x2="22" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="50" y1="98" x2="78" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="50" y1="98" x2="22" y2="65" stroke="#000" strokeWidth="2" />
          </svg>
          <motion.span className={styles.num} animate={{ rotate: -spin }} transition={{ duration: reduced ? 0 : 1.1, ease: 'easeOut' }}>
            {value}
          </motion.span>
        </motion.div>
        <div className={`${styles.diceResult} ${result ? styles[result.kind] : ''}`}>{result ? result.text : rolling ? '...' : 'Würfle für Initiative!'}</div>
        <div className={styles.muted}>Würfe gesamt: {game.data.diceRolls} · May your rolls be natural twenties.</div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={roll} disabled={rolling}>
          Würfeln
        </button>
        <button className="btn" onClick={close}>
          Schließen
        </button>
      </div>
    </div>
  );
}
