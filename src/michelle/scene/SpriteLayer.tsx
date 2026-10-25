import { useEffect, useState } from 'react';
import type { SpriteKind } from '../state/GameContext';
import { Sprite } from '../sprites/Sprite';
import styles from './Scene.module.css';

export interface SpriteItem {
  key: number;
  kind: SpriteKind;
}

const DURATION: Record<SpriteKind, number> = { cat: 11500, bat: 6200, viking: 4700, palm: 5200, poolsloth: 12200, football: 2600, slothpaw: 6200, notes: 2600 };

function Frames({ a, b, scale, ms = 180 }: { a: string; b: string; scale: number; ms?: number }) {
  const [f, setF] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setF((x) => !x), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return <Sprite name={f ? b : a} scale={scale} />;
}

function One({ item, onDone, headbang }: { item: SpriteItem; onDone: () => void; headbang: boolean }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DURATION[item.kind]);
    return () => window.clearTimeout(t);
  }, [item, onDone]);
  switch (item.kind) {
    case 'cat':
      return (
        <div className={`${styles.sprite} ${styles.catWalk} ${headbang ? styles.headbang : ''}`}>
          <Frames a="catWalk1" b="catWalk2" scale={4} />
        </div>
      );
    case 'bat':
      return (
        <div className={`${styles.sprite} ${styles.bat}`}>
          <Frames a="batA" b="batB" scale={4} ms={120} />
        </div>
      );
    case 'viking':
      return (
        <div className={`${styles.sprite} ${styles.viking}`}>
          <div className={styles.bubble} style={{ left: 30, top: -46, fontSize: 16 }}>Skål!</div>
          <Sprite name="viking" scale={5} />
        </div>
      );
    case 'palm':
      return (
        <div className={`${styles.sprite} ${styles.palm}`}>
          <Sprite name="palm" scale={5} />
        </div>
      );
    case 'poolsloth':
      return (
        <div className={`${styles.sprite} ${styles.poolSloth}`}>
          <Sprite name="poolSloth" scale={3} />
        </div>
      );
    case 'football':
      return (
        <>
          <div className={`${styles.sprite} ${styles.football}`}>
            <Sprite name="football" scale={4} />
          </div>
          <div className={styles.miaText}>MIA SAN MIA!</div>
        </>
      );
    case 'slothpaw':
      return (
        <div className={`${styles.sprite} ${styles.slothPaw}`}>
          <Sprite name="slothPaw" scale={5} />
        </div>
      );
    case 'notes':
      return (
        <div className={styles.notesWrap}>
          {[[120, 480], [220, 500], [1330, 290], [300, 440], [1380, 320], [160, 460]].map(([x, y], i) => (
            <span key={i} className={styles.note} style={{ left: x, top: y, animationDelay: `${i * 0.2}s` }}>
              <Sprite name="note" scale={4} style={{ filter: 'drop-shadow(0 0 4px #ff3fa4)' }} />
            </span>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function SpriteLayer({ items, remove, headbang }: { items: SpriteItem[]; remove: (key: number) => void; headbang: boolean }) {
  return (
    <div className={styles.layer} aria-hidden>
      {items.map((it) => (
        <One key={it.key} item={it} onDone={() => remove(it.key)} headbang={headbang} />
      ))}
    </div>
  );
}
