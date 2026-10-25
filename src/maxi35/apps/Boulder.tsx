import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import styles from './Apps.module.css';

const COLS = 5;
const ROWS = 9;
const W = 300;
const H = 420;
const HOLD_COLORS = ['#ff5c5c', '#ffd23f', '#39ff14', '#19f5ff', '#b967ff', '#ff8c42'];

interface Hold {
  r: number;
  c: number;
  color: string;
  crumbly: boolean;
}

function generate(): Hold[] {
  const holds: Hold[] = [];
  let prev = 2;
  for (let r = ROWS - 1; r >= 0; r--) {
    // guaranteed path hold within reach of previous row
    const pathC = Math.max(0, Math.min(COLS - 1, prev + (Math.floor(Math.random() * 3) - 1)));
    const cols = new Set<number>([pathC]);
    while (cols.size < 2 + Math.floor(Math.random() * 2)) cols.add(Math.floor(Math.random() * COLS));
    cols.forEach((c) => holds.push({ r, c, color: HOLD_COLORS[Math.floor(Math.random() * HOLD_COLORS.length)], crumbly: c !== pathC && r < ROWS - 1 && Math.random() < 0.3 }));
    prev = pathC;
  }
  return holds;
}

const px = (r: number, c: number) => ({ x: 40 + (c * (W - 80)) / (COLS - 1), y: 60 + (r * (H - 100)) / (ROWS - 1) });

export function Boulder({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [holds, setHolds] = useState<Hold[]>(generate);
  const [pos, setPos] = useState<{ r: number; c: number }>(() => ({ r: ROWS - 1, c: 2 }));
  const [grip, setGrip] = useState(100);
  const [state, setState] = useState<'idle' | 'climbing' | 'won' | 'fell'>('idle');
  const [moves, setMoves] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    const h = generate();
    setHolds(h);
    const bottom = h.filter((x) => x.r === ROWS - 1);
    setPos({ r: ROWS - 1, c: bottom[0].c });
    setGrip(100);
    setMoves(0);
    setState('climbing');
    audio.play('open');
    ref.current?.focus();
  }, [audio]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useInterval(() => setGrip((g) => Math.max(0, g - 2.2)), 100, state === 'climbing');

  useEffect(() => {
    if (state === 'climbing' && grip <= 0) {
      setState('fell');
      audio.play('gameover');
    }
  }, [grip, state, audio]);

  const reachable = useMemo(
    () => holds.filter((h) => (h.r === pos.r - 1 && Math.abs(h.c - pos.c) <= 1) || (h.r === pos.r && Math.abs(h.c - pos.c) === 1)),
    [holds, pos],
  );

  const move = (dir: 'up' | 'left' | 'right' | 'upleft' | 'upright') => {
    if (state !== 'climbing') return;
    const want =
      dir === 'up' ? { r: pos.r - 1, c: pos.c }
      : dir === 'left' ? { r: pos.r, c: pos.c - 1 }
      : dir === 'right' ? { r: pos.r, c: pos.c + 1 }
      : dir === 'upleft' ? { r: pos.r - 1, c: pos.c - 1 }
      : { r: pos.r - 1, c: pos.c + 1 };
    let target = reachable.find((h) => h.r === want.r && h.c === want.c);
    if (!target && dir === 'up') target = reachable.find((h) => h.r === pos.r - 1);
    if (!target) {
      audio.play('error');
      setGrip((g) => Math.max(0, g - 6));
      return;
    }
    audio.play('step');
    setPos({ r: target.r, c: target.c });
    setMoves((m) => m + 1);
    setGrip((g) => Math.min(100, g + 7));
    if (target.crumbly) {
      const t = target;
      window.setTimeout(() => setHolds((hs) => hs.filter((h) => h !== t)), 900);
      window.setTimeout(() => {
        setPos((p) => {
          if (p.r === t.r && p.c === t.c) {
            setState('fell');
            audio.play('gameover');
          }
          return p;
        });
      }, 950);
    }
    if (target.r === 0) {
      setState('won');
      audio.play('achievement');
      a.confetti({ count: 60 });
      game.inc('boulderWins');
      ach.unlock('rocksolid');
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, Parameters<typeof move>[0]> = { ArrowUp: 'up', w: 'up', W: 'up', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', q: 'upleft', Q: 'upleft', e: 'upright', E: 'upright' };
    if (map[e.key]) {
      e.preventDefault();
      if (state !== 'climbing') start();
      else move(map[e.key]);
    } else if (e.key === 'Enter' && state !== 'climbing') {
      e.preventDefault();
      start();
    }
  };

  const p = px(pos.r, pos.c);
  const lowGrip = grip < 30;

  return (
    <div className={styles.pane} ref={ref} tabIndex={0} onKeyDown={onKey} style={{ outline: 'none' }}>
      <div className={styles.row} style={{ justifyContent: 'space-between' }}>
        <b>Bouldern.exe</b>
        <span className={styles.muted}>Züge: {moves} · Gipfel: {game.data.boulderWins}</span>
      </div>
      <div>
        <div className={styles.statLabel}>
          <span>Grip Strength</span>
          <span>{Math.round(grip)}%</span>
        </div>
        <div className={`progress ${styles.gripBar} ${lowGrip ? styles.low : ''}`}>
          <div className="blocks">
            {Array.from({ length: Math.round(grip / 2.6) }).map((_, i) => (
              <span key={i} className="block" />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.wall} aria-label="Boulderwand">
        <div className={styles.topLine}>TOP</div>
        {holds.map((h) => {
          const q = px(h.r, h.c);
          const reach = state === 'climbing' && reachable.includes(h);
          return <span key={`${h.r}-${h.c}`} className={`${styles.hold} ${reach ? styles.reach : ''} ${h.crumbly ? styles.crumbly : ''}`} style={{ left: q.x, top: q.y, background: h.color }} />;
        })}
        <span className={`${styles.climber} ${state === 'fell' ? styles.fall : ''}`} style={{ left: p.x, top: p.y }} aria-hidden>
          🧗
        </span>
        {state === 'idle' && (
          <div className={styles.overlayMsg}>
            <div>Pfeiltasten / WASD: klettern.<br />Q / E: diagonal.<br />Griffkraft sinkt, jeder Zug gibt etwas zurück.<br />Wackelige Griffe bröseln.</div>
            <button className="btn primary" onClick={start}>Start</button>
          </div>
        )}
        {state === 'won' && (
          <div className={styles.overlayMsg}>
            <div>Achievement unlocked:<br />Grip Strength +10</div>
            <button className="btn primary" onClick={start}>Nochmal</button>
          </div>
        )}
        {state === 'fell' && (
          <div className={styles.overlayMsg}>
            <div>Respawn at the nearest tavern.</div>
            <button className="btn primary" onClick={start}>Respawn</button>
          </div>
        )}
      </div>
      <div className={styles.dpad} aria-label="Steuerung">
        <button className="btn" onClick={() => move('upleft')} aria-label="Hoch links">↖</button>
        <button className="btn" onClick={() => move('up')} aria-label="Hoch">↑</button>
        <button className="btn" onClick={() => move('upright')} aria-label="Hoch rechts">↗</button>
        <button className="btn" onClick={() => move('left')} aria-label="Links">←</button>
        <button className="btn" onClick={close} aria-label="Schließen">✕</button>
        <button className="btn" onClick={() => move('right')} aria-label="Rechts">→</button>
      </div>
    </div>
  );
}
