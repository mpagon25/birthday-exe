import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { BUG_RATINGS } from '../content/texts';
import { PxButton, PxBar } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import styles from './Games.module.css';

interface Bug {
  tile: number;
  cat: boolean;
  key: number;
}

const DURATION = 30;

export function BugHunter() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [state, setState] = useState<'idle' | 'play' | 'done'>('idle');
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [hit, setHit] = useState<number | null>(null);
  const keyRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const spawn = useCallback(() => {
    setBugs((b) => {
      const free = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((t) => !b.some((x) => x.tile === t));
      if (free.length === 0) return b;
      const tile = free[Math.floor(Math.random() * free.length)];
      keyRef.current += 1;
      const bug: Bug = { tile, cat: Math.random() < 0.22, key: keyRef.current };
      timers.current.push(window.setTimeout(() => setBugs((bb) => bb.filter((x) => x.key !== bug.key)), 900 + Math.random() * 500));
      return [...b, bug];
    });
  }, []);

  useEffect(() => {
    if (state !== 'play') return;
    let delay = 750;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      spawn();
      delay = Math.max(320, delay - 12);
      timers.current.push(window.setTimeout(loop, delay));
    };
    loop();
    const tick = window.setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      alive = false;
      window.clearInterval(tick);
      clear();
    };
  }, [state, spawn]);

  useEffect(() => {
    if (state === 'play' && time <= 0) {
      setState('done');
      setBugs([]);
      audio.play(score > 25 ? 'fanfare' : 'gameover');
      gs.addXp(score);
      if (score > gs.data.bugBest) gs.set('bugBest', score);
      if (score > 25) ach.unlock('chaosengineer');
    }
  }, [time, state, score, gs, ach, audio]);

  const start = () => {
    setScore(0);
    setTime(DURATION);
    setBugs([]);
    setState('play');
    audio.play('arcade');
  };

  const whack = (tile: number) => {
    if (state !== 'play') return;
    const bug = bugs.find((b) => b.tile === tile);
    if (!bug) {
      audio.play('tick');
      return;
    }
    audio.play(bug.cat ? 'meow' : 'squish');
    setBugs((b) => b.filter((x) => x.key !== bug.key));
    setScore((s) => s + (bug.cat ? 3 : 1));
    setHit(tile);
    window.setTimeout(() => setHit(null), 200);
  };

  return (
    <div className="stack">
      <div className={styles.score}>
        <span>SCORE <b>{score}</b></span>
        <span>BEST <b>{Math.max(gs.data.bugBest, score)}</b></span>
        <span>TIME <b>{Math.max(0, time)}s</b></span>
      </div>
      <PxBar value={Math.max(0, time)} max={DURATION} variant={time < 8 ? '' : 'green'} />
      <div className={styles.grid3} role="grid" aria-label="Bug Hunter Spielfeld">
        {Array.from({ length: 9 }, (_, i) => {
          const bug = bugs.find((b) => b.tile === i);
          return (
            <button key={i} className={`${styles.tile} ${hit === i ? styles.hit : ''}`} onPointerDown={() => whack(i)} aria-label={bug ? (bug.cat ? 'Katzenbug' : 'Bug') : 'leer'}>
              {bug && <Sprite name={bug.cat ? 'bugCat' : 'bugA'} scale={5} />}
              {bug?.cat && <span className={styles.pts}>+3</span>}
            </button>
          );
        })}
      </div>
      {state === 'idle' && (
        <div className="center stack">
          <p className="muted" style={{ margin: 0 }}>30 Sekunden. Bugs anklicken. Bugs mit Katzenohren bringen 3 Punkte. Keine Gnade für Off-by-one-Fehler.</p>
          <PxButton onClick={start} autoFocus>Start</PxButton>
        </div>
      )}
      {state === 'done' && (
        <div className={`pxbox dark ${styles.result}`}>
          <div className={styles.resultTitle}>{BUG_RATINGS(score)}</div>
          <p>{score} Bugs erledigt. {score > 25 ? 'Production ist sicher. Vorerst.' : 'Die restlichen Bugs sind jetzt Features.'}</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <PxButton onClick={start}>Nochmal</PxButton>
            <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
          </div>
        </div>
      )}
    </div>
  );
}
