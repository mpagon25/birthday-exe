import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { ATELIER } from '../content/texts';
import { PxButton } from '../ui/PixelUI';
import styles from './Games.module.css';

export function Atelier() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [material, setMaterial] = useState(0);
  const [color, setColor] = useState(2);
  const [finish, setFinish] = useState(0);
  const c = ATELIER.colors[color];
  const gloss = finish === 0 ? 0.9 : finish === 1 ? 0.45 : finish === 2 ? 1 : 0.1;
  const matte = material === 1 || finish === 3;

  const save = () => {
    audio.play('coin');
    gs.set('atelier', true);
    gs.addXp(20);
    ach.unlock('shiny');
    game.fx.current?.sparkle(1480, 350, 20);
    game.say(`Design gespeichert: ${ATELIER.materials[material]}, ${c.label}, ${ATELIER.finishes[finish]}. Handwerk +100. Glanz +100. Katzenhaar-Resistenz: 0.`, 'System');
  };

  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>Pixel-Designstudio. Material, Farbe, Oberfläche. Das Atelier riecht nach Talkum und Ambition.</p>
      <div className={styles.atelier}>
        <div className={styles.mannequin}>
          <svg width="160" height="240" viewBox="0 0 40 60" style={{ shapeRendering: 'crispEdges' }} aria-label="Mannequin-Vorschau">
            <defs>
              <linearGradient id="shine" x1="0" x2="1">
                <stop offset="0" stopColor={c.a} />
                <stop offset="0.35" stopColor={matte ? c.a : '#ffffff'} stopOpacity={matte ? 1 : gloss * 0.8} />
                <stop offset="0.5" stopColor={c.b} />
                <stop offset="1" stopColor={c.a} />
              </linearGradient>
            </defs>
            <rect x="15" y="2" width="10" height="10" fill="#f2c9a0" />
            <rect x="13" y="12" width="14" height="4" fill="url(#shine)" />
            <rect x="10" y="16" width="20" height="18" fill="url(#shine)" />
            <rect x="6" y="18" width="4" height="14" fill="url(#shine)" />
            <rect x="30" y="18" width="4" height="14" fill="url(#shine)" />
            <rect x="11" y="34" width="8" height="20" fill="url(#shine)" />
            <rect x="21" y="34" width="8" height="20" fill="url(#shine)" />
            <rect x="9" y="54" width="10" height="4" fill="#0a0a0a" />
            <rect x="21" y="54" width="10" height="4" fill="#0a0a0a" />
            {!matte && <rect x="12" y="18" width="2" height="14" fill="#fff" opacity={gloss} />}
            {!matte && <rect x="13" y="36" width="1" height="16" fill="#fff" opacity={gloss * 0.8} />}
            {finish === 2 && <rect x="26" y="20" width="2" height="10" fill="#6fb1ff" opacity="0.8" />}
          </svg>
        </div>
        <div className={styles.options}>
          <div className={styles.optLbl}>MATERIAL</div>
          <div className={styles.opt}>{ATELIER.materials.map((m, i) => <button key={m} className={material === i ? styles.on : ''} onClick={() => { audio.play('click'); setMaterial(i); }}>{m}</button>)}</div>
          <div className={styles.optLbl}>FARBE</div>
          <div className={styles.opt}>{ATELIER.colors.map((col, i) => <button key={col.id} className={color === i ? styles.on : ''} onClick={() => { audio.play('click'); setColor(i); }}><span className={styles.swatch} style={{ background: `linear-gradient(90deg, ${col.a}, ${col.b})` }} /> {col.label}</button>)}</div>
          <div className={styles.optLbl}>OBERFLÄCHE</div>
          <div className={styles.opt}>{ATELIER.finishes.map((f, i) => <button key={f} className={finish === i ? styles.on : ''} onClick={() => { audio.play('click'); setFinish(i); }}>{f}</button>)}</div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton variant="gold" onClick={save}>Design speichern</PxButton>
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}
