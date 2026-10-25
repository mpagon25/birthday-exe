import { useEffect } from 'react';
import { BSOD_TEXT } from '../content/texts';
import styles from './Overlays.module.css';

export function Bsod({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const onKey = () => onDismiss();
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(onDismiss, 9000);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [onDismiss]);
  return (
    <div className={styles.bsod} onClick={onDismiss} role="alert">
      <span className={styles.bsodTitle}>Maxi35</span>
      {'\n'}
      {BSOD_TEXT}
    </div>
  );
}
