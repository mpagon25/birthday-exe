import type { AppComponentProps } from '../desktop/types';
import { ACHIEVEMENTS } from '../achievements/defs';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useWindowManager } from '../desktop/WindowManager';
import { useGameState } from '../state/GameState';
import styles from './Apps.module.css';

export function Achievements({ close }: AppComponentProps) {
  const ach = useAchievements();
  const wm = useWindowManager();
  const game = useGameState();
  const pct = Math.round((ach.count / ach.total) * 100);
  return (
    <div className={styles.pane}>
      <div className={styles.h1}>🏆 Achievements.exe</div>
      <div>
        <div className={styles.statLabel}>
          <span>Fortschritt</span>
          <span>{ach.count} / {ach.total} ({pct}%)</span>
        </div>
        <div className="progress green">
          <div className="blocks">
            {Array.from({ length: Math.round(pct / 2.5) }).map((_, i) => (
              <span key={i} className="block" />
            ))}
          </div>
        </div>
      </div>
      <div className={`bevel-in ${styles.achList}`} style={{ padding: 4 }}>
        {ACHIEVEMENTS.map((d) => {
          const has = ach.has(d.id);
          const hidden = d.secret && !has;
          return (
            <div key={d.id} className={`${styles.achItem} ${has ? '' : styles.locked}`}>
              <span className={styles.achIcon} aria-hidden>{hidden ? '❓' : d.icon}</span>
              <div>
                <div className={styles.achTitle}>{hidden ? '???' : d.title}</div>
                <div className={styles.achDesc}>{has ? d.description : hidden ? 'Geheimes Achievement.' : `Hinweis: ${d.hint}`}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.buttons}>
        <button
          className="btn"
          onClick={() =>
            wm.message({
              title: 'Fortschritt zurücksetzen',
              text: 'Alle Achievements und Zähler löschen? Das Pint bleibt getrunken.',
              icon: 'warn',
              buttons: [
                { label: 'Ja, zurücksetzen', onClick: () => { ach.reset(); game.reset(); } },
                { label: 'Abbrechen', primary: true },
              ],
            })
          }
        >
          Zurücksetzen
        </button>
        <button className="btn primary" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
