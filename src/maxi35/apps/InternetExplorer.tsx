import { useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useActions } from '../state/ActionsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import styles from './Apps.module.css';

type Page = 'home' | 'filme' | 'serien' | 'entdecken' | 'guestbook';

const URLS: Record<Page, string> = {
  home: 'http://www.geocities.com/Area51/Cavern/3535/index.html',
  filme: 'http://www.geocities.com/Area51/Cavern/3535/filme.html',
  serien: 'http://www.geocities.com/Area51/Cavern/3535/serien.html',
  entdecken: 'http://www.geocities.com/Area51/Cavern/3535/entdecken.html',
  guestbook: 'http://www.geocities.com/Area51/Cavern/3535/guestbook.cgi',
};

export function InternetExplorer({ props }: AppComponentProps) {
  const a = useActions();
  const audio = useAudio();
  const [page, setPage] = useState<Page>((props.page as Page) ?? 'home');
  const [history, setHistory] = useState<Page[]>([]);
  const [hits] = useState(() => 350000 + Math.floor(Math.random() * 9000));
  const [entries, setEntries] = useLocalStorage<Array<{ name: string; text: string }>>('maxi35.guestbook', [
    { name: 'Gandalf', text: 'Nette Seite. Fliegt, ihr Narren! (zum Pub)' },
    { name: 'xXx_Dungeon_Master_xXx', text: 'Natural 20 beim ersten Besuch. Beweise habe ich keine.' },
  ]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const nav = (p: Page) => {
    audio.play('click');
    setHistory((h) => [...h, page]);
    setPage(p);
  };
  const back = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    audio.play('click');
    setHistory((h) => h.slice(0, -1));
    setPage(prev);
  };

  const sign = () => {
    if (!name.trim() || !text.trim()) {
      audio.play('error');
      return;
    }
    audio.play('xp');
    setEntries((e) => [{ name: name.trim().slice(0, 30), text: text.trim().slice(0, 200) }, ...e].slice(0, 20));
    setName('');
    setText('');
  };

  const digits = String(hits).padStart(6, '0').split('');

  return (
    <>
      <div className={styles.ieToolbar}>
        <button className="btn" onClick={back} disabled={history.length === 0}>◀ Zurück</button>
        <button className="btn" disabled>Vor ▶</button>
        <button className="btn" onClick={() => a.notify('Stop', 'Die Seite lädt seit 1998. Abbrechen nicht möglich.', 'warn')}>✖ Stop</button>
        <button className="btn" onClick={() => audio.play('open')}>↻ Aktualisieren</button>
        <button className="btn" onClick={() => nav('home')}>🏠 Home</button>
      </div>
      <div className={styles.ieAddress}>
        <span>Adresse:</span>
        <div className="field">{URLS[page]}</div>
      </div>
      <div className={styles.iePage}>
        {page === 'home' && (
          <>
            <div className="marquee" style={{ color: '#ff0', fontWeight: 'bold' }}>
              <span>★★★ Willkommen auf meiner Homepage!!! ★★★ Best viewed in Netscape 4.0 at 800x600 ★★★ Du bist Besucher Nr. {hits} ★★★</span>
            </div>
            <h1>~ The Rabbit Hole ~</h1>
            <div>
              <span className={styles.gifBox}>🍀</span>
              <span className={styles.gifBounce}>🍺</span>
              <span className={styles.gifBox}>🎲</span>
              <span className={styles.gifBounce}>🧙</span>
              <span className={styles.gifBox}>🍄</span>
            </div>
            <div className={styles.underConstruction}>🚧 UNDER CONSTRUCTION – seit 1998 – 🚧</div>
            <p>
              Hi! Das ist meine Seite über <b>alles, was wichtig ist</b>: Pubs, Pints, Pen & Paper, Pflanzen und Pixel. <span className={styles.newBadge}>NEW!</span>
            </p>
            <p>
              <a href="#filme" onClick={(e) => { e.preventDefault(); nav('filme'); }}>[ Filme ]</a> ·{' '}
              <a href="#serien" onClick={(e) => { e.preventDefault(); nav('serien'); }}>[ Serien ]</a> ·{' '}
              <a href="#entdecken" onClick={(e) => { e.preventDefault(); nav('entdecken'); }}>[ Zu entdecken ]</a> ·{' '}
              <a href="#guestbook" onClick={(e) => { e.preventDefault(); nav('guestbook'); }}>[ Gästebuch ]</a>
            </p>
            <p>
              Hit Counter:{' '}
              <span className={styles.hitCounter}>
                {digits.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </span>
            </p>
            <div className={styles.webring}>
              ~ Irish Pub Webring ~<br />
              [ <a href="#prev" onClick={(e) => { e.preventDefault(); a.notify('Webring', 'Vorherige Seite: 404. Der Webring hat ein Loch.', 'error'); }}>Zurück</a> | <a href="#rand" onClick={(e) => { e.preventDefault(); a.randomNotification(); }}>Zufall</a> | <a href="#next" onClick={(e) => { e.preventDefault(); a.notify('Webring', 'Nächste Seite: Eine Seite über Brezn. Nur Brezn.', 'info'); }}>Weiter</a> ]
            </div>
            <p style={{ fontSize: 11, color: '#aaa' }}>Diese Seite ist optimiert für 56k-Modems und Guinness. © 1998–2026 Level 35 Productions.</p>
          </>
        )}
        {page === 'filme' && (
          <>
            <h1>Filme.exe</h1>
            <div className={styles.underConstruction}>🎬 POPCORN WIRD GELADEN... 42% 🎬</div>
            <div className={styles.listPlain}>
              <p>★★★★★ Drei Teile. Elf Stunden. Extended. Kein Kompromiss.</p>
              <p>★★★★☆ Der Film, bei dem alle „nur kurz reinschauen“ wollten.</p>
              <p>★★★★★ Animationsfilm, bei dem erwachsene Menschen weinen. Zu Recht.</p>
              <p>★★★☆☆ Der mit dem Plot Twist, den man „sofort gesehen hat“.</p>
              <p>★★★★★ Pub-Szene. Eigentlich nur wegen der Pub-Szene.</p>
            </div>
            <p><span className={styles.newBadge}>NEW!</span> Filmabend-Regel: Wer einschläft, zahlt die nächste Runde.</p>
            <p><a href="#home" onClick={(e) => { e.preventDefault(); nav('home'); }}>[ Zurück zur Startseite ]</a></p>
          </>
        )}
        {page === 'serien' && (
          <>
            <h1>Serien.exe</h1>
            <p className="blink" style={{ color: '#f0f' }}>▶ Nächste Folge startet in 5... 4... 3...</p>
            <div className={styles.listPlain}>
              <p>📺 Status: Staffel 3, Folge 7. Seit drei Wochen. Aus Gründen.</p>
              <p>📺 Anime-Opening: wird NICHT übersprungen. Das ist Kultur.</p>
              <p>📺 Watchlist: 847 Einträge. Lebenserwartung: reicht nicht.</p>
              <p>📺 Serienabend-Snack: Brezn. Immer Brezn.</p>
            </div>
            <div className={styles.underConstruction}>⚠ SPOILER-FREIE ZONE ⚠</div>
            <p><a href="#home" onClick={(e) => { e.preventDefault(); nav('home'); }}>[ Zurück zur Startseite ]</a></p>
          </>
        )}
        {page === 'entdecken' && (
          <>
            <h1>Zu entdecken...</h1>
            <div className={styles.listPlain}>
              {['Filme', 'Serien', 'Anime', 'Games', 'Brettspiele', 'Bouldern', 'Berge & Touren', 'Pflanzen', 'Rezepte & Genuss', 'Kreativprojekte', 'Und noch viel mehr...'].map((t) => (
                <p key={t}>📁 {t} <span style={{ color: '#aaa' }}>— Ordner wird geöffnet... bitte warten (seit 1998)</span></p>
              ))}
            </div>
            <p>
              <span className={styles.gifBounce}>🚀</span> Neue Welten erkunden <span className={styles.gifBounce}>🚀</span>
            </p>
            <p><a href="#home" onClick={(e) => { e.preventDefault(); nav('home'); }}>[ Zurück zur Startseite ]</a></p>
          </>
        )}
        {page === 'guestbook' && (
          <>
            <h1>Gästebuch</h1>
            <p>Trag dich ein! (Wird nur in diesem Browser gespeichert. Wie 1998, nur ehrlicher.)</p>
            <div className={styles.guestbook}>
              <div className={styles.row}>
                <input className="field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} style={{ width: 120 }} />
                <input className="field" placeholder="Nachricht" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} style={{ flex: 1 }} onKeyDown={(e) => e.key === 'Enter' && sign()} />
                <button className="btn" onClick={sign}>Eintragen</button>
              </div>
            </div>
            <div className={styles.guestbook}>
              {entries.map((en, i) => (
                <p key={i}>
                  <b style={{ color: '#0f0' }}>{en.name}</b>: {en.text}
                </p>
              ))}
            </div>
            <p><a href="#home" onClick={(e) => { e.preventDefault(); nav('home'); }}>[ Zurück zur Startseite ]</a></p>
          </>
        )}
      </div>
      <div className={styles.ieStatus}>
        <span>Fertig</span>
        <span>🌐 Internetzone (Pub)</span>
      </div>
    </>
  );
}
