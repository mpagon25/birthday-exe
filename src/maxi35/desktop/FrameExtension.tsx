import { useStage } from '../../shared/stage/StageContext';
import { MENU_H, STAGE_H, STAGE_W, TASKBAR_H, TITLE_H } from '../../shared/stage/constants';

/**
 * Extends the Win95 chrome (title bar, menu bar, taskbar) across the full viewport width
 * when the 3:2 stage is letterboxed, so the app fills the screen like a maximized window.
 */
export function FrameExtension() {
  const { scale, mode, viewportW, viewportH } = useStage();
  if (mode !== 'fit') return null;
  const scaledW = STAGE_W * scale;
  const scaledH = STAGE_H * scale;
  const gapX = Math.max(0, (viewportW - scaledW) / 2);
  const gapY = Math.max(0, (viewportH - scaledH) / 2);
  if (gapX < 1 && gapY < 1) return null;
  const strip = (side: 'left' | 'right') => (
    <div
      key={side}
      aria-hidden
      style={{ position: 'fixed', top: gapY, bottom: gapY, [side]: 0, width: gapX, background: 'var(--desktop)', pointerEvents: 'none' }}
    >
      <div style={{ height: TITLE_H * scale, background: 'linear-gradient(90deg, #0a0a9a, #1a3dc0 60%, #2a6ad8)' }} />
      <div style={{ height: MENU_H * scale, background: 'var(--win-bg)', borderBottom: '1px solid var(--win-dark)', boxShadow: '0 1px 0 var(--win-light)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: TASKBAR_H * scale, background: 'var(--win-bg)', borderTop: '1px solid var(--win-light)', boxShadow: '0 -1px 0 var(--win-dark)' }} />
    </div>
  );
  return (
    <>
      {gapX >= 1 && strip('left')}
      {gapX >= 1 && strip('right')}
    </>
  );
}
