import { useEffect, useRef } from 'react';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Chrome.module.css';

interface Item {
  label: string;
  icon: string;
  action: () => void;
}

export function StartMenu({ onClose }: { onClose: () => void }) {
  const a = useActions();
  const audio = useAudio();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target) && !target.closest('[aria-haspopup="menu"]')) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    ref.current?.querySelector('button')?.focus();
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const programs: Item[] = [
    { label: 'Internet Explorer – The Rabbit Hole', icon: '🌐', action: () => a.openApp('ie') },
    { label: 'My Computer – Inventory', icon: '💻', action: () => a.openApp('inventory') },
    { label: 'Achievements.exe', icon: '🏆', action: () => a.openApp('achievements') },
    { label: 'Paint.exe', icon: '🎨', action: () => a.openApp('paint') },
    { label: 'Tavern Radio', icon: '📻', action: () => a.openApp('radio') },
    { label: 'QuestLog.exe', icon: '📜', action: () => a.openApp('questlog') },
    { label: 'WhiskeyTasting.exe', icon: '🥃', action: () => a.openApp('whiskeytasting') },
    { label: 'Bouldern.exe', icon: '🧗', action: () => a.openApp('boulder') },
    { label: 'GameNight.exe', icon: '🎮', action: () => a.openApp('gamenight') },
    { label: 'Kaffee_irl.exe', icon: '☕', action: () => a.openApp('kaffee') },
    { label: 'W20.exe', icon: '🎲', action: () => a.openApp('dice') },
  ];
  const system: Item[] = [
    { label: 'Einstellungen', icon: '⚙️', action: () => a.openApp('settings') },
    { label: 'Ausführen...', icon: '▶️', action: () => a.openApp('run') },
    { label: 'Hilfe', icon: '❓', action: () => a.openApp('about') },
    { label: 'Beenden...', icon: '🚪', action: a.shutdown },
  ];

  const run = (item: Item) => {
    audio.play('click');
    onClose();
    item.action();
  };

  return (
    <div className={`bevel-out ${styles.startMenu}`} ref={ref} role="menu" aria-label="Startmenü">
      <div className={styles.startSide}>
        <b>Happy</b>35
      </div>
      <div className={styles.startList}>
        <div className={styles.startHeader}>Programme</div>
        {programs.map((p) => (
          <button key={p.label} className={styles.startItem} role="menuitem" onClick={() => run(p)}>
            <span className={styles.big} aria-hidden>{p.icon}</span>
            {p.label}
          </button>
        ))}
        <div className="sep" />
        {system.map((p) => (
          <button key={p.label} className={styles.startItem} role="menuitem" onClick={() => run(p)}>
            <span className={styles.big} aria-hidden>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
