import { useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { CATS, CAT_LINES, MICHELLE_LINES, SLOTH_RUSH, SLOTH_STEPS } from '../content/texts';
import styles from './Scene.module.css';

interface Spot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  glow?: boolean;
}

const SPOTS: Spot[] = [
  { id: 'michelle', x: 180, y: 330, w: 380, h: 370, label: 'Michelle' },
  { id: 'sign', x: 490, y: 20, w: 560, h: 300, label: 'Happy 33!' },
  { id: 'whiskeySign', x: 580, y: 320, w: 220, h: 110, label: 'Whiskeytasting' },
  { id: 'calendar', x: 820, y: 330, w: 200, h: 140, label: 'Kalender 21.11.', glow: true },
  { id: 'sloth', x: 30, y: 310, w: 210, h: 170, label: 'Faultier' },
  { id: 'neonLeft', x: 30, y: 20, w: 120, h: 260, label: 'Neon' },
  { id: 'neonRight', x: 1420, y: 20, w: 116, h: 180, label: 'Same Sloth' },
  { id: 'denmark', x: 160, y: 150, w: 140, h: 45, label: 'Dänemark' },
  { id: 'spain', x: 160, y: 195, w: 140, h: 45, label: 'Spanien' },
  { id: 'pool', x: 200, y: 240, w: 240, h: 100, label: 'Pool' },
  { id: 'laptop', x: 20, y: 560, w: 200, h: 140, label: 'Bug Hunter 33', glow: true },
  { id: 'controller', x: 300, y: 660, w: 150, h: 60, label: 'Controller' },
  { id: 'books', x: 0, y: 700, w: 200, h: 160, label: 'Bücherstapel' },
  { id: 'sketchbook', x: 200, y: 740, w: 230, h: 120, label: 'Skizzenbuch' },
  { id: 'npcLeft', x: 440, y: 770, w: 70, h: 70, label: 'NPC' },
  { id: 'kimchi', x: 490, y: 700, w: 160, h: 120, label: 'Kimchi Combo', glow: true },
  { id: 'candle', x: 560, y: 630, w: 60, h: 70, label: 'Kerze' },
  { id: 'cubes', x: 650, y: 770, w: 90, h: 70, label: 'Würfel' },
  { id: 'guinness', x: 715, y: 500, w: 65, h: 95, label: 'Guinness' },
  { id: 'kilkenny', x: 745, y: 600, w: 65, h: 100, label: 'Kilkenny' },
  { id: 'bottles', x: 820, y: 450, w: 270, h: 200, label: 'Whiskey Roulette', glow: true },
  { id: 'glasses', x: 830, y: 650, w: 220, h: 70, label: 'Sláinte!' },
  { id: 'note', x: 780, y: 720, w: 270, h: 140, label: 'Zettel' },
  { id: 'pina', x: 1100, y: 500, w: 100, h: 190, label: 'Cocktail Mixer', glow: true },
  { id: 'martini', x: 1190, y: 600, w: 110, h: 190, label: 'Cocktail Mixer', glow: true },
  { id: 'champagne', x: 1230, y: 450, w: 170, h: 150, label: 'Sekt' },
  { id: 'poster', x: 1130, y: 100, w: 120, h: 170, label: 'Metal Poster', glow: true },
  { id: 'irish', x: 1270, y: 110, w: 110, h: 160, label: 'Irish Pub' },
  { id: 'garden', x: 1100, y: 260, w: 200, h: 180, label: 'Gemüsebeet', glow: true },
  { id: 'atelier', x: 1420, y: 230, w: 116, h: 250, label: 'Atelier', glow: true },
  { id: 'bayern', x: 1430, y: 440, w: 80, h: 160, label: 'Mia san mia' },
  { id: 'npcRight', x: 1440, y: 620, w: 70, h: 80, label: 'NPC' },
  { id: 'passport', x: 1040, y: 740, w: 160, h: 90, label: 'Passport' },
  { id: 'map', x: 1200, y: 650, w: 336, h: 210, label: 'Karte' },
  { id: 'sunglasses', x: 1260, y: 780, w: 110, h: 60, label: 'Herz-Sonnenbrille' },
  { id: 'plush', x: 320, y: 625, w: 50, h: 60, label: 'Pinke Katze' },
];

export function Hotspots() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [popId, setPopId] = useState<string | null>(null);
  const slothTimers = useRef<number[]>([]);
  const slothBusy = useRef(false);
  const slothClicks = useRef(0);
  const catClicks = useRef<number[]>([]);

  const pop = (id: string) => {
    setPopId(id);
    window.setTimeout(() => setPopId((p) => (p === id ? null : p)), 300);
  };

  const petCat = (id: string, x: number, y: number) => {
    audio.play('meow');
    game.fx.current?.sparkle(x, y, 8);
    game.bubble(CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)], x - 40, y - 70, 2200);
    game.xpPopup(x, y - 20, 5);
    const list = gs.addToList('catsPetted', id);
    if (CATS.every((c) => list.includes(c.id))) ach.unlock('catservant');
    const now = Date.now();
    catClicks.current = [...catClicks.current.filter((t) => now - t < 2500), now];
    if (catClicks.current.length >= 3) {
      catClicks.current = [];
      game.spawn('notes');
      game.event('SECRET CAT CONCERT');
      game.say(['Drei Katzen. Ein Riff. Null Proben.', 'Das Konzert dauert 8 Sekunden. Wie die Aufmerksamkeitsspanne einer Katze.'], 'Katze');
      window.dispatchEvent(new CustomEvent('michelle:concert'));
    }
  };

  const sloth = () => {
    if (gs.data.slothFound && !slothBusy.current) {
      game.spawn('slothpaw');
      audio.play('sloth');
      game.say(['...', '...hi.'], 'Faultier');
      return;
    }
    if (slothBusy.current) {
      slothClicks.current += 1;
      if (slothClicks.current >= 2) {
        game.bubble(SLOTH_RUSH, 60, 280, 1800);
        audio.play('hurt');
      }
      return;
    }
    slothBusy.current = true;
    slothClicks.current = 0;
    audio.play('sloth');
    game.bubble(SLOTH_STEPS[0], 90, 280, 1800);
    slothTimers.current = [
      window.setTimeout(() => game.bubble(SLOTH_STEPS[1], 90, 280, 2600), 2000),
      window.setTimeout(() => game.bubble(SLOTH_STEPS[2], 90, 280, 2800), 5000),
      window.setTimeout(() => {
        slothBusy.current = false;
        gs.set('slothFound', true);
        ach.unlock('patience');
        game.spawn('slothpaw');
        game.xpPopup(130, 400, 40);
      }, 8500),
    ];
  };

  const run = (id: string) => {
    game.registerClick();
    pop(id);
    switch (id) {
      case 'michelle': {
        const line = MICHELLE_LINES[Math.floor(Math.random() * MICHELLE_LINES.length)];
        const reactions = ['glass', 'horns', 'heart', 'shake', 'headbang'] as const;
        game.react(reactions[Math.floor(Math.random() * reactions.length)]);
        game.say(line, 'Michelle');
        break;
      }
      case 'sign': {
        const n = gs.inc('signClicks');
        audio.play('coin');
        game.fx.current?.sparkle(770, 170, 10);
        if (n === 33) {
          game.say('YOU REALLY HAVE NOTHING BETTER TO DO?', 'System');
          ach.unlock('nothingbetter');
          game.fx.current?.confetti(770, 170, 120);
        } else if (n % 11 === 0) {
          game.say(`Klick Nr. ${n}. Das Schild hat keine weiteren Funktionen. Oder?`, 'System');
        } else if (n === 1) {
          game.say(['Happy Birthday! Level 33.', 'Das Schild freut sich über jeden Klick. Jeden.'], 'System');
        } else {
          game.xpPopup(770, 120, 1);
        }
        break;
      }
      case 'whiskeySign':
        if (gs.data.voucherUnlocked) game.openModal('voucher');
        else game.say(['Hier hängt die Quest: Whiskeytasting.', questText(gs.data.whiskeyRounds >= 1, gs.data.catsPetted.length >= 1, gs.data.slothFound)], 'System');
        break;
      case 'calendar':
        if (gs.data.voucherUnlocked) game.openModal('voucher');
        else if (gs.questReady) game.finale();
        else {
          audio.play('warn');
          game.say(['21.11. ist markiert. Der Kalender bleibt noch verschlossen.', questText(gs.data.whiskeyRounds >= 1, gs.data.catsPetted.length >= 1, gs.data.slothFound)], 'System');
        }
        break;
      case 'sloth':
        sloth();
        break;
      case 'neonLeft':
        audio.play('coin');
        game.say('Good Games. Good Drinks. Good Friends. In dieser Reihenfolge eskaliert der Abend.', 'System');
        break;
      case 'neonRight':
        audio.play('coin');
        game.say('Same Sloth. Different Whiskey. Lebensmotto, in Neon.', 'System');
        break;
      case 'denmark': {
        audio.play('whoosh');
        game.spawn('viking');
        const list = gs.addToList('travel', 'denmark');
        game.xpPopup(230, 150, 10);
        if (list.includes('spain')) ach.unlock('worldtraveler');
        break;
      }
      case 'spain': {
        audio.play('whoosh');
        game.spawn('palm');
        game.fx.current?.rain('🍹', 24, '#ffe066');
        const list = gs.addToList('travel', 'spain');
        game.xpPopup(230, 200, 10);
        if (list.includes('denmark')) ach.unlock('worldtraveler');
        break;
      }
      case 'pool':
        audio.play('splash');
        game.spawn('poolsloth');
        break;
      case 'laptop':
        game.openModal('bughunter');
        break;
      case 'controller':
        audio.play('coin');
        game.say('Controller verbunden. Spieler 2 ist die Katze. Spieler 2 gewinnt.', 'System');
        break;
      case 'books':
        audio.play('click');
        game.say(['GAMEDEV. DESIGN. IDEAS. MORE WHISKEY.', 'Vier Bücher, eine Lebensplanung.'], 'System');
        break;
      case 'sketchbook':
        audio.play('click');
        game.say('Skizzenbuch: 33 Ideen. 32 davon mit „später“ markiert.', 'System');
        break;
      case 'npcLeft':
      case 'npcRight':
        audio.play('tick');
        game.say(['Ich bin ein NPC.', 'Ich habe genau eine Textzeile. Das war sie.'], 'NPC');
        break;
      case 'kimchi':
        game.openModal('kimchi');
        break;
      case 'candle':
        audio.play('bubble');
        game.fx.current?.sparkle(590, 650, 12);
        game.say('Kerze flackert. Atmosphäre +1. Brandgefahr: akzeptabel.', 'System');
        break;
      case 'cubes':
        audio.play('dice');
        game.say('Würfelwurf: 33. Statistisch unmöglich. Trotzdem.', 'System');
        break;
      case 'guinness':
        audio.play('pour');
        game.fx.current?.sparkle(748, 500, 14);
        game.say('Guinness: 0 Bugs, 100% Schaum. Die stabilste Software im Raum.', 'System');
        break;
      case 'kilkenny':
        audio.play('pour');
        game.say('Kilkenny: für Tage, an denen Guinness zu dunkel für die Stimmung ist.', 'System');
        break;
      case 'bottles':
        game.openModal('roulette');
        break;
      case 'glasses':
        audio.play('clink');
        game.fx.current?.sparkle(940, 680, 16);
        game.react('glass');
        game.bubble('Sláinte!', 900, 600, 1500);
        game.xpPopup(940, 640, 3);
        break;
      case 'note':
        audio.play('click');
        game.say(['Auf 33 Jahre Chaos, Abenteuer und noch so viele epische Quests!', 'Cheers! ♡'], 'Zettel');
        break;
      case 'pina':
      case 'martini':
        game.openModal('cocktail');
        break;
      case 'champagne':
        audio.play('explosion');
        game.fx.current?.sparkle(1310, 470, 20);
        game.say('Sekt: reserviert für den Moment nach dem Gutschein. Oder davor. Oder beides.', 'System');
        break;
      case 'poster':
        game.startMetal();
        break;
      case 'irish':
        audio.play('coin');
        game.say('Irish Pub. Respawn Point. Checkpoint gespeichert.', 'System');
        break;
      case 'garden':
        game.openModal('garden');
        break;
      case 'atelier':
        game.openModal('atelier');
        break;
      case 'bayern':
        audio.play('whoosh');
        game.spawn('football');
        gs.set('bayern', true);
        ach.unlock('miasanmia');
        break;
      case 'passport':
        audio.play('click');
        game.say('Passport: Stempel aus Dänemark, Spanien und dem Irish Pub um die Ecke.', 'System');
        break;
      case 'map':
        audio.play('click');
        game.say('Das X markiert... die nächste Bar. Immer.', 'System');
        break;
      case 'sunglasses':
        audio.play('coin');
        game.react('heart');
        game.say('Herz-Sonnenbrille: +10 Style, -5 Sicht, +33 Attitude.', 'System');
        break;
      case 'plush':
        audio.play('purr');
        game.fx.current?.sparkle(345, 650, 6);
        game.bubble('Plüsch. Zählt trotzdem als Katze. Fast.', 300, 560, 2000);
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
          className={`${styles.hot} ${s.glow ? styles.glow : ''} ${popId === s.id ? styles.pop : ''}`}
          style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
          onClick={() => run(s.id)}
          onMouseEnter={() => audio.play('hover')}
          aria-label={s.label}
        >
          <span className={styles.lbl}>{s.label}</span>
        </button>
      ))}
      {CATS.map((c) => (
        <button
          key={c.id}
          className={`${styles.hot} ${popId === c.id ? styles.pop : ''}`}
          style={{ left: c.x, top: c.y, width: c.w, height: c.h }}
          onClick={() => {
            game.registerClick();
            pop(c.id);
            petCat(c.id, c.x + c.w / 2, c.y + c.h / 2);
          }}
          onMouseEnter={() => audio.play('hover')}
          aria-label={c.name}
        >
          <span className={styles.lbl}>{gs.data.catsPetted.includes(c.id) ? '♥ ' : ''}{c.name}</span>
        </button>
      ))}
    </>
  );
}

function questText(a: boolean, b: boolean, c: boolean): string {
  return `Quest: ${a ? '✔' : '☐'} Whiskey Roulette spielen · ${b ? '✔' : '☐'} eine Katze streicheln · ${c ? '✔' : '☐'} das Faultier entdecken.`;
}
