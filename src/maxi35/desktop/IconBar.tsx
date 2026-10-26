import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { ICONBAR_TIPS } from '../content/texts';
import { PixelIcon } from './PixelIcon';
import styles from './Chrome.module.css';

const ICONS: Array<{ id: string; glyph: string; label: string }> = [
  { id: 'clover', glyph: 'clover', label: 'Glück' },
  { id: 'beer', glyph: 'beer', label: 'Bier' },
  { id: 'film', glyph: 'film', label: 'Filme' },
  { id: 'game', glyph: 'gamepad', label: 'Games' },
  { id: 'dice', glyph: 'dice', label: 'Würfel' },
  { id: 'mountain', glyph: 'mountain', label: 'Berge' },
  { id: 'plant', glyph: 'plant', label: 'Pflanzen' },
  { id: 'coffee', glyph: 'coffee', label: 'Kaffee' },
  { id: 'pretzel', glyph: 'pretzel', label: 'Brezn' },
  { id: 'lotus', glyph: 'lotus', label: 'Lotus' },
  { id: 'moon', glyph: 'moon', label: 'Nacht' },
  { id: 'leaf', glyph: 'leaf', label: '420' },
  { id: 'heart', glyph: 'heart', label: 'Herz' },
];

export function IconBar() {
  const a = useActions();
  const audio = useAudio();
  const run = (id: string) => {
    audio.play('click');
    switch (id) {
      case 'clover':
        a.cloverRain();
        break;
      case 'beer':
        a.pourPint();
        break;
      case 'film':
        a.openApp('ie', { page: 'filme' });
        break;
      case 'game':
        a.openApp('gamenight');
        break;
      case 'dice':
        a.openApp('dice');
        break;
      case 'mountain':
        a.openApp('boulder');
        break;
      case 'plant':
        a.openApp('botanik');
        break;
      case 'coffee':
        a.openApp('kaffee');
        break;
      case 'pretzel':
        a.notify('Bavarian DLC', 'Bavarian DLC installed: +10 Brezn, +20 Biergarten.', 'ok');
        break;
      case 'lotus':
        a.startTrip();
        break;
      case 'moon':
        a.notify('Nachtmodus', ['Nachtmodus aktiviert.', 'Hinweis: Es war bereits Nacht. Es ist immer Nacht im Pub.'], 'info');
        break;
      case 'leaf':
        a.notify('420.exe', ['Chill-Level: maximal.', 'Snack-Vorrat: kritisch.', 'Pflanzen: gegossen.'], 'info');
        break;
      case 'heart':
        a.showVoucher();
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.iconBar} role="toolbar" aria-label="Desktop-Icons">
      {ICONS.map((ic) => (
        <button key={ic.id} className={styles.iconBtn} onClick={() => run(ic.id)} aria-label={ICONBAR_TIPS[ic.id] ?? ic.label}>
          <span className={styles.glyph}>
            <PixelIcon name={ic.glyph} size={44} />
          </span>
          <span className={styles.tip}>{ICONBAR_TIPS[ic.id]}</span>
        </button>
      ))}
    </div>
  );
}
