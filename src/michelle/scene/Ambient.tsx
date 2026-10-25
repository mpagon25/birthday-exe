import { useMemo } from 'react';
import { Sprite } from '../sprites/Sprite';
import styles from './Scene.module.css';

const TWINKLES: Array<[number, number]> = [[575, 160], [995, 150], [505, 372], [700, 662], [870, 672], [935, 672], [1000, 672], [1065, 672], [1130, 640], [1250, 650], [760, 540]];
const CODE = ['> npm run birthday', 'compiling cats...', 'warning: 33 found', 'tests: 0 passed', '> whiskey --force', 'ok.', '> git blame age', 'fatal: no', 'loading level 33', 'purr.exe running'];

export function Ambient({ questReady }: { questReady: boolean }) {
  const hearts = useMemo(() => Array.from({ length: 4 }, (_, i) => ({ left: 300 + i * 40, delay: i * 1.3, dx: (Math.random() - 0.5) * 80 })), []);
  const dust = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ left: 100 + Math.random() * 1300, top: 100 + Math.random() * 600, delay: i * 0.9, dx: (Math.random() - 0.5) * 120, dy: -60 - Math.random() * 120 })), []);
  return (
    <div className={styles.layer} aria-hidden>
      <div className={`${styles.fx} ${styles.glow} ${styles.lantern}`} style={{ left: 225, top: 30, width: 90, height: 110 }} />
      <div className={`${styles.fx} ${styles.glow} ${styles.lantern}`} style={{ left: 1200, top: 20, width: 80, height: 100, animationDelay: '0.2s' }} />
      <div className={`${styles.fx} ${styles.glow} ${styles.candle}`} style={{ left: 560, top: 625, width: 70, height: 80 }} />
      <div className={`${styles.fx} ${styles.glow} ${styles.candle}`} style={{ left: 1050, top: 395, width: 70, height: 80, animationDelay: '0.1s' }} />
      <div className={`${styles.fx} ${styles.glow} ${styles.candle}`} style={{ left: 1075, top: 680, width: 60, height: 60, animationDelay: '0.15s' }} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonPink} ${styles.neonFlicker}`} style={{ left: 20, top: 10, width: 150, height: 290, borderRadius: 30 }} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonPink}`} style={{ left: 1410, top: 10, width: 130, height: 210, borderRadius: 30, animationDelay: '1.2s' }} />
      <div className={`${styles.fx} ${styles.neon} ${styles.neonPink}`} style={{ left: 540, top: 230, width: 500, height: 110, borderRadius: 40, animationDelay: '0.6s', opacity: 0.5 }} />
      <div className={`${styles.fx} ${styles.calendarGlow} ${questReady ? styles.calendarReady : ''}`} style={{ left: 810, top: 320, width: 220, height: 160, borderRadius: 40 }} />
      <div className={`${styles.fx} ${styles.pool}`} style={{ left: 215, top: 262, width: 215, height: 70 }} />
      {TWINKLES.map(([x, y], i) => (
        <span key={i} className={styles.twinkle} style={{ left: x, top: y, animationDelay: `${(i * 0.41) % 2.2}s` }} />
      ))}
      <span className={styles.foam} />
      {hearts.map((h, i) => (
        <span key={i} className={styles.heartFloat} style={{ left: h.left, top: 330, animationDelay: `${h.delay + 2}s`, ['--dx' as string]: `${h.dx}px` }}>
          <Sprite name="heartSmall" scale={4} />
        </span>
      ))}
      {dust.map((d, i) => (
        <span key={i} className={styles.dust} style={{ left: d.left, top: d.top, animationDelay: `${d.delay}s`, ['--dx' as string]: `${d.dx}px`, ['--dy' as string]: `${d.dy}px` }} />
      ))}
      <div className={styles.laptop}>
        <div className={styles.code}>
          {[...CODE, ...CODE].map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        <span className={styles.dot} />
      </div>
      {[[1125, 290], [1250, 320], [1330, 20], [1465, 160], [20, 420]].map(([x, y], i) => (
        <span key={i} className={styles.leaf} style={{ left: x, top: y, animationDelay: `${i * 0.7}s` }}>
          <Sprite name="sprout" scale={3} />
        </span>
      ))}
      <span className={styles.eyelid} style={{ left: 1329, top: 341 }} />
      <span className={styles.eyelid} style={{ left: 1347, top: 341 }} />
      <span className={styles.tail} />
      <span className={styles.zzz} style={{ left: 120, top: 475 }}>z</span>
      <span className={styles.zzz} style={{ left: 132, top: 470, animationDelay: '1s' }}>Z</span>
      <span className={styles.slothIdle}>
        <Sprite name="slothPaw" scale={4} />
      </span>
    </div>
  );
}
