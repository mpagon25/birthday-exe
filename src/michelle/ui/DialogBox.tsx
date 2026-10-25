import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './UI.module.css';

export interface DialogItem {
  key: number;
  lines: string[];
  speaker: string;
}

export function DialogBox({ item, onDone }: { item: DialogItem; onDone: () => void }) {
  const reduced = useReducedMotion();
  const audio = useAudio();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const text = item.lines[index] ?? '';

  useEffect(() => {
    setIndex(0);
  }, [item.key]);

  useEffect(() => {
    setShown(reduced ? text.length : 0);
    if (reduced) return;
    const id = window.setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          window.clearInterval(id);
          return s;
        }
        if (s % 4 === 0) audio.play('tick');
        return s + 1;
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [text, reduced, audio]);

  const advance = () => {
    if (shown < text.length) {
      setShown(text.length);
      return;
    }
    if (index + 1 < item.lines.length) setIndex(index + 1);
    else onDone();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (e.key === 'Escape') onDone();
        else advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, text, index, item]);

  const system = item.speaker !== 'Michelle';
  return (
    <div className={`${styles.dialogWrap} no-print`}>
      <div className={`pxbox ${styles.dialog}`} onClick={advance} role="dialog" aria-live="polite" aria-label={`${item.speaker}: ${text}`}>
        <div className={`${styles.dialogPortrait} ${system ? styles.system : ''}`}>{system ? <span style={{ fontSize: 30 }}>{item.speaker === 'Faultier' ? '🦥' : item.speaker === 'Katze' ? '🐈' : '▣'}</span> : null}</div>
        <div style={{ flex: 1 }}>
          <div className={styles.dialogSpeaker}>{item.speaker}</div>
          <div className={styles.dialogText}>
            {text.slice(0, shown)}
            <span className={styles.dialogCursor}>▌</span>
          </div>
          <div className={styles.dialogHint}>{index + 1 < item.lines.length ? '▶ WEITER' : '▶ OK'} · {item.lines.length > 1 ? `${index + 1}/${item.lines.length}` : 'Klick oder Enter'}</div>
        </div>
      </div>
    </div>
  );
}
