import { useEffect, useRef, useState } from 'react';
import { BOOT_LINES } from '../content/texts';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Overlays.module.css';

export function BootScreen({ onDone }: { onDone: () => void }) {
  const audio = useAudio();
  const [shown, setShown] = useState(0);
  const [bar, setBar] = useState(0);
  const [ready, setReady] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i += 1;
      setShown(i);
      setBar(Math.min(100, Math.round((i / BOOT_LINES.length) * 100)));
      if (i < BOOT_LINES.length) timer = window.setTimeout(tick, 260 + Math.random() * 320);
      else window.setTimeout(() => setReady(true), 400);
    };
    let timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, []);

  const finish = () => {
    if (done.current) return;
    if (!ready) {
      setShown(BOOT_LINES.length);
      setBar(100);
      setReady(true);
      return;
    }
    done.current = true;
    audio.unlock();
    audio.play('boot');
    onDone();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className={styles.boot} onClick={finish} role="button" tabIndex={0} aria-label="Bootscreen. Klicken oder Enter drücken, um zu starten.">
      <div className={styles.scanlines} />
      <div className={styles.crtFlicker} />
      <div className={styles.crtCurve} />
      <div className={styles.bootInner}>
        <div className={styles.bootLogo}>MAXI35.EXE</div>
        <div className={styles.bootLine}>Birthday BIOS v3.5 (C) 1991-2026 Pub Systems Inc.</div>
        <div className={styles.bootLine}>Memory Test: 35000K OK</div>
        <div className={styles.bootLine}>&nbsp;</div>
        {BOOT_LINES.slice(1, shown).map((line, i) => {
          const warn = /WARNING/.test(line);
          return (
            <div key={i} className={styles.bootLine}>
              {warn ? (
                <>
                  {line.replace(' WARNING', '')} <span className={styles.warn}>WARNING</span>
                </>
              ) : (
                <>
                  {line} <span className={styles.ok}>[ OK ]</span>
                </>
              )}
            </div>
          );
        })}
        <div className={styles.bootLine}>
          {shown > 0 && shown < BOOT_LINES.length && <span className={styles.cursorBlock} />}
        </div>
        <div className={styles.bootLine}>
          Loading
          <span className={styles.bootBar}>
            <i style={{ width: `${bar}%` }} />
          </span>
          {' '}{bar}%
        </div>
        {ready && (
          <div className={`${styles.pressStart} blink`} aria-live="polite">
            ▶ PRESS START TO CONTINUE ◀
          </div>
        )}
        {ready && <div className={styles.bootLine} style={{ marginTop: '1vmin', opacity: 0.7 }}>(Klick, Enter oder Leertaste. Ton wird dann aktiviert.)</div>}
      </div>
    </div>
  );
}
