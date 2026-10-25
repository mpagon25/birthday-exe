import { useEffect, useRef, useState } from 'react';
import { useWindowManager } from './WindowManager';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import { usePageVisible } from '../../shared/hooks/usePageVisible';
import { TASKBAR_MESSAGES } from '../content/texts';
import { Icon } from './icons';
import { StartMenu } from './StartMenu';
import styles from './Chrome.module.css';

const PINNED: Array<{ appId: string; label: string; icon: string }> = [
  { appId: 'whiskeytasting', label: 'WhiskeyTasting.exe', icon: 'whiskey' },
  { appId: 'boulder', label: 'Bouldern.exe', icon: 'climb' },
  { appId: 'gamenight', label: 'GameNight.exe', icon: 'game' },
  { appId: 'kaffee', label: 'Kaffee_irl.exe', icon: 'coffee' },
];

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useInterval(() => setNow(new Date()), 1000);
  return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function Taskbar() {
  const wm = useWindowManager();
  const a = useActions();
  const audio = useAudio();
  const game = useGameState();
  const ach = useAchievements();
  const visible = usePageVisible();
  const clock = useClock();
  const [startOpen, setStartOpen] = useState(false);
  const [volOpen, setVolOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(3);
  const trayRef = useRef<HTMLDivElement>(null);

  useInterval(() => setMsgIndex((i) => (i + 1) % TASKBAR_MESSAGES.length), 6000, visible);
  useInterval(
    () => setProgress((p) => (p >= 16 ? Math.floor(Math.random() * 4) : p + 1 + Math.floor(Math.random() * 2))),
    700,
    visible,
  );

  useEffect(() => {
    if (!volOpen) return;
    const onDown = (e: PointerEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) setVolOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [volOpen]);

  const taskWindows = wm.windows.filter((w) => !w.skipTaskbar);

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      <div className={styles.taskbar} role="toolbar" aria-label="Taskbar">
        <button
          className={`btn ${styles.startBtn} ${startOpen ? 'pressed' : ''}`}
          onClick={() => {
            audio.play('click');
            setStartOpen((o) => !o);
          }}
          aria-haspopup="menu"
          aria-expanded={startOpen}
        >
          <span className={styles.flag} aria-hidden>
            <i style={{ background: '#f00' }} />
            <i style={{ background: '#0a0' }} />
            <i style={{ background: '#00f' }} />
            <i style={{ background: '#ff0' }} />
          </span>
          Start
        </button>
        <span className={styles.taskSep} />
        {PINNED.map((p) => (
          <button
            key={p.appId}
            className={`btn ${styles.taskBtn} ${wm.isOpen(p.appId) ? styles.activeTask : ''}`}
            onClick={() => {
              audio.play('click');
              const existing = wm.windows.find((w) => w.appId === p.appId);
              if (existing) wm.toggle(existing.id);
              else a.openApp(p.appId);
            }}
          >
            <Icon name={p.icon} size={16} />
            <span>{p.label}</span>
          </button>
        ))}
        {taskWindows.filter((w) => !PINNED.some((p) => p.appId === w.appId)).length > 0 && <span className={styles.taskSep} />}
        {taskWindows
          .filter((w) => !PINNED.some((p) => p.appId === w.appId))
          .map((w) => (
            <button
              key={w.id}
              className={`btn ${styles.taskBtn} ${wm.activeId === w.id ? styles.activeTask : ''} ${w.minimized ? styles.minimizedTask : ''}`}
              onClick={() => {
                audio.play('click');
                wm.toggle(w.id);
              }}
            >
              <Icon name={w.icon} size={16} />
              <span>{w.title}</span>
            </button>
          ))}
        <div className={styles.taskMiddle}>
          <div className={`progress green ${styles.taskProgress}`} aria-hidden>
            <div className="blocks">
              {Array.from({ length: progress }).map((_, i) => (
                <span key={i} className="block" />
              ))}
            </div>
          </div>
          <div className={`${styles.taskMsg} field`} aria-live="polite">
            {TASKBAR_MESSAGES[msgIndex]}
          </div>
          <button className={`bevel-thin-in ${styles.pintCounter}`} onClick={a.pourPint} title="Noch eins?">
            🍺 Pints poured: {game.data.pints}
          </button>
        </div>
        <div className={`bevel-thin-in ${styles.tray}`} ref={trayRef}>
          <button className={styles.trayBtn} title={`Achievements: ${ach.count}/${ach.total}`} onClick={() => a.openApp('achievements')} aria-label="Achievements">
            🏆
          </button>
          <button className={styles.trayBtn} title="Spielstand gespeichert" onClick={() => a.notify('Speicherstand', 'Spielstand gespeichert. Checkpoint: Irish Pub.', 'ok')} aria-label="Speicherstand">
            💾
          </button>
          <button className={styles.trayBtn} title="Lautstärke" onClick={() => setVolOpen((o) => !o)} aria-label="Lautstärke" aria-expanded={volOpen}>
            {audio.muted ? '🔇' : audio.volume < 0.4 ? '🔉' : '🔊'}
          </button>
          <button className={styles.trayBtn} title="Es ist immer Nacht im Pub" aria-label="Mond" onClick={() => a.notify('Uhrzeit', 'Es ist spät. Aber nicht zu spät für ein letztes Pint.', 'info')}>
            🌙
          </button>
          <span className={styles.clock} aria-label="Uhrzeit">{clock}</span>
          {volOpen && (
            <div className={`bevel-out ${styles.volumePop}`}>
              <span>Vol</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(audio.volume * 100)}
                onChange={(e) => audio.setVolume(parseInt(e.target.value, 10) / 100)}
                aria-label="Lautstärke"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input type="checkbox" checked={audio.muted} onChange={(e) => audio.setMuted(e.target.checked)} />
                Mute
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
