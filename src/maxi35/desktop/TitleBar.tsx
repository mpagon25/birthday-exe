import { useActions } from '../state/ActionsContext';
import styles from './Chrome.module.css';

export function TitleBar() {
  const actions = useActions();
  return (
    <div className={styles.titleBar} role="banner">
      <span className={styles.titleIcon} aria-hidden>🍀</span>
      <span>Maxi 35.exe - Level Up im Lebensspiel!</span>
      <span className={styles.spacer} />
      <button className="btn title-btn" aria-label="Alle Fenster minimieren" onClick={actions.minimizeAll}>_</button>
      <button className="btn title-btn" aria-label="Maximieren" onClick={() => actions.notify('Maximieren', 'Das Leben ist bereits im Vollbildmodus.', 'info')}>□</button>
      <button className="btn title-btn" aria-label="Schließen" onClick={actions.shutdown}>×</button>
    </div>
  );
}
