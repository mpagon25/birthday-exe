import type { ReactNode } from 'react';
import { STAGE_H, STAGE_W } from './constants';
import { useStage } from './StageContext';
import styles from './Stage.module.css';

/** Renders children inside a fixed 1536x1024 coordinate system, scaled to the viewport. */
export function Stage({ children }: { children: ReactNode }) {
  const { scale, mode, viewportW, viewportH } = useStage();
  const scaledW = STAGE_W * scale;
  const scaledH = STAGE_H * scale;
  const offsetX = mode === 'fit' ? Math.max(0, (viewportW - scaledW) / 2) : 0;
  const offsetY = Math.max(0, (viewportH - scaledH) / 2);
  return (
    <div className={`${styles.viewport} ${mode === 'scroll' ? styles.scroll : ''}`}>
      <div className={styles.sizer} style={{ width: scaledW, height: scaledH, marginLeft: offsetX, marginTop: offsetY }}>
        <div
          className={styles.stage}
          style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
