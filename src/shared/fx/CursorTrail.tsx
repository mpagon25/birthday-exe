import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { ParticleHandle } from './Particles';
import { useStage } from '../stage/StageContext';

/** Occasional glitter trail following the pointer (throttled, cheap). */
export function CursorTrail({ fx, enabled, stageRef }: { fx: RefObject<ParticleHandle | null>; enabled: boolean; stageRef: RefObject<HTMLDivElement | null> }) {
  const { scale } = useStage();
  useEffect(() => {
    if (!enabled) return;
    let lastT = 0;
    let moves = 0;
    const onMove = (e: PointerEvent) => {
      moves += 1;
      const now = performance.now();
      if (now - lastT < 90 || moves % 3 !== 0) return;
      lastT = now;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      fx.current?.sparkle(x + 10, y + 12, 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, fx, scale, stageRef]);
  return null;
}
