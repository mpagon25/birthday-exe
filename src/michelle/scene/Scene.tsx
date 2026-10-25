import { Ambient } from './Ambient';
import { Hotspots } from './Hotspots';
import { BottomBar } from './BottomBar';
import { SpriteLayer, type SpriteItem } from './SpriteLayer';
import { Sprite } from '../sprites/Sprite';
import type { ReactionKind } from '../state/GameContext';
import styles from './Scene.module.css';

export interface Bubble {
  key: number;
  text: string;
  x: number;
  y: number;
}
export interface XpPop {
  key: number;
  x: number;
  y: number;
  amount: number;
}

export function Scene({
  effects,
  reduced,
  questReady,
  bubbles,
  xpPops,
  sprites,
  removeSprite,
  reaction,
  metal,
  chaos,
  god,
  shaking,
  dark,
  partyHat,
}: {
  effects: boolean;
  reduced: boolean;
  questReady: boolean;
  bubbles: Bubble[];
  xpPops: XpPop[];
  sprites: SpriteItem[];
  removeSprite: (key: number) => void;
  reaction: ReactionKind | null;
  metal: boolean;
  chaos: boolean;
  god: boolean;
  shaking: boolean;
  dark: boolean;
  partyHat: boolean;
}) {
  const headClass = reaction === 'headbang' || metal ? styles.headbang : reaction === 'shake' ? styles.shakeHead : '';
  return (
    <div className={`${styles.scene} ${metal && !reduced ? styles.metal : ''} ${shaking && !reduced ? styles.shaking : ''}`} aria-label="Irish Pub">
      {effects && !reduced && <Ambient questReady={questReady} />}
      {headClass && !reduced && <div className={`${styles.head} ${headClass}`} aria-hidden />}
      <Hotspots />
      <BottomBar />
      <SpriteLayer items={sprites} remove={removeSprite} headbang={metal} />
      {reaction === 'heart' && (
        <span className={styles.reactHeart} aria-hidden>
          <Sprite name="heart" scale={6} />
        </span>
      )}
      {reaction === 'horns' && (
        <span className={styles.reactHorns} aria-hidden>
          <Sprite name="horns" scale={4} />
        </span>
      )}
      {partyHat && (
        <span className={styles.partyHat} aria-hidden>
          <Sprite name="partyHat" scale={5} />
        </span>
      )}
      {questReady && (
        <span className={styles.excl} aria-hidden>
          <Sprite name="exclaim" scale={5} />
        </span>
      )}
      {bubbles.map((b) => (
        <div key={b.key} className={styles.bubble} style={{ left: b.x, top: b.y }} role="status">
          {b.text}
        </div>
      ))}
      {xpPops.map((p) => (
        <span key={p.key} className={styles.xpPop} style={{ left: p.x, top: p.y }}>
          +{p.amount} XP
        </span>
      ))}
      {metal && <div className={styles.metalTint} aria-hidden />}
      {chaos && <div className={styles.chaosTint} aria-hidden />}
      {god && <div className={styles.godTint} aria-hidden />}
      <div className={styles.dark} style={{ opacity: dark ? 1 : 0 }} aria-hidden />
    </div>
  );
}
