import { useRef } from 'react';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './Scene.module.css';

interface Spot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  round?: boolean;
}

const SPOTS: Spot[] = [
  { id: 'sign', x: 525, y: 75, w: 535, h: 275, label: 'LEVEL 35 – anklicken!' },
  { id: 'guinnessSign', x: 300, y: 115, w: 140, h: 135, label: 'Guinness' },
  { id: 'goodSign', x: 205, y: 115, w: 90, h: 195, label: 'Good Times' },
  { id: 'chalkboard', x: 292, y: 352, w: 180, h: 225, label: 'Next Adventures' },
  { id: 'fireplace', x: 95, y: 480, w: 105, h: 140, label: 'Kaminfeuer' },
  { id: 'dog', x: 125, y: 585, w: 175, h: 110, label: 'Schlafender Hund' },
  { id: 'rabbit', x: 325, y: 585, w: 125, h: 105, label: 'Das weiße Kaninchen' },
  { id: 'mushroomL', x: 92, y: 640, w: 170, h: 100, label: 'Verdächtiger Pilz' },
  { id: 'slainte', x: 470, y: 455, w: 110, h: 50, label: 'Sláinte!' },
  { id: 'wizard', x: 505, y: 445, w: 270, h: 215, label: 'Der Zauberer' },
  { id: 'books', x: 300, y: 700, w: 265, h: 100, label: 'Bibliothek' },
  { id: 'gamepad', x: 440, y: 790, w: 100, h: 55, label: 'Retro-Controller' },
  { id: 'diceRed', x: 590, y: 760, w: 70, h: 60, label: 'W20', round: true },
  { id: 'pint', x: 590, y: 630, w: 95, h: 160, label: 'Pint of Guinness' },
  { id: 'pretzel', x: 650, y: 790, w: 150, h: 95, label: 'Brezn' },
  { id: 'bottles', x: 690, y: 600, w: 440, h: 220, label: 'Whiskey-Sammlung' },
  { id: 'diceWhite', x: 920, y: 800, w: 70, h: 60, label: 'W20', round: true },
  { id: 'walkerSpot', x: 855, y: 935, w: 85, h: 50, label: 'Pixel-Held' },
  { id: 'monitor', x: 990, y: 480, w: 170, h: 120, label: 'Not all those who wander are lost' },
  { id: 'cat', x: 1035, y: 770, w: 150, h: 85, label: 'Schlafende Katze' },
  { id: 'disco', x: 1040, y: 60, w: 80, h: 85, label: 'Discokugel', round: true },
  { id: 'calendar', x: 1082, y: 200, w: 135, h: 135, label: 'Kalender 21.11.' },
  { id: 'mushroomR', x: 1130, y: 240, w: 130, h: 115, label: 'Psychedelischer Pilz' },
  { id: 'neon', x: 1150, y: 75, w: 200, h: 85, label: 'Irish Pub Neon' },
  { id: 'alien', x: 1190, y: 320, w: 70, h: 100, label: 'Alien' },
  { id: 'goodPeople', x: 1250, y: 175, w: 115, h: 175, label: 'Good People' },
  { id: 'cow', x: 1240, y: 395, w: 150, h: 170, label: 'Die Kuh mit Sonnenbrille' },
  { id: 'plantsSign', x: 1310, y: 530, w: 85, h: 95, label: 'Plants make people happier' },
  { id: 'stein', x: 1420, y: 580, w: 100, h: 125, label: 'Maßkrug' },
  { id: 'boulder', x: 1425, y: 60, w: 110, h: 460, label: 'Boulderwand' },
  { id: 'feinsteTropfen', x: 1190, y: 650, w: 200, h: 165, label: 'Feinste Tropfen' },
  { id: 'kitten', x: 1420, y: 900, w: 115, h: 85, label: 'Kätzchen' },
  { id: 'stickyLeft', x: 300, y: 870, w: 140, h: 115, label: 'Zettel' },
  { id: 'terminal', x: 440, y: 885, w: 195, h: 100, label: 'Continue? [Y/n]' },
  { id: 'stickyRight', x: 1020, y: 880, w: 200, h: 105, label: 'Ois Guade zum 35.!' },
  { id: 'zuEntdecken', x: 135, y: 745, w: 170, h: 195, label: 'Zu entdecken...' },
  { id: 'zuEntdeckenClose', x: 278, y: 727, w: 20, h: 18, label: 'Schließen' },
  { id: 'confirmTitle', x: 1212, y: 818, w: 240, h: 90, label: 'Bestätigung' },
];

export function Hotspots({ onWalker }: { onWalker: () => void }) {
  const a = useActions();
  const audio = useAudio();
  const signClicks = useRef<number[]>([]);

  const run = (id: string) => {
    audio.play('click');
    switch (id) {
      case 'sign': {
        const now = Date.now();
        signClicks.current = [...signClicks.current.filter((t) => now - t < 3000), now];
        if (signClicks.current.length >= 5) {
          signClicks.current = [];
          a.startParty();
        } else {
          a.showLevelUp();
        }
        break;
      }
      case 'guinnessSign':
        a.notify('Guinness', ['Guinness is good for you.', 'Quelle: ein Schild in einem Pub. Peer-reviewed.'], 'info');
        break;
      case 'goodSign':
        a.notify('Good Times', 'Good Whiskey. Good Beer. Good Games. Good Times. Reihenfolge: egal, Hauptsache alle.', 'ok');
        break;
      case 'chalkboard':
        a.openApp('questlog');
        break;
      case 'fireplace':
        a.fireplace();
        break;
      case 'dog':
        a.petAnimal('dog');
        break;
      case 'cat':
        a.petAnimal('cat');
        break;
      case 'kitten':
        a.petAnimal('kitten');
        break;
      case 'rabbit':
        a.openApp('rabbit');
        break;
      case 'mushroomL':
      case 'mushroomR':
        a.startTrip();
        break;
      case 'slainte':
        a.clink();
        break;
      case 'wizard':
        a.wizardSpeak();
        break;
      case 'books':
        a.notify('Bibliothek', ['Band I–III: dreimal gelesen, viermal verliehen, einmal zurückbekommen.', 'Das Regelwerk daneben wiegt mehr als ein Kleinwagen.'], 'info');
        break;
      case 'gamepad':
        a.openApp('gamenight');
        break;
      case 'diceRed':
      case 'diceWhite':
        a.openApp('dice');
        break;
      case 'pint':
        a.pourPint();
        break;
      case 'pretzel':
        a.notify('Bavarian DLC', 'Bavarian DLC installed: +10 Brezn, +20 Biergarten.', 'ok');
        break;
      case 'bottles':
        a.openApp('whiskeytasting');
        break;
      case 'walkerSpot':
        onWalker();
        break;
      case 'monitor':
        a.notify('Monitor', ['Not all those who wander are sober.', 'Not all those who wander are lost. Manche suchen nur die Toilette.'], 'info');
        break;
      case 'disco':
        a.disco();
        break;
      case 'calendar':
        a.openApp('calendar');
        break;
      case 'neon':
        a.notify('IRISH PUB', 'Respawn Location: Irish Pub. Checkpoint gespeichert.', 'ok');
        break;
      case 'alien':
        a.alien();
        break;
      case 'goodPeople':
        a.notify('Good People', 'Good People. Good Drinks. Great Stories. Die Reihenfolge, in der der Abend eskaliert.', 'info');
        break;
      case 'cow':
        a.cowToast();
        break;
      case 'plantsSign':
        a.cloverRain();
        a.notify('Botanik', 'Plants make people happier. Beweis: dieses Fenster.', 'ok');
        break;
      case 'stein':
        a.clink();
        break;
      case 'boulder':
        a.openApp('boulder');
        break;
      case 'feinsteTropfen':
        a.showVoucher();
        break;
      case 'stickyLeft':
        a.notify('Zettel', ['Gute Drinks. Große Games. Neue Horizonte.', 'Auf die nächsten 35! Prost! ❤️'], 'info');
        break;
      case 'terminal':
        a.openApp('run');
        break;
      case 'stickyRight':
        a.notify('Ois Guade zum 35.!', ['Auf viele weitere Abenteuer, epische Games und legendäre Drinks mit dir! ❤️'], 'ok');
        break;
      case 'zuEntdecken':
        a.openApp('ie', { page: 'entdecken' });
        break;
      case 'zuEntdeckenClose':
        a.notify('Fehler', 'Dieses Fenster ist Teil der Realität und kann nicht geschlossen werden.', 'error');
        break;
      case 'confirmTitle':
        a.showVoucher();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {SPOTS.map((s) => (
        <button
          key={s.id}
          className={styles.hotspot}
          style={{ left: s.x, top: s.y, width: s.w, height: s.h, borderRadius: s.round ? '50%' : undefined }}
          onClick={() => run(s.id)}
          aria-label={s.label}
        >
          <span className={styles.label}>{s.label}</span>
        </button>
      ))}
      {/* Real Win95 buttons laid exactly over the baked confirmation dialog. */}
      <button
        className={`btn ${styles.fakeBtn}`}
        style={{ left: 1298, top: 905, width: 86, height: 30 }}
        onClick={() => {
          audio.play('click');
          a.showVoucher();
        }}
      >
        Geil!
      </button>
      <button
        className={`btn title-btn ${styles.fakeClose}`}
        style={{ left: 1433, top: 818 }}
        aria-label="Bestätigung schließen"
        onClick={() => {
          audio.play('error');
          a.notify('Bestätigung', 'Der Gutschein lässt sich nicht wegklicken. Er ist gebucht. Geil!', 'warn');
        }}
      >
        ×
      </button>
    </>
  );
}
