import { useEffect, useRef, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useWindowManager } from '../desktop/WindowManager';
import { DIR_LISTING, SECRET_TXT } from '../content/texts';
import { useAchievements as useAch } from '../../shared/achievements/AchievementsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import { music } from '../audio/music';
import styles from './Apps.module.css';

/* ---------- GameNight.exe ---------- */
const GAMES = [
  'Siedler-artiges Rohstoff-Gefeilsche', 'Pen & Paper Oneshot (wird 6 Stunden)', 'Kart-Rennen mit Freundschaftsende', 'Werwolf-Runde, alle verdächtigen den Erklärbär',
  'Dungeon Crawler, Charakterbogen aus 2014', 'Koop-Shooter, Headset vergessen', 'Partyspiel mit Zeichnen (keiner kann zeichnen)', 'Das lange Strategiespiel, das keiner zu Ende spielt',
];

export function GameNight({ close }: AppComponentProps) {
  const audio = useAudio();
  const a = useActions();
  const [hot, setHot] = useState<number | null>(null);
  const [win, setWin] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [snacks, setSnacks] = useState(60);
  useInterval(() => setSnacks((s) => Math.max(0, s - 1)), 2500);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    audio.play('dice');
    let i = Math.floor(Math.random() * GAMES.length);
    let delay = 40;
    const step = () => {
      i = (i + 1) % GAMES.length;
      setHot(i);
      audio.play('tick');
      delay *= 1.18;
      if (delay < 500) window.setTimeout(step, delay);
      else {
        setWin(i);
        setSpinning(false);
        audio.play('xp');
      }
    };
    step();
  };

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>🎮 GameNight.exe</div>
      <div className={styles.muted}>Was spielen wir heute? Das Rad entscheidet. Diskussionen dauern sonst länger als das Spiel.</div>
      <div className={styles.wheel}>
        {GAMES.map((g, i) => (
          <div key={g} className={`${styles.wheelItem} ${hot === i && win === null ? styles.hot : ''} ${win === i ? styles.win : ''}`}>
            {g}
          </div>
        ))}
      </div>
      {win !== null && <div className="field" style={{ textAlign: 'center' }}>🎉 Heute: <b>{GAMES[win]}</b></div>}
      <div>
        <div className={styles.statLabel}>
          <span>Snack-Vorrat</span>
          <span>{snacks}%</span>
        </div>
        <div className={`progress ${snacks < 30 ? '' : 'green'}`}>
          <div className="blocks">
            {Array.from({ length: Math.round(snacks / 3) }).map((_, i) => (
              <span key={i} className="block" />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={spin} disabled={spinning}>Rad drehen</button>
        <button className="btn" onClick={() => { setSnacks(100); audio.play('xp'); a.notify('Snacks', 'Brezn nachgelegt. Bavarian DLC sei Dank.', 'ok'); }}>Brezn nachlegen</button>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}

/* ---------- Kaffee_irl.exe ---------- */
export function Kaffee({ close }: AppComponentProps) {
  const audio = useAudio();
  const a = useActions();
  const [progress, setProgress] = useState(0);
  const [brewing, setBrewing] = useState(false);
  const [cups, setCups] = useState(0);
  useInterval(() => setProgress((p) => Math.min(100, p + 4)), 90, brewing);
  useEffect(() => {
    if (brewing && progress >= 100) {
      setBrewing(false);
      setCups((c) => {
        const n = c + 1;
        audio.play('info');
        if (n === 3) a.notify('Warnung', 'Herzfrequenz nähert sich dem 8-Bit-Soundtrack. Kaffee_irl.exe läuft weiter.', 'warn');
        if (n === 5) a.notify('Kaffee', 'Coffee dependency: Running in background. Prozess kann nicht beendet werden.', 'error');
        return n;
      });
    }
  }, [progress, brewing, audio, a]);

  const brew = () => {
    if (brewing) return;
    setProgress(0);
    setBrewing(true);
    audio.play('pour');
  };

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>☕ Kaffee_irl.exe</div>
      <div className={styles.coffeeCup} aria-hidden>
        {'   '}<span className={styles.steam}>(</span> <span className={styles.steam}>)</span> <span className={styles.steam}>(</span>
        {'\n'}
        {'  .-----------.\n  |           |__\n  |  LEVEL 35 |  )\n  |           |_/\n  \\___________/'}
      </div>
      <div>
        <div className={styles.statLabel}>
          <span>{brewing ? 'Brewing...' : cups > 0 ? 'Kaffee fertig!' : 'Bereit'}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress">
          <div className="blocks">
            {Array.from({ length: Math.round(progress / 3) }).map((_, i) => (
              <span key={i} className="block" />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.muted}>Tassen heute: {cups} · Coffee dependency: Running in background.</div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={brew} disabled={brewing}>{cups > 0 ? 'Noch einen' : 'Brühen'}</button>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}

/* ---------- QuestLog.exe ---------- */
const QUESTS: Array<{ t: string; done: boolean; note: string }> = [
  { t: 'Neue Welten erkunden', done: true, note: 'Abgeschlossen. Nebenquest: Rückweg finden.' },
  { t: 'Filme & Serien erleben', done: true, note: 'Abgeschlossen. Watchlist trotzdem länger geworden.' },
  { t: 'Brettspiele & PnP', done: true, note: 'Abgeschlossen. Der Erklärbär hat immer recht.' },
  { t: 'Bouldern & Berge', done: true, note: 'Abgeschlossen. Grip Strength +10.' },
  { t: 'Gute Drinks & Kaffee', done: true, note: 'Abgeschlossen. Mehrfach. Gründlich.' },
  { t: 'Pflanzen & Natur', done: true, note: 'Abgeschlossen. 47 Pflanzen leben noch.' },
  { t: 'Kreative Projekte', done: true, note: 'Abgeschlossen. 97% davon in ideen.zip.' },
  { t: 'Epische Games', done: true, note: 'Abgeschlossen. Backlog: unverändert episch.' },
  { t: 'Unvergessliche Momente', done: false, note: 'Quest läuft. Kann nur IRL abgeschlossen werden. Nächster Checkpoint: 21.11.' },
  { t: 'Und noch viel mehr...', done: false, note: 'Quest läuft. Die Fellowship of the Pint ist bereit.' },
];

export function QuestLog({ close }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  return (
    <div className={styles.pane}>
      <div className={styles.h1}>📜 Quest Log</div>
      <div className={styles.muted}>Next Adventures – synchronisiert mit der Kreidetafel im Pub.</div>
      <div className="bevel-in" style={{ padding: 4 }}>
        {QUESTS.map((q) => (
          <button key={q.t} className={`${styles.quest} ${q.done ? styles.done : ''}`} onClick={() => { audio.play(q.done ? 'info' : 'warn'); a.notify(q.t, q.note, q.done ? 'ok' : 'info'); }}>
            <span className={styles.box}>{q.done ? '✔' : ''}</span>
            <span className={styles.qt}>{q.t}</span>
          </button>
        ))}
      </div>
      <div className={styles.buttons}>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}

/* ---------- About ---------- */
export function About({ close }: AppComponentProps) {
  return (
    <div className={styles.pane}>
      <div className={styles.aboutLogo}>
        🍀 MAXI 35.EXE 🍀
        <br />
        Level Up im Lebensspiel!
      </div>
      <div style={{ textAlign: 'center', fontSize: 13 }}>
        Version 35.0 (Build 2111)
        <br />
        Lizenziert an: den Geburtstagsmenschen
      </div>
      <div className={styles.sysinfo}>
        {`CPU:     Pentium 35 MHz (overclocked by coffee)
RAM:     35 MB (34 MB used by open tabs)
GPU:     Guinness Processing Unit
Storage: 1.44 MB ideen.zip
Audio:   Web Audio Synth, 100% samplefrei
Uptime:  35 Jahre, keine Neustarts`}
      </div>
      <div className={styles.muted} style={{ textAlign: 'center' }}>
        Gebaut mit React, TypeScript, Vite, Motion, Web Audio, Liebe und mindestens einem Pint.
      </div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={close}>OK</button>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
export function Settings({ close }: AppComponentProps) {
  const audio = useAudio();
  const game = useGameState();
  const ach = useAchievements();
  const wm = useWindowManager();
  return (
    <div className={styles.pane}>
      <div className={styles.h1}>⚙️ Einstellungen</div>
      <div className={styles.settingRow}>
        <span style={{ width: 90 }}>Lautstärke</span>
        <input type="range" min={0} max={100} value={Math.round(audio.volume * 100)} onChange={(e) => audio.setVolume(parseInt(e.target.value, 10) / 100)} aria-label="Lautstärke" />
        <span style={{ width: 36, textAlign: 'right' }}>{Math.round(audio.volume * 100)}%</span>
      </div>
      <div className={styles.settingRow}>
        <span style={{ width: 90 }}>Musik</span>
        <input type="range" min={0} max={100} value={Math.round(audio.musicVolume * 100)} onChange={(e) => audio.setMusicVolume(parseInt(e.target.value, 10) / 100)} aria-label="Musiklautstärke" />
        <span style={{ width: 36, textAlign: 'right' }}>{Math.round(audio.musicVolume * 100)}%</span>
      </div>
      <label className={styles.settingRow}>
        <input type="checkbox" checked={audio.muted} onChange={(e) => audio.setMuted(e.target.checked)} />
        Stumm (Mute)
      </label>
      <label className={styles.settingRow}>
        <input
          type="checkbox"
          checked={music.playing}
          onChange={(e) => {
            audio.unlock();
            if (e.target.checked) music.play();
            else music.stop();
          }}
        />
        Hintergrundmusik läuft (Titel im Tavern Radio wählbar)
      </label>
      <label className={styles.settingRow}>
        <input type="checkbox" checked={game.data.reducedEffects} onChange={(e) => game.set('reducedEffects', e.target.checked)} />
        Effekte reduzieren (Feuer, Neon, Partikel, Cursor-Trail)
      </label>
      <div className="sep" />
      <div className={styles.muted}>Fortschritt: {ach.count}/{ach.total} Achievements · {game.data.pints} Pints · {game.data.diceRolls} Würfe</div>
      <div className={styles.buttons}>
        <button
          className="btn"
          onClick={() =>
            wm.message({
              title: 'Zurücksetzen',
              text: 'Alle Achievements und Zähler löschen?',
              icon: 'warn',
              buttons: [{ label: 'Ja', onClick: () => { ach.reset(); game.reset(); } }, { label: 'Abbrechen', primary: true }],
            })
          }
        >
          Fortschritt löschen
        </button>
        <button className="btn primary" onClick={close}>OK</button>
      </div>
    </div>
  );
}

/* ---------- Run (Ausführen) ---------- */
export function Run({ close }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  const gs = useGameState();
  const achv = useAch();
  const [cmd, setCmd] = useState('');
  const [out, setOut] = useState('C:\\MAXI35> _\nTipp: help');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus();
  }, []);

  const exec = () => {
    const c = cmd.trim().toLowerCase();
    let text = '';
    switch (c) {
      case 'help':
      case '?':
        text = 'Befehle: dir, party, trip, beer, prost, dice, whiskey, rabbit, radio, quiz, dungeon, sweeper, zapfen, botanik, bsod, achievements, clover, y, n, exit';
        break;
      case 'dir':
      case 'ls':
        text = DIR_LISTING;
        audio.play('tick');
        break;
      case 'secret.txt':
      case 'type secret.txt':
      case 'cat secret.txt':
        text = SECRET_TXT.join('\n');
        audio.play('xp');
        gs.collect('secretfile');
        achv.unlock('secretfile');
        break;
      case 'dont_open.exe':
      case 'dont_open':
        text = 'Du wurdest gewarnt.';
        a.startTrip();
        break;
      case 'whiskey.dll':
        text = 'whiskey.dll wird geladen...';
        a.showVoucher();
        break;
      case 'autoexec.bat':
        text = '@echo off\nkaffee.exe /stark\necho Guten Morgen, Level 35.';
        a.openApp('kaffee');
        break;
      case 'config.sys':
        text = 'DEVICE=C:\\MAXI35\\PFLANZEN.SYS\nPFLANZEN=gegossen\nKATZE=schlaeft';
        break;
      case 'quiz':
        a.openApp('pubquiz');
        text = 'PubQuiz.exe gestartet.';
        break;
      case 'dungeon':
        a.openApp('dungeon');
        text = 'Dungeon.exe gestartet.';
        break;
      case 'sweeper':
      case 'minesweeper':
        a.openApp('sweeper');
        text = 'Pintsweeper.exe gestartet.';
        break;
      case 'zapfen':
      case 'pour':
        a.openApp('pour');
        text = 'Zapfhahn.exe gestartet.';
        break;
      case 'botanik':
      case 'memory':
        a.openApp('botanik');
        text = 'Botanik.exe gestartet.';
        break;
      case 'party':
        a.startParty();
        text = 'Party Mode aktiviert.';
        break;
      case 'trip':
        a.startTrip();
        text = 'Reality.exe wird beendet...';
        break;
      case 'beer':
      case 'bier':
      case 'pint':
        a.pourPint();
        text = 'Pint eingeschenkt.';
        break;
      case 'prost':
      case 'slainte':
      case 'sláinte':
        a.clink();
        text = 'Sláinte!';
        break;
      case 'dice':
      case 'd20':
        a.openApp('dice');
        text = 'W20.exe gestartet.';
        break;
      case 'whiskey':
      case 'gutschein':
        a.showVoucher();
        text = 'Gutschein geöffnet.';
        break;
      case 'rabbit':
        a.openApp('rabbithole');
        text = 'Follow the white rabbit...';
        break;
      case 'radio':
        a.openApp('radio');
        text = 'Tavern Radio gestartet.';
        break;
      case 'bsod':
      case 'exit':
        a.shutdown();
        text = 'Auf Wiedersehen.';
        break;
      case 'achievements':
        a.openApp('achievements');
        text = 'Achievements.exe gestartet.';
        break;
      case 'clover':
        a.cloverRain();
        text = 'Kleeblatt-Regen.';
        break;
      case 'y':
      case 'yes':
      case 'ja':
        a.showLevelUp();
        text = 'Continue? [Y/n] y\nLevel 35 wird fortgesetzt...';
        break;
      case 'n':
      case 'no':
        text = 'Continue? [Y/n] n\nNetter Versuch. Level 35 läuft trotzdem weiter.';
        audio.play('error');
        break;
      case 'sudo make me a sandwich':
        text = 'Okay. (Brezn statt Sandwich, Bavarian DLC.)';
        break;
      case '':
        text = '';
        break;
      default:
        audio.play('error');
        text = `Datei "${cmd}" nicht gefunden. Vielleicht im Pub?`;
    }
    setOut((o) => `${o}\nC:\\MAXI35> ${cmd}\n${text}`.split('\n').slice(-12).join('\n'));
    setCmd('');
  };

  return (
    <div className={styles.pane}>
      <div className={styles.row}>
        <span style={{ fontSize: 26 }} aria-hidden>▶️</span>
        <span style={{ fontSize: 12 }}>Geben Sie den Namen eines Programms, Ordners oder Pints ein.</span>
      </div>
      <input ref={input} className={`field ${styles.runInput}`} value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && exec()} aria-label="Befehl" placeholder="help" />
      <div className={styles.runOut}>{out}</div>
      <div className={styles.buttons}>
        <button className="btn primary" onClick={exec}>OK</button>
        <button className="btn" onClick={close}>Abbrechen</button>
      </div>
    </div>
  );
}
