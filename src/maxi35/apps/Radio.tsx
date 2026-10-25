import { useEffect, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { music, TRACKS } from '../audio/music';
import { useAudio } from '../../shared/audio/AudioContext';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import styles from './Apps.module.css';

export function Radio({ close }: AppComponentProps) {
  const audio = useAudio();
  const ach = useAchievements();
  const [playing, setPlaying] = useState(music.playing);
  const [index, setIndex] = useState(music.index);
  const [bars, setBars] = useState<number[]>(Array(12).fill(4));

  useEffect(() => {
    const off = music.onNote((voice, freq) => {
      setBars((b) => {
        const next = [...b];
        const slot = Math.min(11, Math.floor(Math.log2(freq / 55) * 2.2));
        next[slot] = 40;
        next[(slot + voice + 1) % 12] = 24;
        return next;
      });
    });
    const decay = window.setInterval(() => setBars((b) => b.map((h) => Math.max(4, h - 5))), 70);
    return () => {
      off();
      window.clearInterval(decay);
    };
  }, []);

  const toggle = () => {
    audio.unlock();
    if (music.playing) {
      music.stop();
      setPlaying(false);
    } else {
      music.play();
      setPlaying(true);
      ach.unlock('tavernDJ');
    }
  };
  const select = (i: number) => {
    audio.play('click');
    music.select(i);
    setIndex(music.index);
    if (!music.playing) {
      music.play();
      setPlaying(true);
      ach.unlock('tavernDJ');
    }
  };

  return (
    <div className={styles.pane}>
      <div className={styles.radio}>
        <div className={styles.radioDisplay}>
          <div className="marquee">
            <span>♫ {TRACKS[index].title} ♫ {playing ? 'NOW PLAYING' : 'STOPPED'} ♫ Tavern Radio 35.0 FM ♫</span>
          </div>
          <div className={styles.viz} aria-hidden>
            {bars.map((h, i) => (
              <span key={i} style={{ height: h }} />
            ))}
          </div>
        </div>
        <div className={styles.radioBtns}>
          <button className="btn" onClick={() => select(index - 1)} aria-label="Vorheriger Titel">⏮</button>
          <button className="btn primary" onClick={toggle} aria-label={playing ? 'Stop' : 'Play'}>{playing ? '⏹ Stop' : '▶ Play'}</button>
          <button className="btn" onClick={() => select(index + 1)} aria-label="Nächster Titel">⏭</button>
          <button className="btn" onClick={audio.toggleMuted}>{audio.muted ? '🔇 Mute an' : '🔊 Mute aus'}</button>
        </div>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <span>VOL</span>
          <input type="range" min={0} max={100} value={Math.round(audio.volume * 100)} onChange={(e) => audio.setVolume(parseInt(e.target.value, 10) / 100)} aria-label="Lautstärke" style={{ flex: 1 }} />
        </div>
        <ul className={styles.trackList}>
          {TRACKS.map((t, i) => (
            <li key={t.id} className={i === index ? styles.current : ''} onClick={() => select(i)}>
              {i === index && playing ? '▶' : '·'} {i + 1}. {t.title}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.muted}>Alle Titel wurden live vom Web-Audio-Synthesizer eingespielt. Keine Samples, keine GEMA, keine Gnade.</div>
      <div className={styles.buttons}>
        <button className="btn" onClick={close}>Schließen (Musik läuft weiter)</button>
      </div>
    </div>
  );
}
