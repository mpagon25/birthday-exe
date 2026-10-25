import { useMemo } from 'react';
import styles from './Scene.module.css';

const TWINKLES: Array<[number, number]> = [
  [470, 62], [540, 70], [610, 64], [680, 72], [750, 60], [820, 70], [890, 62], [960, 68], [1030, 72],
  [120, 300], [160, 420], [1400, 140], [1380, 300], [1395, 380], [1130, 150], [1090, 440],
];

export function Ambient({ discoBoost, neonBlink }: { discoBoost: boolean; neonBlink: boolean }) {
  const embers = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ left: 110 + Math.random() * 70, delay: i * 0.3, dx: (Math.random() - 0.5) * 40 })), []);
  const puffs = useMemo(() => Array.from({ length: 5 }, (_, i) => ({ delay: i * 0.8, dx: 10 + Math.random() * 30 })), []);
  const floaters = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ left: 150 + Math.random() * 1250, top: 500 + Math.random() * 400, delay: i * 2.3, dx: (Math.random() - 0.5) * 160, glyph: i % 3 === 0 ? '🍀' : i % 3 === 1 ? '☘️' : '✦' })),
    [],
  );
  return (
    <div aria-hidden>
      <div className={`${styles.fx} ${styles.fire}`} />
      {embers.map((e, i) => (
        <span key={i} className={styles.ember} style={{ left: e.left, top: 590, animationDelay: `${e.delay}s`, ['--dx' as string]: `${e.dx}px` }} />
      ))}
      <div className={`${styles.fx} ${styles.neon} ${styles.neonPub} ${neonBlink ? styles.neonBlink : ''}`} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonClover} ${neonBlink ? styles.neonBlink : ''}`} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonGood} ${neonBlink ? styles.neonBlink : ''}`} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonSlainte} ${neonBlink ? styles.neonBlink : ''}`} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonPlants} ${neonBlink ? styles.neonBlink : ''}`} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonGaming}`} />
      <div className={`${styles.fx} ${styles.disco} ${discoBoost ? styles.discoFast : ''}`} />
      <div className={`${styles.fx} ${styles.discoRay} ${discoBoost ? styles.discoFast : ''}`} />
      <div className={`${styles.fx} ${styles.shroom} ${styles.shroomL}`} />
      <div className={`${styles.fx} ${styles.shroom} ${styles.shroomR}`} />
      <div className={`${styles.fx} ${styles.shroom} ${styles.shroomR2}`} />
      {puffs.map((p, i) => (
        <span key={i} className={styles.smokePuff} style={{ animationDelay: `${p.delay}s`, ['--dx' as string]: `${p.dx}px` }} />
      ))}
      {TWINKLES.map(([x, y], i) => (
        <span key={i} className={styles.twinkle} style={{ left: x, top: y, animationDelay: `${(i * 0.37) % 1.8}s` }} />
      ))}
      {floaters.map((f, i) => (
        <span key={i} className={styles.floater} style={{ left: f.left, top: f.top, animationDelay: `${f.delay}s`, ['--dx' as string]: `${f.dx}px` }}>
          {f.glyph}
        </span>
      ))}
      <span className={styles.zzz} style={{ left: 250, top: 585 }}>z</span>
      <span className={styles.zzz} style={{ left: 262, top: 580, animationDelay: '0.8s' }}>Z</span>
      <span className={styles.zzz} style={{ left: 1150, top: 770, animationDelay: '0.4s' }}>z</span>
      <span className={styles.zzz} style={{ left: 1162, top: 765, animationDelay: '1.3s' }}>z</span>
      <span className={styles.zzz} style={{ left: 1490, top: 890, animationDelay: '1s' }}>z</span>
      <span className={styles.glint} style={{ left: 556, top: 540 }} />
      <span className={styles.glint} style={{ left: 390, top: 622, animationDelay: '2.5s' }} />
      <span className={styles.glint} style={{ left: 1308, top: 452, animationDelay: '4s' }} />
      <span className={styles.glint} style={{ left: 1100, top: 300, animationDelay: '1.2s' }} />
      <span className={styles.foam} />
    </div>
  );
}
