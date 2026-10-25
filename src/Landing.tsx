import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { engine } from './shared/audio/engine';
import { useReducedMotion } from './shared/hooks/useReducedMotion';
import styles from './Landing.module.css';

type World = 'michelle33' | 'maxi35';

const WORLDS: Array<{ id: World; player: string; title: string; level: string }> = [
  { id: 'michelle33', player: 'P1', title: 'MICHELLE.EXE', level: 'LEVEL 33' },
  { id: 'maxi35', player: 'P2', title: 'MAXI35.EXE', level: 'LEVEL 35' },
];

export function Landing() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<World | null>(null);
  const navigating = useRef(false);

  const select = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, w: World) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      engine.unlock();
      engine.play('coin');
      setSelected(w);
      window.setTimeout(
        () => {
          window.history.pushState(null, '', `/${w}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        },
        reduced ? 0 : 700,
      );
    },
    [reduced],
  );

  useEffect(() => {
    const unlock = () => engine.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  return (
    <main className={`${styles.page} ${selected ? styles.leaving : ''}`} aria-label="Spielauswahl">
      <div className={styles.scanlines} aria-hidden />
      <header className={styles.header}>
        <h1 className={styles.title}>SELECT PLAYER</h1>
      </header>
      <div className={styles.slots}>
        {WORLDS.map((w) => (
          <a
            key={w.id}
            href={`/${w.id}`}
            className={`${styles.cart} ${styles[w.id]} ${selected === w.id ? styles.selected : ''} ${selected && selected !== w.id ? styles.dim : ''}`}
            onMouseEnter={() => engine.unlocked && engine.play('hover')}
            onClick={(e) => select(e, w.id)}
            aria-label={`${w.title} – ${w.level}`}
          >
            <span className={styles.grip} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.label}>
              <span className={styles.player}>{w.player}</span>
              <span className={styles.name}>{w.title}</span>
              <span className={styles.level}>{w.level}</span>
            </span>
            <span className={styles.press}>PRESS START</span>
          </a>
        ))}
      </div>
      <footer className={styles.footer}>INSERT CARTRIDGE TO CONTINUE</footer>
    </main>
  );
}
