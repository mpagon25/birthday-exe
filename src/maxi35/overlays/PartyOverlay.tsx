import { HeroSprite } from '../scene/Walker';
import styles from './Overlays.module.css';

export function PartyOverlay({ onStop }: { onStop: () => void }) {
  return (
    <div className={`${styles.full} ${styles.party}`} aria-live="polite">
      <div className={styles.partyStrobe} />
      <div className={styles.partyText}>
        HAPPY
        <br />
        LEVEL 35!
      </div>
      <div className={styles.partySub}>★ PARTY MODE ACTIVATED ★</div>
      <div className={styles.dancers} aria-hidden>
        {['#2fa34a', '#ff2fd6', '#19f5ff', '#ffd23f', '#ff5c5c', '#b967ff', '#2fa34a'].map((c, i) => (
          <span key={i} className={styles.dancer}>
            <HeroSprite tint={c} />
          </span>
        ))}
      </div>
      <button className={`btn ${styles.partyStop}`} onClick={onStop}>
        Party beenden (Esc)
      </button>
    </div>
  );
}
