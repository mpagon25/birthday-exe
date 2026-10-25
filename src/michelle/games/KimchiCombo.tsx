import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { KIMCHI_BAD, KIMCHI_GOOD } from '../content/texts';
import { PxButton, PxBar } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import styles from './Games.module.css';

interface Item {
  key: number;
  lane: number;
  y: number;
  good: boolean;
  icon: string;
  comment?: string;
  speed: number;
}

const LANES = 5;
const GOAL = 10;
const LIVES = 3;

export function KimchiCombo() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [state, setState] = useState<'idle' | 'play' | 'won' | 'lost'>('idle');
  const [lane, setLane] = useState(2);
  const [items, setItems] = useState<Item[]>([]);
  const [caught, setCaught] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [comment, setComment] = useState('');
  const laneRef = useRef(2);
  const keyRef = useRef(0);
  const fieldRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const lastSpawn = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const move = useCallback((dir: number) => {
    laneRef.current = Math.max(0, Math.min(LANES - 1, laneRef.current + dir));
    setLane(laneRef.current);
  }, []);

  useEffect(() => {
    if (state !== 'play') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, move]);

  useEffect(() => {
    if (state !== 'play') return;
    let last = performance.now();
    lastSpawn.current = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - lastSpawn.current > 900) {
        lastSpawn.current = now;
        const good = Math.random() < 0.62;
        const g = KIMCHI_GOOD[Math.floor(Math.random() * KIMCHI_GOOD.length)];
        const b = KIMCHI_BAD[Math.floor(Math.random() * KIMCHI_BAD.length)];
        keyRef.current += 1;
        const item: Item = { key: keyRef.current, lane: Math.floor(Math.random() * LANES), y: -20, good, icon: good ? g.icon : b.icon, comment: good ? undefined : b.comment, speed: 120 + Math.random() * 80 + caught * 6 };
        setItems((it) => [...it, item]);
      }
      setItems((it) => {
        const next: Item[] = [];
        for (const i of it) {
          const y = i.y + i.speed * dt;
          if (y >= 320 && y - i.speed * dt < 320 && i.lane === laneRef.current) {
            if (i.good) {
              audio.play('combo');
              setCaught((c) => c + 1);
            } else {
              audio.play('hurt');
              setLives((l) => l - 1);
              setComment(i.comment ?? 'Spice Level: Emotional Damage.');
              window.setTimeout(() => setComment(''), 1800);
            }
            continue;
          }
          if (y > 380) continue;
          next.push({ ...i, y });
        }
        return next;
      });
      if (stateRef.current === 'play') raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [state, audio, caught]);

  useEffect(() => {
    if (state !== 'play') return;
    if (caught >= GOAL) {
      setState('won');
      audio.play('fanfare');
      gs.set('kimchiWon', true);
      gs.addXp(40);
      ach.unlock('kimchimaster');
      game.fx.current?.confetti(570, 760, 70);
    } else if (lives <= 0) {
      setState('lost');
      audio.play('gameover');
    }
  }, [caught, lives, state, audio, gs, ach, game]);

  const start = () => {
    setItems([]);
    setCaught(0);
    setLives(LIVES);
    setComment('');
    laneRef.current = 2;
    setLane(2);
    setState('play');
    audio.play('arcade');
  };

  const onPointer = (e: React.PointerEvent) => {
    if (state !== 'play') return;
    const rect = fieldRef.current!.getBoundingClientRect();
    const l = Math.floor(((e.clientX - rect.left) / rect.width) * LANES);
    laneRef.current = Math.max(0, Math.min(LANES - 1, l));
    setLane(laneRef.current);
  };

  return (
    <div className="stack">
      <div className={styles.score}>
        <span>KIMCHI <b>{caught}/{GOAL}</b></span>
        <span className={styles.lives}>{'♥'.repeat(Math.max(0, lives))}{'♡'.repeat(Math.max(0, LIVES - lives))}</span>
      </div>
      <PxBar value={caught} max={GOAL} variant="green" />
      <div ref={fieldRef} className={styles.kimchiField} onPointerDown={onPointer} onPointerMove={(e) => e.buttons > 0 && onPointer(e)} aria-label="Kimchi Combo Spielfeld">
        <div className={styles.lanes} aria-hidden>{Array.from({ length: LANES }, (_, i) => <span key={i} />)}</div>
        {items.map((i) => (
          <span key={i.key} className={styles.falling} style={{ left: `${((i.lane + 0.5) / LANES) * 100}%`, top: i.y }}>
            <Sprite name={i.icon} scale={5} style={{ filter: i.good ? 'drop-shadow(0 0 4px #4cd964)' : 'drop-shadow(0 0 4px #ff5c5c)' }} />
          </span>
        ))}
        <div className={styles.bowl} style={{ left: `${((lane + 0.5) / LANES) * 100}%` }} aria-hidden>
          <Sprite name="cabbage" scale={3} />
        </div>
        {comment && <div className={styles.comment}>{comment}</div>}
        {state === 'idle' && (
          <div className={styles.comment} style={{ top: '40%', fontSize: 10, lineHeight: 1.8 }}>
            Fang Kohl, Chili, Knoblauch, Ingwer, Frühlingszwiebel.<br />Keine Donuts. Keine Socken.<br />Pfeiltasten, Tippen oder Ziehen.
          </div>
        )}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        {state === 'play' && (
          <>
            <PxButton onClick={() => move(-1)}>◀</PxButton>
            <PxButton onClick={() => move(1)}>▶</PxButton>
          </>
        )}
        {state !== 'play' && <PxButton onClick={start} autoFocus>{state === 'idle' ? 'Start' : 'Nochmal'}</PxButton>}
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
      {state === 'won' && (
        <div className={`pxbox dark ${styles.result}`}>
          <div className={styles.resultTitle}>KIMCHI MASTER UNLOCKED</div>
          <p>Fermentiert, scharf, perfekt. Wie du mit 33.</p>
        </div>
      )}
      {state === 'lost' && (
        <div className={`pxbox dark ${styles.result}`}>
          <div className={styles.resultTitle}>Spice Level: Emotional Damage.</div>
          <p>{caught} von {GOAL} Zutaten. Das Rezept wurde an den Donut verraten.</p>
        </div>
      )}
    </div>
  );
}
