import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import { PixelIcon } from '../desktop/PixelIcon';
import styles from './Apps.module.css';

const SIZE = 9;
const MINES = 10;

interface Cell {
  mine: boolean;
  open: boolean;
  flag: boolean;
  n: number;
}

function emptyBoard(): Cell[] {
  return Array.from({ length: SIZE * SIZE }, () => ({ mine: false, open: false, flag: false, n: 0 }));
}

function neighbors(i: number): number[] {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) out.push(nr * SIZE + nc);
    }
  return out;
}

function placeMines(board: Cell[], safe: number): Cell[] {
  const b = board.map((c) => ({ ...c }));
  const forbidden = new Set([safe, ...neighbors(safe)]);
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * SIZE * SIZE);
    if (forbidden.has(i) || b[i].mine) continue;
    b[i].mine = true;
    placed += 1;
  }
  for (let i = 0; i < b.length; i++) b[i].n = neighbors(i).filter((j) => b[j].mine).length;
  return b;
}

export function Pintsweeper({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<'play' | 'won' | 'lost'>('play');
  const [flagMode, setFlagMode] = useState(false);
  const [time, setTime] = useState(0);
  useInterval(() => setTime((t) => t + 1), 1000, started && state === 'play');

  const flags = useMemo(() => board.filter((c) => c.flag).length, [board]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setStarted(false);
    setState('play');
    setTime(0);
    audio.play('open');
  }, [audio]);

  const reveal = (b: Cell[], i: number) => {
    const stack = [i];
    while (stack.length) {
      const k = stack.pop()!;
      const c = b[k];
      if (c.open || c.flag) continue;
      c.open = true;
      if (c.n === 0 && !c.mine) neighbors(k).forEach((j) => !b[j].open && stack.push(j));
    }
  };

  const click = (i: number, rightClick = false) => {
    if (state !== 'play') return;
    let b = board.map((c) => ({ ...c }));
    if (!started) {
      b = placeMines(b, i);
      setStarted(true);
    }
    const cell = b[i];
    if (rightClick || flagMode) {
      if (cell.open) return;
      cell.flag = !cell.flag;
      audio.play('tick');
      setBoard(b);
      return;
    }
    if (cell.flag || cell.open) return;
    if (cell.mine) {
      b.forEach((c) => c.mine && (c.open = true));
      setBoard(b);
      setState('lost');
      audio.play('explosion');
      window.setTimeout(() => a.notify('Pintsweeper', 'Pint verschüttet. Der Tresen ist nass, die Würde auch.', 'error'), 300);
      return;
    }
    reveal(b, i);
    audio.play('click');
    setBoard(b);
    const won = b.every((c) => c.mine || c.open);
    if (won) {
      setState('won');
      audio.play('fanfare');
      game.inc('sweeperWins');
      ach.unlock('pintsweeper');
      game.collect('medal');
      a.confetti({ count: 80 });
    }
  };

  useEffect(() => {
    const prevent = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-sweeper]')) e.preventDefault();
    };
    window.addEventListener('contextmenu', prevent);
    return () => window.removeEventListener('contextmenu', prevent);
  }, []);

  return (
    <div className={styles.pane}>
      <div className={styles.sweepHead}>
        <span className={styles.lcd} aria-label="Verbleibende Pints">{String(Math.max(0, MINES - flags)).padStart(3, '0')}</span>
        <button className={`btn ${styles.smiley}`} onClick={reset} aria-label="Neues Spiel">{state === 'won' ? '😎' : state === 'lost' ? '😵' : '🙂'}</button>
        <span className={styles.lcd} aria-label="Zeit">{String(Math.min(999, time)).padStart(3, '0')}</span>
      </div>
      <div className={styles.sweepGrid} data-sweeper role="grid" aria-label="Pintsweeper Spielfeld">
        {board.map((c, i) => (
          <button
            key={i}
            className={`btn ${styles.cell} ${c.open ? styles.open : ''} ${c.open && c.mine ? styles.mine : ''} ${c.open && c.n ? styles[`n${c.n}`] : ''}`}
            onClick={() => click(i)}
            onContextMenu={(e) => {
              e.preventDefault();
              click(i, true);
            }}
            aria-label={c.open ? (c.mine ? 'Pint' : `${c.n}`) : c.flag ? 'Markiert' : 'verdeckt'}
          >
            {c.open ? (c.mine ? <PixelIcon name="beer" size={20} /> : c.n || '') : c.flag ? <PixelIcon name="flag" size={18} /> : ''}
          </button>
        ))}
      </div>
      <div className={styles.row} style={{ justifyContent: 'center' }}>
        <button className={`btn small ${flagMode ? 'pressed' : ''}`} onClick={() => setFlagMode((f) => !f)} aria-pressed={flagMode}>🚩 Markier-Modus {flagMode ? 'an' : 'aus'}</button>
        <span className={styles.muted}>Rechtsklick markiert · Siege: {game.data.sweeperWins}</span>
      </div>
      <div className={styles.muted} style={{ textAlign: 'center' }}>
        {state === 'won' ? 'Alle Pints gefunden, keins verschüttet. Medaille!' : state === 'lost' ? 'Pint verschüttet. Smiley klicken für ein neues Feld.' : 'Zehn Pints stehen irgendwo auf dem Tresen. Finde die freien Felder, ohne eines umzustoßen.'}
      </div>
      <div className={styles.buttons}>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
