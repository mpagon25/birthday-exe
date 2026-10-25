import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { COCKTAIL_INGREDIENTS, COCKTAIL_NAMES, COCKTAIL_SECRET, COCKTAIL_SLOTH } from '../content/texts';
import { PxButton } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import styles from './Games.module.css';

function hash(ids: string[]): number {
  return [...ids.slice().sort().join('|')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7);
}
const same = (a: string[], b: string[]) => a.length === b.length && a.slice().sort().every((x, i) => x === b.slice().sort()[i]);

export function CocktailMixer() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [sel, setSel] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<{ name: string; note: string } | null>(null);

  const toggle = (id: string) => {
    audio.play('click');
    setResult(null);
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s));
  };

  const mix = () => {
    if (sel.length !== 3 || shaking) return;
    setShaking(true);
    audio.play('whoosh');
    window.setTimeout(() => {
      setShaking(false);
      let name: string;
      let note: string;
      if (same(sel, COCKTAIL_SECRET)) {
        name = 'Pink Pixel Panic';
        note = 'Der geheime Mix. Es regnet Herzen. Das ist medizinisch nicht erklärbar.';
        game.fx.current?.rain('💗', 60, '#ff3fa4');
        gs.set('cocktailSecret', true);
        ach.unlock('cocktailchaos');
        audio.play('fanfare');
      } else if (same(sel, COCKTAIL_SLOTH)) {
        name = 'Sloth on the Beach';
        note = 'Langsam getrunken. Sehr langsam. Das Faultier nickt anerkennend.';
        audio.play('sloth');
      } else if (sel.includes('cathair')) {
        name = 'Purr-fect Storm';
        note = 'Katzenhaar ist in allem. Das ist kein Rezept, das ist Realität.';
        audio.play('meow');
      } else {
        const names = COCKTAIL_NAMES.filter((n) => n !== 'Pink Pixel Panic' && n !== 'Sloth on the Beach' && n !== 'Purr-fect Storm');
        name = names[hash(sel) % names.length];
        const notes = ['Süß, sauer, fragwürdig. Wie Level 33.', 'Social Battery +12%. Für 20 Minuten.', 'Schmeckt nach Urlaub ohne Reiseplanung.', 'Kritischer Treffer auf die Entscheidungsfähigkeit.', 'Der Barkeeper hat Fragen. Keine davon wird beantwortet.'];
        note = notes[hash(sel) % notes.length];
        audio.play('combo');
      }
      setResult({ name, note });
      gs.addXp(12);
    }, 1400);
  };

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>Drei Zutaten wählen, schütteln, Konsequenzen tragen. Tipp: Pink. Passion. Whiskey. Irgendwas davon.</p>
      <div className={styles.ingredients}>
        {COCKTAIL_INGREDIENTS.map((ing) => (
          <button key={ing.id} className={`${styles.ing} ${sel.includes(ing.id) ? styles.on : ''}`} onClick={() => toggle(ing.id)} disabled={!sel.includes(ing.id) && sel.length >= 3} aria-pressed={sel.includes(ing.id)}>
            <Sprite name={ing.icon} scale={5} />
            {ing.label}
          </button>
        ))}
      </div>
      <div className={styles.shaker}>
        <span className={shaking ? styles.shaking : ''}>
          <Sprite name="cocktail" scale={8} />
        </span>
        <div className="pxsub">{sel.length}/3 ZUTATEN</div>
      </div>
      {result && (
        <div className={`pxbox dark ${styles.result}`}>
          <div className={styles.cocktailName}>{result.name}</div>
          <p>{result.note}</p>
        </div>
      )}
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton onClick={mix} disabled={sel.length !== 3 || shaking}>Shake it!</PxButton>
        <PxButton variant="ghost" onClick={() => { setSel([]); setResult(null); }}>Leeren</PxButton>
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}
