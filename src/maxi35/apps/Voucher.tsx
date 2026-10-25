import type { AppComponentProps } from '../desktop/types';
import { useActions } from '../state/ActionsContext';
import styles from './Apps.module.css';

export function Voucher({ close }: AppComponentProps) {
  const a = useActions();
  return (
    <div className={styles.pane} style={{ padding: 16 }}>
      <div className={styles.ticket}>
        <div className={styles.ticketTitle}>
          🥃 GUTSCHEIN 🥃
          <br />
          WHISKEYTASTING
        </div>
        <p className={styles.ticketSub}>
          Eine gemeinsame Verkostung, gute Tropfen, interessante Geschichten und vermutlich ein zunehmend ausgeprägtes Expertenwissen über Fässer.
        </p>
        <div className={styles.ticketDate}>
          🍀 <span>21.11.</span> 🥃
        </div>
        <div className={styles.ticketStats}>
          <div>
            <div className={styles.statLabel}>
              <span>Whiskey Knowledge</span>
              <span>12%</span>
            </div>
            <div className="progress">
              <div className="blocks">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="block" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className={styles.statLabel}>
              <span>Enthusiasm</span>
              <span>100%</span>
            </div>
            <div className="progress green">
              <div className="blocks">
                {Array.from({ length: 34 }).map((_, i) => (
                  <span key={i} className="block" />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.statLabel}>
            <span>Resistance to another dram</span>
            <span className={styles.unknownBar}>UNKNOWN</span>
          </div>
        </div>
        <div className={styles.ticketStamp}>LEVEL 35<br />APPROVED</div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={a.clink}>
          Sláinte!
        </button>
        <button className="btn" onClick={close}>
          Schließen
        </button>
      </div>
    </div>
  );
}
