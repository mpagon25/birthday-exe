import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { CROPS } from '../content/texts';
import { PxButton } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import styles from './Games.module.css';

interface Plot {
  stage: 'empty' | 'seed' | 'sprout' | 'ready';
  water: number;
  crop: string | null;
  wet: boolean;
}

const EMPTY: Plot = { stage: 'empty', water: 0, crop: null, wet: false };

function rollCrop(harvests: number): string {
  const bonus = Math.min(30, harvests * 6);
  const weighted = CROPS.map((c) => ({ id: c.id, w: c.legendary ? c.weight + bonus : c.weight }));
  const total = weighted.reduce((a, b) => a + b.w, 0);
  let r = Math.random() * total;
  for (const c of weighted) {
    r -= c.w;
    if (r <= 0) return c.id;
  }
  return 'carrot';
}

export function Garden() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [plots, setPlots] = useLocalStorage<Plot[]>('michelle33.garden', [EMPTY, EMPTY, EMPTY, EMPTY]);
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>('michelle33.harvest', {});
  const [sel, setSel] = useState(0);
  const [msg, setMsg] = useState('Wähle ein Beet. Pflanzen, dreimal gießen, ernten. Mehr Farming braucht kein Mensch.');
  const plot = plots[sel];

  const update = (p: Partial<Plot>) => setPlots((ps) => ps.map((x, i) => (i === sel ? { ...x, ...p } : x)));

  const plant = () => {
    if (plot.stage !== 'empty') return;
    audio.play('coin');
    update({ stage: 'seed', water: 0, crop: rollCrop(gs.data.harvests) });
    setMsg('Samen gesetzt. Es ist ein Geheimnis, was wächst. Für die Pflanze auch.');
  };
  const water = () => {
    if (plot.stage === 'empty' || plot.stage === 'ready') return;
    audio.play('splash');
    const w = plot.water + 1;
    update({ water: w, wet: true, stage: w >= 3 ? 'ready' : w >= 1 ? 'sprout' : 'seed' });
    window.setTimeout(() => setPlots((ps) => ps.map((x, i) => (i === sel ? { ...x, wet: false } : x))), 700);
    setMsg(w >= 3 ? 'Erntereif! Die Pflanze hat Level 3 erreicht. Respekt.' : `Gegossen (${w}/3). Die Pflanze sagt danke. Innerlich.`);
  };
  const harvest = () => {
    if (plot.stage !== 'ready' || !plot.crop) return;
    const crop = CROPS.find((c) => c.id === plot.crop)!;
    audio.play(crop.legendary ? 'fanfare' : 'combo');
    setInventory((inv) => ({ ...inv, [crop.id]: (inv[crop.id] ?? 0) + 1 }));
    gs.inc('harvests');
    gs.addXp(crop.legendary ? 50 : 8);
    update({ ...EMPTY });
    if (crop.legendary) {
      gs.set('potato', true);
      ach.unlock('greenthumb');
      game.fx.current?.confetti(1200, 350, 80);
      setMsg('LEGENDARY WHISKEY POTATO! Schmeckt nach Torf, Rauch und Lebensentscheidungen.');
    } else {
      setMsg(`${crop.name} geerntet. +8 XP. Das Beet ist wieder frei.`);
    }
  };

  const icon = (p: Plot) => (p.stage === 'empty' ? null : p.stage === 'seed' ? 'seed' : p.stage === 'sprout' ? 'sprout' : CROPS.find((c) => c.id === p.crop)?.icon ?? 'sprout');

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>{msg}</p>
      <div className={styles.plots}>
        {plots.map((p, i) => (
          <button key={i} className={`${styles.plot} ${sel === i ? styles.selected : ''} ${p.wet ? styles.wet : ''}`} onClick={() => { audio.play('click'); setSel(i); }} aria-label={`Beet ${i + 1}: ${p.stage}`}>
            {icon(p) ? <Sprite name={icon(p)!} scale={6} /> : <span style={{ height: 48 }} />}
            <span className={styles.state}>{p.stage === 'empty' ? 'LEER' : p.stage === 'ready' ? 'ERNTE!' : `💧 ${p.water}/3`}</span>
          </button>
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton onClick={plant} disabled={plot.stage !== 'empty'}>🌱 Pflanzen</PxButton>
        <PxButton onClick={water} disabled={plot.stage === 'empty' || plot.stage === 'ready'}>💧 Gießen</PxButton>
        <PxButton variant="gold" onClick={harvest} disabled={plot.stage !== 'ready'}>🧺 Ernten</PxButton>
      </div>
      <div className={styles.inv}>
        {CROPS.map((c) => (
          <span key={c.id} className={styles.invItem} title={c.name}>
            <Sprite name={c.icon} scale={3} /> {inventory[c.id] ?? 0}
          </span>
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}
