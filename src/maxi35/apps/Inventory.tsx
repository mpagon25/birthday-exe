import { useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { INVENTORY_ITEMS } from '../content/texts';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useGameState } from '../state/GameState';
import { PixelIcon } from '../desktop/PixelIcon';
import styles from './Apps.module.css';

const RARITY_COLOR = { common: '#888', rare: '#1a5fd0', epic: '#8a2be2', legendary: '#d08a00' };

export function Inventory({ close }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  const game = useGameState();
  const [sel, setSel] = useState(0);
  const item = INVENTORY_ITEMS[sel];

  const use = () => {
    audio.play('xp');
    switch (item.icon) {
      case 'beer':
        a.pourPint();
        break;
      case 'dice':
        a.openApp('dice');
        break;
      case 'whiskey':
      case 'ticket':
        a.showVoucher();
        break;
      case 'mushroom':
        a.startTrip();
        break;
      case 'key':
        a.openApp('rabbithole');
        break;
      case 'chalkbag':
        a.openApp('boulder');
        break;
      case 'gamepad':
        a.openApp('gamenight');
        break;
      case 'coffee':
        a.openApp('kaffee');
        break;
      case 'clover':
        a.cloverRain();
        break;
      case 'pipe':
        a.wizardSpeak();
        break;
      default:
        a.notify('Inventar', `${item.name} benutzt. Effekt: ${item.desc}`, 'info');
    }
  };

  return (
    <div className={styles.pane}>
      <div className={styles.row} style={{ justifyContent: 'space-between' }}>
        <b>💻 My Computer – Inventory</b>
        <span className={styles.muted}>Gold: 35 · Pints: {game.data.pints} · Slots: {INVENTORY_ITEMS.length}/35</span>
      </div>
      <div className={styles.row} style={{ alignItems: 'flex-start' }}>
        <div className={styles.invGrid}>
          {INVENTORY_ITEMS.map((it, i) => (
            <button key={it.name} className={`btn ${styles.invSlot} ${sel === i ? styles.selected : ''}`} onClick={() => { audio.play('click'); setSel(i); }} onDoubleClick={use} title={it.name} aria-label={it.name}>
              <PixelIcon name={it.icon} size={40} />
              <span className={styles.rar} style={{ background: RARITY_COLOR[it.rarity] }} />
            </button>
          ))}
        </div>
        <div className={`bevel-in ${styles.invDetail}`}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PixelIcon name={item.icon} size={24} /> {item.name}
          </h3>
          <div className={styles[`rarity-${item.rarity}`]} style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10, marginBottom: 6 }}>
            {item.rarity}
          </div>
          <p style={{ margin: '0 0 10px' }}>{item.desc}</p>
          <button className="btn primary" onClick={use}>Benutzen</button>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
