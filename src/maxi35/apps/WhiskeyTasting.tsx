import { useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Apps.module.css';

const DRAMS = [
  { name: 'Islay-Torfmonster', region: 'Islay', note: 'Rauch, Lagerfeuer, ein Hauch von „Warum tue ich mir das an?“ Großartig.' },
  { name: 'Speyside-Schmeichler', region: 'Speyside', note: 'Honig, Apfel, Vanille. Der nette Nachbar unter den Whiskeys.' },
  { name: 'Highland-Klassiker', region: 'Highlands', note: 'Heide, Eiche, Berge. Schmeckt nach einer Wanderung mit Hüttenbier.' },
  { name: 'Irish Triple', region: 'Irland', note: 'Dreifach destilliert, weich wie ein Pub-Sessel. Sláinte!' },
  { name: 'Sherry-Fass-Finish', region: 'Fass', note: 'Rosinen, Weihnachten, Expertenwissen über Fässer: +15%.' },
];

export function WhiskeyTasting({ close }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  const [tasted, setTasted] = useState<number[]>([]);
  const [log, setLog] = useState<string>('Wähle einen Dram. Nase rein, Augen zu, Meinung bilden.');
  const knowledge = Math.min(100, 12 + tasted.length * 11);

  const taste = (i: number) => {
    audio.play('clink');
    setTasted((t) => (t.includes(i) ? t : [...t, i]));
    setLog(DRAMS[i].note);
    if (tasted.length + 1 === DRAMS.length && !tasted.includes(i)) {
      a.notify('Tasting abgeschlossen', ['Alle Drams probiert.', 'Resistance to another dram: STILL UNKNOWN.'], 'whiskey');
    }
  };

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>WhiskeyTasting.exe</div>
      <div className={styles.muted}>Tasting Notes v0.35 – Lizenz: eine Flasche pro Lebensjahr (nicht empfohlen).</div>
      {DRAMS.map((d, i) => (
        <div key={d.name} className={`bevel-thin-in ${styles.dram}`}>
          <span className={styles.glass}>🥃</span>
          <div style={{ flex: 1 }}>
            <div className={styles.name}>{d.name}</div>
            <div className={styles.muted}>{d.region}</div>
          </div>
          <button className="btn" onClick={() => taste(i)}>
            {tasted.includes(i) ? <span className={styles.tasted}>✔ Probiert</span> : 'Probieren'}
          </button>
        </div>
      ))}
      <div className="field" style={{ minHeight: 44, fontSize: 12 }}>{log}</div>
      <div>
        <div className={styles.statLabel}>
          <span>Whiskey Knowledge</span>
          <span>{knowledge}%</span>
        </div>
        <div className="progress">
          <div className="blocks">
            {Array.from({ length: Math.round(knowledge / 3) }).map((_, i) => (
              <span key={i} className="block" />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={a.showVoucher}>
          Gutschein anzeigen
        </button>
        <button className="btn" onClick={close}>
          Schließen
        </button>
      </div>
    </div>
  );
}
