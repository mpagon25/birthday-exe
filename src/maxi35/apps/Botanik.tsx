import { useEffect, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import { PixelIcon } from '../desktop/PixelIcon';
import styles from './Apps.module.css';

const ICONS = ['clover', 'mushroom', 'plant', 'potplant', 'leaf', 'lotus', 'pretzel', 'glowshroom'];

interface Card {
  icon: string;
  face: boolean;
  done: boolean;
}

function deal(): Card[] {
  const cards = [...ICONS, ...ICONS].map((icon) => ({ icon, face: false, done: false }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function Botanik({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [cards, setCards] = useState<Card[]>(deal);
  const [openIdx, setOpenIdx] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [lock, setLock] = useState(false);
  const [won, setWon] = useState(false);
  useInterval(() => setTime((t) => t + 1), 1000, moves > 0 && !won);

  const flip = (i: number) => {
    if (lock || won || cards[i].face || cards[i].done) return;
    audio.play('click');
    const next = cards.map((c, k) => (k === i ? { ...c, face: true } : c));
    setCards(next);
    const open = [...openIdx, i];
    setOpenIdx(open);
    if (open.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [x, y] = open;
      if (next[x].icon === next[y].icon) {
        window.setTimeout(() => {
          setCards((cs) => cs.map((c, k) => (k === x || k === y ? { ...c, done: true } : c)));
          setOpenIdx([]);
          setLock(false);
          audio.play(next[x].icon === 'glowshroom' ? 'glitch' : 'coin');
          if (next[x].icon === 'glowshroom') a.confetti({ x: 760, y: 500, count: 40 });
        }, 350);
      } else {
        window.setTimeout(() => {
          setCards((cs) => cs.map((c, k) => (k === x || k === y ? { ...c, face: false } : c)));
          setOpenIdx([]);
          setLock(false);
          audio.play('tick');
        }, 750);
      }
    }
  };

  useEffect(() => {
    if (!won && cards.length && cards.every((c) => c.done)) {
      setWon(true);
      audio.play('fanfare');
      ach.unlock('herbalist');
      if (!game.data.memoryBest || moves < game.data.memoryBest) game.set('memoryBest', moves);
      if (moves <= 16) {
        game.collect('glowshroom');
        a.confetti({ count: 90 });
      }
    }
  }, [cards, won, audio, ach, game, moves, a]);

  const reset = () => {
    setCards(deal());
    setOpenIdx([]);
    setMoves(0);
    setTime(0);
    setWon(false);
    setLock(false);
    audio.play('open');
  };

  return (
    <div className={styles.pane}>
      <div className={styles.row} style={{ justifyContent: 'space-between' }}>
        <b>🌿 Botanik.exe</b>
        <span className={styles.muted}>Züge: {moves} · Zeit: {time}s · Rekord: {game.data.memoryBest || '–'}</span>
      </div>
      <div className={styles.muted}>Acht Pflanzenpaare, ein Gedächtnis. In 16 Zügen oder weniger leuchtet der Pilz.</div>
      <div className={styles.memGrid} role="grid" aria-label="Memory">
        {cards.map((c, i) => (
          <button key={i} className={`btn ${styles.memCard} ${c.face || c.done ? styles.face : ''} ${c.done ? styles.done : ''} ${c.done && c.icon === 'glowshroom' ? styles.glow : ''}`} onClick={() => flip(i)} aria-label={c.face || c.done ? c.icon : 'verdeckt'}>
            {c.face || c.done ? <PixelIcon name={c.icon} size={40} /> : <span className={styles.memBack}>?</span>}
          </button>
        ))}
      </div>
      {won && <div className="field" style={{ textAlign: 'center' }}>Alle Paare in {moves} Zügen und {time}s. {moves <= 16 ? 'Der Leuchtpilz ist dein.' : 'Unter 17 Zügen gibt es den Leuchtpilz.'}</div>}
      <div className={styles.buttons}>
        <button className="btn primary" onClick={reset}>Neu mischen</button>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
