import { useEffect } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { CALENDAR_LINES } from '../content/texts';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Apps.module.css';

export function Calendar({ close }: AppComponentProps) {
  const ach = useAchievements();
  const a = useActions();
  const audio = useAudio();
  useEffect(() => {
    ach.unlock('savethedate');
    audio.play('clink');
    a.confetti({ x: 1150, y: 260, count: 40 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.pane} style={{ padding: 18 }}>
      <div className={styles.note}>
        <span className={styles.notePin} aria-hidden />
        <span className={styles.noteDeco} aria-hidden>🥃🍀</span>
        <div className={styles.noteHead}>TERMINZETTEL</div>
        <div className={styles.noteDate}>21.11.</div>
        {CALENDAR_LINES.map((l) => (
          <div key={l}>✎ {l}</div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={a.showVoucher}>Zum Gutschein</button>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
