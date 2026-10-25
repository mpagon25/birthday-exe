import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'motion/react';
import { useStage } from '../../shared/stage/StageContext';
import { ICONBAR_W, SCENE_BOTTOM, SCENE_TOP, STAGE_W } from '../../shared/stage/constants';
import { useWindowManager } from './WindowManager';
import type { WindowState } from './types';
import { Icon } from './icons';
import styles from './Window.module.css';
import { useAudio } from '../../shared/audio/AudioContext';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';

export function Window({ win }: { win: WindowState }) {
  const wm = useWindowManager();
  const audio = useAudio();
  const reduced = useReducedMotion();
  const { scale } = useStage();
  const def = wm.registry[win.appId];
  const active = wm.activeId === win.id;
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const autoHeight = win.h <= 10;

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button')) return;
      drag.current = { px: e.clientX, py: e.clientY, ox: win.x, oy: win.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      wm.focus(win.id);
    },
    [win.id, win.x, win.y, wm],
  );
  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current) return;
      const dx = (e.clientX - drag.current.px) / scale;
      const dy = (e.clientY - drag.current.py) / scale;
      const height = ref.current?.offsetHeight ?? win.h;
      const nx = Math.max(ICONBAR_W - win.w + 80, Math.min(drag.current.ox + dx, STAGE_W - 60));
      const ny = Math.max(SCENE_TOP, Math.min(drag.current.oy + dy, SCENE_BOTTOM - Math.min(height, 40)));
      wm.move(win.id, nx, ny);
    },
    [scale, win.id, win.w, win.h, wm],
  );
  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  useEffect(() => {
    if (active) {
      // Keep keyboard focus inside the active window for Esc handling.
      const el = ref.current;
      if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
    }
  }, [active]);

  const close = useCallback(() => {
    audio.play('close');
    wm.close(win.id);
  }, [audio, wm, win.id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    }
  };

  if (!def) return null;
  const Comp = def.component;

  return (
    <motion.div
      ref={ref}
      className={`${styles.window} bevel-out ${active ? styles.active : ''}`}
      style={{ left: win.x, top: win.y, width: win.w, height: autoHeight ? 'auto' : win.h, zIndex: win.z, display: win.minimized ? 'none' : undefined }}
      initial={reduced ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26, mass: 0.6 }}
      onPointerDown={() => wm.focus(win.id)}
      onKeyDown={onKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-label={win.title}
    >
      <div
        className={`win-title ${active ? '' : 'inactive'} ${styles.title}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => wm.minimize(win.id)}
      >
        <Icon name={win.icon} size={16} />
        <span className="title-text">{win.title}</span>
        <button className="btn title-btn" aria-label="Minimieren" onClick={() => wm.minimize(win.id)}>
          <span className={styles.minGlyph} />
        </button>
        <button className="btn title-btn" aria-label="Maximieren (nicht verfügbar)" disabled>
          <span className={styles.maxGlyph} />
        </button>
        <button className={`btn title-btn ${styles.closeBtn}`} aria-label="Schließen" onClick={close}>
          ×
        </button>
      </div>
      <div className={styles.body}>
        <Comp windowId={win.id} close={close} props={win.props} />
      </div>
    </motion.div>
  );
}
