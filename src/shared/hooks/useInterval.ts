import { useEffect, useRef } from 'react';

/** setInterval that pauses when `active` is false and always calls the latest callback. */
export function useInterval(callback: () => void, delayMs: number | null, active = true): void {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delayMs === null || !active) return;
    const id = window.setInterval(() => saved.current(), delayMs);
    return () => window.clearInterval(id);
  }, [delayMs, active]);
}
