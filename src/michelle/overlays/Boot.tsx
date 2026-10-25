import { useEffect, useRef, useState } from 'react';
import { BOOT_LINES } from '../content/texts';
import { useAudio } from '../../shared/audio/AudioContext';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import styles from './Overlays.module.css';

export function Boot({ onStart }: { onStart: () => void }) {
  const audio = useAudio();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      setShown(i);
      if (i < BOOT_LINES.length) timer = window.setTimeout(tick, reduced ? 80 : 420 + Math.random() * 380);
      else window.setTimeout(() => setReady(true), reduced ? 100 : 700);
    };
    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const start = () => {
    if (started.current) return;
    if (!ready) {
      setShown(BOOT_LINES.length);
      setReady(true);
      return;
    }
    started.current = true;
    audio.unlock();
    audio.play('arcade');
    setLeaving(true);
    window.setTimeout(onStart, reduced ? 50 : 900);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className={`${styles.boot} ${leaving ? styles.bootShake : ''}`} onClick={() => !ready && start()} role="region" aria-label="Boot-Sequenz">
      <div className={styles.scan} />
      <div className={styles.glitchBar} />
      <div className={styles.bootInner}>
        <div className={styles.bootLine} style={{ color: '#8a8a8a' }}>MICHELLE OS v33.0 — BIOS (C) 1993–2026 Pub Systems</div>
        <div className={styles.bootLine} style={{ color: '#8a8a8a' }}>Memory: 33 MB OK · Cats: 3 · Whiskey: insufficient</div>
        <div className={styles.bootLine}>&nbsp;</div>
        {BOOT_LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={`${styles.bootLine} ${l.kind ? styles[l.kind] : ''}`}>
            {l.text}
          </div>
        ))}
        {shown < BOOT_LINES.length && (
          <div className={styles.bootLine}>
            <span className={styles.cursor} />
          </div>
        )}
        {ready && (
          <div className={styles.startWrap}>
            <button className={styles.startBtn} onClick={start} autoFocus>
              ▶ PRESS START<br />TO GET OLDER ◀
            </button>
            <div style={{ color: '#8a8a8a', fontSize: '0.75em' }}>(Enter oder Leertaste. Ton wird dann aktiviert.)</div>
          </div>
        )}
      </div>
    </div>
  );
}
