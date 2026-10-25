import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { CAT_LINES } from '../content/texts';
import { Sprite } from '../sprites/Sprite';
import styles from '../ui/UI.module.css';

const SLOTS: Array<{ id: string; label: string }> = [
  { id: 'sloth', label: 'Faultier' },
  { id: 'bughunter', label: 'Bug Hunter 33' },
  { id: 'cats', label: 'Katzen' },
  { id: 'garden', label: 'Gemüsebeet' },
  { id: 'kimchi', label: 'Kimchi Combo' },
  { id: 'travel', label: 'Reisen' },
  { id: 'pool', label: 'Pool' },
  { id: 'cocktail', label: 'Cocktail Mixer' },
  { id: 'atelier', label: 'Atelier' },
  { id: 'voucher', label: 'Gutschein' },
  { id: 'terminal', label: '???' },
];

export function BottomBar() {
  const game = useGame();
  const gs = useGameState();
  const audio = useAudio();
  const run = (id: string) => {
    game.registerClick();
    switch (id) {
      case 'sloth':
        document.querySelector<HTMLButtonElement>('button[aria-label="Faultier"]')?.click();
        break;
      case 'bughunter':
      case 'garden':
      case 'kimchi':
      case 'cocktail':
      case 'atelier':
      case 'terminal':
        game.openModal(id);
        break;
      case 'cats':
        audio.play('meow');
        game.spawn('cat');
        game.say([CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)], `Gestreichelt: ${gs.data.catsPetted.length}/3 Katzen. Die Katzen sitzen links, auf dem Schoß und am Beet.`], 'Katze');
        break;
      case 'travel': {
        const next = gs.data.travel.includes('denmark') ? 'spain' : 'denmark';
        document.querySelector<HTMLButtonElement>(`button[aria-label="${next === 'denmark' ? 'Dänemark' : 'Spanien'}"]`)?.click();
        break;
      }
      case 'pool':
        audio.play('splash');
        game.spawn('poolsloth');
        break;
      case 'voucher':
        if (gs.data.voucherUnlocked) game.openModal('voucher');
        else if (gs.questReady) game.finale();
        else {
          audio.play('warn');
          game.say(['Der Gutschein ist noch gesperrt.', 'Quest: Whiskey Roulette spielen, eine Katze streicheln, das Faultier entdecken. Dann zum Kalender.'], 'System');
        }
        break;
      default:
        break;
    }
  };
  return (
    <>
      {SLOTS.map((s, i) => {
        const locked = s.id === 'voucher' && !gs.data.voucherUnlocked && !gs.questReady;
        return (
          <button
            key={s.id}
            className={`${styles.barBtn} ${locked ? styles.locked : ''}`}
            style={{ left: 30 + i * 135 }}
            onClick={() => run(s.id)}
            onMouseEnter={() => audio.play('hover')}
            aria-label={s.label}
          >
            <span className={styles.lbl}>{s.label}</span>
            {s.id === 'voucher' && gs.questReady && !gs.data.voucherUnlocked && (
              <span className={`${styles.badge} pulse`}>
                <Sprite name="exclaim" scale={3} />
              </span>
            )}
            {s.id === 'terminal' && (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                <span className="blink" style={{ fontFamily: 'var(--m-font-head)', fontSize: 18, color: 'var(--m-pink)' }}>_</span>
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}
