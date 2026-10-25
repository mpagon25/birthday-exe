import { useCallback, useEffect, useState } from 'react';
import { Ambient } from './Ambient';
import { Hotspots } from './Hotspots';
import { Walker } from './Walker';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import { usePageVisible } from '../../shared/hooks/usePageVisible';
import { useInterval } from '../../shared/hooks/useInterval';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Scene.module.css';

export interface Bubble {
  key: number;
  text: string;
  x: number;
  y: number;
}

export function Scene({
  bubbles,
  pourKey,
  discoBoost,
  neonBlink,
  signBlink,
  effects,
  partyActive,
}: {
  bubbles: Bubble[];
  pourKey: number;
  discoBoost: boolean;
  neonBlink: boolean;
  signBlink: boolean;
  effects: boolean;
  partyActive: boolean;
}) {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const a = useActions();
  const audio = useAudio();
  const [walking, setWalking] = useState(false);
  const [walkKey, setWalkKey] = useState(0);

  const startWalk = useCallback(() => {
    setWalkKey((k) => k + 1);
    setWalking(true);
  }, []);

  useInterval(() => {
    if (!walking && Math.random() < 0.5) startWalk();
  }, 30000, visible && effects && !reduced);

  useEffect(() => {
    if (!walking) return;
    const t = window.setTimeout(() => setWalking(false), 28500);
    return () => window.clearTimeout(t);
  }, [walking, walkKey]);

  const heroClick = () => {
    audio.play('xp');
    a.notify('Pixel-Held', ["It's dangerous to go alone! Take this: 🍺", 'Hey! Listen! ...der Barkeeper ruft.'], 'info');
  };

  return (
    <div className={styles.scene} aria-label="Irish Pub Szene">
      <div className={styles.sceneInner}>
        {effects && !reduced && <Ambient discoBoost={discoBoost} neonBlink={neonBlink} />}
        {signBlink && !reduced && <div className={`${styles.fx} ${styles.signBlink}`} aria-hidden />}
        {pourKey > 0 && !reduced && (
          <div key={pourKey} className={styles.pour} aria-hidden>
            <div className={styles.pourStream} />
            <div className={styles.pourLiquid} />
            <div className={styles.pourFoam} />
          </div>
        )}
        <Hotspots onWalker={startWalk} />
        <Walker key={walkKey} active={walking} dance={partyActive} onClick={heroClick} />
        {bubbles.map((b) => (
          <div key={b.key} className={styles.bubble} style={{ left: b.x, top: b.y }} role="status">
            {b.text}
          </div>
        ))}
        <div className={styles.crt} aria-hidden />
        <div className={styles.vignette} aria-hidden />
      </div>
    </div>
  );
}
