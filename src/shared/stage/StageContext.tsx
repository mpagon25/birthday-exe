import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { STAGE_H, STAGE_W } from './constants';

export type StageMode = 'fit' | 'scroll';

export interface StageInfo {
  scale: number;
  mode: StageMode;
  viewportW: number;
  viewportH: number;
}

const StageCtx = createContext<StageInfo>({ scale: 1, mode: 'fit', viewportW: STAGE_W, viewportH: STAGE_H });

function compute(): StageInfo {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fitScale = Math.min(vw / STAGE_W, vh / STAGE_H);
  // On narrow/portrait screens the fitted scene would be unreadably small:
  // scale to viewport height instead and let the user pan horizontally.
  if (vw / vh < 1.15 || fitScale < 0.45) {
    const scale = Math.max(vh / STAGE_H, 0.5);
    return { scale, mode: 'scroll', viewportW: vw, viewportH: vh };
  }
  return { scale: fitScale, mode: 'fit', viewportW: vw, viewportH: vh };
}

export function StageProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<StageInfo>(compute);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setInfo(compute()));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  const value = useMemo(() => info, [info]);
  return <StageCtx.Provider value={value}>{children}</StageCtx.Provider>;
}

export function useStage(): StageInfo {
  return useContext(StageCtx);
}
