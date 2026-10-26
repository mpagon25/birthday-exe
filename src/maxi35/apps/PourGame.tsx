import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import styles from './Apps.module.css';

const PINTS = 5;
const ZONE = { from: 80, to: 90 };

type Result = 'perfect' | 'ok' | 'weak' | 'overflow';

export function PourGame({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [level, setLevel] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [msg, setMsg] = useState('Halte Maus, Finger oder Leertaste gedrückt, um zu zapfen. Lass los, wenn der Pegel in der grünen Zone ist.');
  const [overflow, setOverflow] = useState(0);
  const speed = useRef(40);
  const raf = useRef(0);
  const levelRef = useRef(0);
  const pouringRef = useRef(false);
  const resultsRef = useRef<Result[]>([]);
  resultsRef.current = results;
  const done = results.length >= PINTS;

  const finish = useCallback(
    (l: number) => {
      let r: Result;
      if (l > 98) r = 'overflow';
      else if (l >= ZONE.from && l <= ZONE.to) r = 'perfect';
      else if (l >= ZONE.from - 12 && l < ZONE.from) r = 'ok';
      else if (l > ZONE.to) r = 'ok';
      else r = 'weak';
      const text = r === 'perfect' ? 'Perfekt! Schaumkrone wie gemalt.' : r === 'ok' ? 'Geht so. Der Gast trinkt es trotzdem.' : r === 'weak' ? 'Halbleer. Der Gast schaut dich an.' : 'Übergelaufen! Der Tresen ist jetzt ein Biergarten.';
      audio.play(r === 'perfect' ? 'combo' : r === 'overflow' ? 'error' : 'tick');
      if (r === 'overflow') setOverflow((o) => o + 1);
      setMsg(text);
      const next = [...resultsRef.current, r];
      resultsRef.current = next;
      setResults(next);
      if (next.length >= PINTS) {
        const perfect = next.filter((x) => x === 'perfect').length;
        const points = next.reduce((sum, x) => sum + (x === 'perfect' ? 100 : x === 'ok' ? 50 : 0), 0);
        if (points > game.data.pourBest) game.set('pourBest', points);
        if (perfect >= 3) ach.unlock('perfectpour');
        if (perfect === PINTS) {
          game.collect('goldpint');
          a.confetti({ count: 100 });
          setMsg('FÜNF PERFEKTE PINTS. Das Goldene Pint ist deins.');
        } else setMsg(`Schicht beendet: ${points} Punkte, ${perfect} perfekte Pints.`);
        audio.play(perfect >= 3 ? 'fanfare' : 'gameover');
      }
    },
    [audio, game, ach, a],
  );

  const startedAt = useRef(0);
  const autoStop = useRef(0);

  const levelNow = useCallback(() => Math.min(110, ((performance.now() - startedAt.current) / 1000) * speed.current), []);

  const stop = useCallback(() => {
    if (!pouringRef.current) return;
    pouringRef.current = false;
    setPouring(false);
    cancelAnimationFrame(raf.current);
    window.clearTimeout(autoStop.current);
    levelRef.current = levelNow();
    setLevel(levelRef.current);
    finish(levelRef.current);
  }, [finish, levelNow]);

  const start = useCallback(() => {
    if (pouringRef.current || resultsRef.current.length >= PINTS) return;
    pouringRef.current = true;
    setPouring(true);
    audio.play('pour');
    levelRef.current = 0;
    setLevel(0);
    speed.current = 32 + resultsRef.current.length * 7 + Math.random() * 10;
    startedAt.current = performance.now();
    // Overflow happens on the clock, not on the frame rate.
    autoStop.current = window.setTimeout(() => stop(), (110 / speed.current) * 1000);
    const loop = () => {
      if (!pouringRef.current) return;
      levelRef.current = levelNow();
      setLevel(levelRef.current);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, [audio, stop, levelNow]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && typeof t.matches === 'function' && t.matches('input, textarea');
      if (e.key === ' ' && !e.repeat && !typing) {
        e.preventDefault();
        start();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        stop();
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [start, stop]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(autoStop.current);
    },
    [],
  );

  const reset = () => {
    resultsRef.current = [];
    setResults([]);
    setLevel(0);
    levelRef.current = 0;
    setMsg('Neue Schicht. Fünf Pints. Keine Gnade.');
    audio.play('open');
  };

  const glyph = (r: Result) => (r === 'perfect' ? '🍺' : r === 'ok' ? '🥛' : r === 'weak' ? '🫗' : '💦');

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>Zapfhahn.exe</div>
      <div className={styles.pourArea}>
        <div className={`${styles.tap} ${pouring ? styles.on : ''}`} aria-hidden />
        <div
          className={styles.pintGlass}
          onPointerDown={(e) => {
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              /* synthetic or unsupported pointer: ignore */
            }
            start();
          }}
          onPointerUp={stop}
          onPointerCancel={stop}
          role="button"
          aria-label="Zapfen: gedrückt halten"
          tabIndex={0}
        >
          <div className={styles.pintZone} style={{ bottom: `${ZONE.from}%`, height: `${ZONE.to - ZONE.from}%` }} />
          <div className={styles.pintFill} style={{ height: `${Math.min(100, level)}%` }} />
          <div className={styles.pintHead} style={{ bottom: `${Math.min(100, level)}%`, opacity: level > 5 ? 1 : 0 }} />
          {overflow > 0 && <div key={overflow} className={styles.pintOverflow} />}
        </div>
      </div>
      <div className={styles.pintsRow} aria-label="Ergebnisse">
        {Array.from({ length: PINTS }).map((_, i) => (
          <span key={i}>{results[i] ? glyph(results[i]) : '▢'}</span>
        ))}
      </div>
      <div className={styles.pourScore}>{msg}</div>
      <div className={styles.muted} style={{ textAlign: 'center' }}>Bestes Ergebnis: {game.data.pourBest} Punkte · Zone: {ZONE.from}–{ZONE.to}%</div>
      <div className={styles.buttons}>
        {done && <button className="btn primary" onClick={reset}>Neue Schicht</button>}
        <button className="btn" onClick={close}>Feierabend</button>
      </div>
    </div>
  );
}
