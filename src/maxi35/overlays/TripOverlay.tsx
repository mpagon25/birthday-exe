import { Icon } from '../desktop/icons';
import styles from './Overlays.module.css';

const SPINNERS: Array<[number, number, string]> = [
  [200, 150, '🍄'], [1300, 200, '⭐'], [300, 800, '🌀'], [1250, 780, '🍄'], [750, 120, '👁️'], [1000, 900, '🌈'],
];

export function TripOverlay({ onStop }: { onStop: () => void }) {
  return (
    <div className={`${styles.full} ${styles.trip}`} role="alert">
      <div className={`${styles.tripLayer} ${styles.tripRed}`} aria-hidden />
      <div className={`${styles.tripLayer} ${styles.tripCyan}`} aria-hidden />
      {SPINNERS.map(([x, y, g], i) => (
        <span key={i} className={styles.tripSpin} style={{ left: x, top: y, animationDelay: `${i * 0.2}s` }} aria-hidden>
          {g}
        </span>
      ))}
      <div className={`bevel-out ${styles.tripBox}`}>
        <div className="win-title">
          <Icon name="error" size={16} />
          <span className="title-text">Reality.exe</span>
        </div>
        <div className={styles.tripBody}>
          <Icon name="error" size={32} />
          <div>
            <p style={{ margin: '0 0 6px' }}>
              <b>Reality.exe has stopped responding.</b>
            </p>
            <p style={{ margin: 0 }}>Windows sucht nach einer Lösung. Windows hat aufgegeben. Der Pilz war Deko. Vermutlich.</p>
          </div>
        </div>
        <div className={styles.tripButtons}>
          <button className="btn primary" onClick={onStop}>
            Zurück zur Realität
          </button>
          <button className="btn" onClick={onStop}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
