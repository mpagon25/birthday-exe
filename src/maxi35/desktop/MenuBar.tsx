import { useEffect, useMemo, useRef, useState } from 'react';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useGameState } from '../state/GameState';
import styles from './Chrome.module.css';

interface Entry {
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  sep?: boolean;
  action?: () => void;
}

interface Menu {
  label: string;
  entries: Entry[];
}

export function MenuBar() {
  const a = useActions();
  const audio = useAudio();
  const game = useGameState();
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const menus = useMemo<Menu[]>(
    () => [
      {
        label: 'Datei',
        entries: [
          { label: 'Neues Pint', icon: '🍺', shortcut: 'Strg+P', action: a.pourPint },
          { label: 'Gutschein öffnen...', icon: '🎟️', shortcut: 'Strg+O', action: a.showVoucher },
          { label: 'Speichern', icon: '💾', action: () => a.notify('Speichern', 'Fortschritt wird automatisch gespeichert. Genau wie dein Alter.', 'info') },
          { label: 'Drucken', icon: '🖨️', disabled: true },
          { sep: true, label: '' },
          { label: 'Beenden', icon: '🚪', action: a.shutdown },
        ],
      },
      {
        label: 'Whiskey',
        entries: [
          { label: 'Gutschein: Whiskeytasting', icon: '🥃', action: a.showVoucher },
          { label: 'WhiskeyTasting.exe', icon: '🪟', action: () => a.openApp('whiskeytasting') },
          { label: 'Anstoßen', icon: '🥂', action: a.clink },
          { sep: true, label: '' },
          { label: 'Whiskey Knowledge: 12%', disabled: true },
        ],
      },
      {
        label: 'Bier',
        entries: [
          { label: 'Pint einschenken', icon: '🍺', action: a.pourPint },
          { label: 'Anstoßen', icon: '🥂', action: a.clink },
          { label: 'Kilkenny statt Guinness', icon: '🍻', action: () => a.notify('Bestellung', 'Ein Kilkenny. Der Barkeeper nickt anerkennend.', 'ok') },
          { sep: true, label: '' },
          { label: `Pints poured: ${game.data.pints}`, disabled: true },
        ],
      },
      {
        label: 'Games',
        entries: [
          { label: 'GameNight.exe', icon: '🎮', action: () => a.openApp('gamenight') },
          { label: 'Bouldern.exe', icon: '🧗', action: () => a.openApp('boulder') },
          { label: 'Paint.exe', icon: '🎨', action: () => a.openApp('paint') },
          { label: 'My Computer – Inventory', icon: '💻', action: () => a.openApp('inventory') },
          { sep: true, label: '' },
          { label: 'Achievements.exe', icon: '🏆', action: () => a.openApp('achievements') },
        ],
      },
      {
        label: 'PnP',
        entries: [
          { label: 'W20 werfen', icon: '🎲', action: () => a.openApp('dice') },
          { label: 'Den Zauberer befragen', icon: '🧙', action: a.wizardSpeak },
          { label: 'Quest Log', icon: '📜', action: () => a.openApp('questlog') },
          { sep: true, label: '' },
          { label: 'Charakterbogen: Level 35', disabled: true },
        ],
      },
      {
        label: 'Filme',
        entries: [
          { label: 'Filme.exe', icon: '🎬', action: () => a.openApp('ie', { page: 'filme' }) },
          { label: 'Popcorn laden', icon: '🍿', action: () => a.notify('Popcorn', 'Popcorn wird geladen... Trailer läuft seit 1998.', 'info') },
        ],
      },
      {
        label: 'Serien',
        entries: [
          { label: 'Serien.exe', icon: '📺', action: () => a.openApp('ie', { page: 'serien' }) },
          { label: 'Noch eine Folge?', icon: '⏭️', action: () => a.notify('Autoplay', ['Noch eine Folge?', '[Ja]   [Ja]'], 'question') },
          { label: 'Anime-Opening überspringen', icon: '⏩', action: () => a.notify('Anime-Modus', 'Opening übersprungen. Du Monster.', 'warn') },
        ],
      },
      {
        label: 'Bayern',
        entries: [
          { label: 'Bavarian DLC installieren', icon: '🥨', action: () => a.notify('Update', 'Bavarian DLC installed: +10 Brezn, +20 Biergarten.', 'ok') },
          { label: 'Oans, zwoa, gsuffa!', icon: '🍻', action: a.clink },
          { label: 'Wirtshaus suchen', icon: '🏔️', action: () => a.notify('Navigation', 'Nächstes Wirtshaus: 400 m. Nächste Hütte: 1.200 Höhenmeter. Beides mit Bier.', 'info') },
        ],
      },
      {
        label: 'Klettern',
        entries: [
          { label: 'Bouldern.exe', icon: '🧗', action: () => a.openApp('boulder') },
          { label: 'Berge & Touren', icon: '⛰️', action: () => a.notify('Tourenplaner', 'Tour geplant: Gipfel, Hütte, Brotzeit. Reihenfolge verhandelbar.', 'info') },
          { label: 'Chalk nachfüllen', icon: '🧂', action: () => a.notify('Inventar', 'Grip Strength +10. Haut an den Fingern -10.', 'ok') },
        ],
      },
      {
        label: 'Pflanzen',
        entries: [
          { label: 'Pflanzen gießen', icon: '🌿', action: () => { a.cloverRain(); a.notify('Botanik', 'Alle 47 Pflanzen gegossen. Die Pflanzen sind zufrieden.', 'ok'); } },
          { label: 'Pilze bestimmen', icon: '🍄', action: a.startTrip },
          { label: 'Plants make people happier', disabled: true },
        ],
      },
      {
        label: 'Abenteuer',
        entries: [
          { label: 'Quest Log', icon: '📜', action: () => a.openApp('questlog') },
          { label: 'Neue Welten erkunden', icon: '🌐', action: () => a.openApp('ie') },
          { label: 'Achievements', icon: '🏆', action: () => a.openApp('achievements') },
          { sep: true, label: '' },
          { label: 'Continue? [Y/n]', icon: '▶️', action: a.showLevelUp },
        ],
      },
      {
        label: '420',
        entries: [
          { label: 'Reality.exe', icon: '🍄', action: a.startTrip },
          { label: 'Kekse backen', icon: '🍪', action: () => a.notify('Backofen', 'Backofen: 180 °C. Keks-Status: völlig unverdächtig.', 'info') },
          { label: 'Chill-Modus', icon: '🛋️', action: () => a.notify('Chill-Modus', 'Chill-Modus aktiviert. Er war nie deaktiviert.', 'ok') },
        ],
      },
      {
        label: 'Kaffee',
        entries: [
          { label: 'Kaffee_irl.exe', icon: '☕', action: () => a.openApp('kaffee') },
          { label: 'Noch einen?', icon: '☕', action: () => a.notify('Kaffee', 'Coffee dependency: Running in background. Prozess kann nicht beendet werden.', 'warn') },
        ],
      },
      {
        label: 'Help',
        entries: [
          { label: 'Hilfe', icon: '❓', action: () => a.notify('Hilfe', 'Hilfe ist unterwegs. ETA: nach dem nächsten Pint.', 'info') },
          { label: 'Tavern Radio', icon: '📻', action: () => a.openApp('radio') },
          { label: 'Einstellungen', icon: '⚙️', action: () => a.openApp('settings') },
          { sep: true, label: '' },
          { label: 'Über Maxi35.exe', icon: 'ℹ️', action: () => a.openApp('about') },
        ],
      },
    ],
    [a, game.data.pints],
  );

  useEffect(() => {
    if (open === null) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? 0 : (o + 1) % menus.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? 0 : (o - 1 + menus.length) % menus.length));
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, menus.length]);

  const run = (entry: Entry) => {
    setOpen(null);
    audio.play('click');
    entry.action?.();
  };

  return (
    <nav className={styles.menuBar} ref={ref} aria-label="Hauptmenü">
      {menus.map((m, i) => (
        <div key={m.label} className={styles.menuItem} style={m.label === 'Help' ? { marginLeft: 70 } : undefined}>
          <button
            className={`${styles.menuBtn} ${open === i ? styles.open : ''}`}
            aria-haspopup="menu"
            aria-expanded={open === i}
            onClick={() => {
              audio.play('click');
              setOpen(open === i ? null : i);
            }}
            onMouseEnter={() => open !== null && setOpen(i)}
          >
            <u>{m.label[0]}</u>
            {m.label.slice(1)}
          </button>
          {open === i && (
            <div className={`${styles.dropdown} bevel-out`} role="menu">
              {m.entries.map((e, j) =>
                e.sep ? (
                  <div key={j} className="sep" />
                ) : (
                  <button key={j} className={styles.dropItem} role="menuitem" disabled={e.disabled} onClick={() => run(e)}>
                    {e.icon && <span className={styles.ico} aria-hidden>{e.icon}</span>}
                    <span>{e.label}</span>
                    {e.shortcut && <span className={styles.shortcut}>{e.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
