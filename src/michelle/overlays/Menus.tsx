import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useGameState } from '../state/GameState';
import { useGame } from '../state/GameContext';
import { HELP_LINES, VOUCHER } from '../content/texts';
import { PxBar, PxButton } from '../ui/PixelUI';
import { Sprite } from '../sprites/Sprite';
import { mMusic } from '../audio/tracks';
import styles from '../ui/UI.module.css';

export function AchievementsMenu() {
  const ach = useAchievements();
  const gs = useGameState();
  const game = useGame();
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="pxtitle gold">ACHIEVEMENTS: {ach.count} / {ach.total}</span>
        <span className="pxsub">{gs.data.xp} XP</span>
      </div>
      <PxBar value={ach.count} max={ach.total} variant="gold" />
      <div className={styles.achList}>
        {ach.defs.map((d) => {
          const has = ach.has(d.id);
          const hidden = d.secret && !has;
          return (
            <div key={d.id} className={`${styles.achItem} ${has ? styles.has : styles.locked}`}>
              <Sprite name={hidden ? 'skull' : d.icon} scale={4} />
              <div style={{ flex: 1 }}>
                <div className={styles.achName}>{hidden ? '???' : d.title}</div>
                <div className={styles.achDesc}>{has ? d.description : hidden ? 'Geheim. Sehr geheim.' : `Hinweis: ${d.hint}`}</div>
              </div>
              <span className="pxsub">{has ? `+${d.xp} XP` : '🔒'}</span>
            </div>
          );
        })}
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}

export function SettingsMenu() {
  const audio = useAudio();
  const gs = useGameState();
  const ach = useAchievements();
  const game = useGame();
  const reset = () => {
    if (window.confirm('Fortschritt, Achievements und Gutschein zurücksetzen?')) {
      ach.reset();
      gs.reset();
      try {
        localStorage.removeItem('michelle33.garden');
        localStorage.removeItem('michelle33.harvest');
      } catch {
        /* ignore */
      }
      game.closeModal();
      game.say('Spielstand gelöscht. Level 33 bleibt. Das lässt sich nicht zurücksetzen.', 'System');
    }
  };
  return (
    <div className="stack">
      <label className={styles.setRow}>
        <span style={{ width: 120 }}>Musik</span>
        <input type="range" min={0} max={100} value={Math.round(audio.musicVolume * 100)} onChange={(e) => audio.setMusicVolume(parseInt(e.target.value, 10) / 100)} aria-label="Musiklautstärke" />
        <span style={{ width: 48, textAlign: 'right' }}>{Math.round(audio.musicVolume * 100)}%</span>
      </label>
      <label className={styles.setRow}>
        <span style={{ width: 120 }}>Gesamt</span>
        <input type="range" min={0} max={100} value={Math.round(audio.volume * 100)} onChange={(e) => audio.setVolume(parseInt(e.target.value, 10) / 100)} aria-label="Gesamtlautstärke" />
        <span style={{ width: 48, textAlign: 'right' }}>{Math.round(audio.volume * 100)}%</span>
      </label>
      <label className={styles.setRow}>
        <input type="checkbox" checked={audio.muted} onChange={(e) => audio.setMuted(e.target.checked)} /> Alles stumm
      </label>
      <label className={styles.setRow}>
        <input type="checkbox" checked={mMusic.playing} onChange={(e) => { audio.unlock(); if (e.target.checked) mMusic.playTrack('main'); else mMusic.stop(); }} /> Musik läuft
      </label>
      <label className={styles.setRow}>
        <input type="checkbox" checked={gs.data.reducedEffects} onChange={(e) => gs.set('reducedEffects', e.target.checked)} /> Starke Animationen reduzieren (Ambient, Partikel, Shake)
      </label>
      <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
        <PxButton variant="ghost" onClick={reset}>Fortschritt löschen</PxButton>
        <PxButton onClick={game.closeModal}>OK</PxButton>
      </div>
    </div>
  );
}

export function HelpMenu() {
  const game = useGame();
  return (
    <div className="stack">
      {HELP_LINES.map((l) => (
        <div key={l}>▸ {l}</div>
      ))}
      <div className="muted">Geheimnisse: ein alter Cheat-Code, 33 Klicks irgendwo, drei Katzen schnell hintereinander, und ein Terminal, das auf „michelle.dev“ hört.</div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton onClick={game.closeModal}>Verstanden</PxButton>
      </div>
    </div>
  );
}

export function VoucherView() {
  const game = useGame();
  const audio = useAudio();
  return (
    <div className="stack">
      <div className={`${styles.voucher}`}>
        <div className={styles.vQuest}>★ {VOUCHER.quest} ★</div>
        <div className={styles.vReward}>{VOUCHER.reward}</div>
        <div className={styles.vIcons} aria-hidden>
          <Sprite name="glass" scale={6} />
          <Sprite name="heart" scale={6} />
          <Sprite name="glass" scale={6} />
        </div>
        <div className={styles.vTitle}>🎁 {VOUCHER.title}</div>
        <div className={styles.vDate}>📅 {VOUCHER.date}</div>
        <div className={styles.vTag}>🥃 {VOUCHER.tagline}</div>
        <div className={styles.vWish}>❤️ {VOUCHER.wish}</div>
      </div>
      <div className={`${styles.vBtns} no-print`}>
        <PxButton
          variant="gold"
          onClick={() => {
            audio.play('fanfare');
            game.fx.current?.confetti(768, 300, 160);
            game.fx.current?.rain('★', 30, '#ff3fa4');
            game.say(['Reward claimed. Der Gutschein ist jetzt offiziell deiner.', 'Einlösbar am 21.11. Nicht übertragbar. Nicht an Katzen.'], 'System');
          }}
        >
          Claim Reward
        </PxButton>
        <PxButton onClick={() => window.print()}>Drucken</PxButton>
        <PxButton variant="ghost" onClick={() => window.location.reload()}>Play Again</PxButton>
        <PxButton variant="ghost" onClick={game.closeModal}>Back to Pub</PxButton>
      </div>
    </div>
  );
}
