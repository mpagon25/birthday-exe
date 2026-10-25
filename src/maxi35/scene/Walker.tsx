import { useMemo } from 'react';
import styles from './Scene.module.css';

// 10x12 pixel hero. Letters map to colours.
const HERO = [
  '...GGGG...',
  '..GGGGGG..',
  '..SSSSSS..',
  '..SBSSBS..',
  '..SSSSSS..',
  '...SSSS...',
  '.GGGGGGGG.',
  'SGGGGGGGGS',
  '..GGGGGG..',
  '..BB..BB..',
  '..BB..BB..',
  '.NN....NN.',
];
const COLORS: Record<string, string> = { G: '#2fa34a', S: '#f2c9a0', B: '#5a3a1a', N: '#2b1a0a' };

export function HeroSprite({ tint }: { tint?: string }) {
  const cells = useMemo(() => HERO.flatMap((row) => row.split('')), []);
  return (
    <span className={styles.sprite} aria-hidden>
      {cells.map((c, i) => (
        <i key={i} style={{ background: c === '.' ? 'transparent' : c === 'G' && tint ? tint : COLORS[c] }} />
      ))}
    </span>
  );
}

export function Walker({ active, dance, onClick }: { active: boolean; dance: boolean; onClick: () => void }) {
  if (!active && !dance) return null;
  return (
    <button className={`${styles.walker} ${dance ? styles.dance : ''}`} style={dance ? { left: 700 } : undefined} onClick={onClick} aria-label="Pixel-Held">
      <HeroSprite />
    </button>
  );
}
