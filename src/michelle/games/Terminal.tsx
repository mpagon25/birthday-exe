import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext';
import { useGameState } from '../state/GameState';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { DEV_LINES } from '../content/texts';
import { PxButton } from '../ui/PixelUI';
import styles from './Games.module.css';

interface Line {
  text: string;
  kind?: 'err' | 'warn' | 'pink';
}

export function Terminal() {
  const game = useGame();
  const gs = useGameState();
  const ach = useAchievements();
  const audio = useAudio();
  const [lines, setLines] = useState<Line[]>([{ text: 'MICHELLE OS v33.0 — retro terminal' }, { text: 'Tipp: help. Oder etwas Mutigeres.' }]);
  const [cmd, setCmd] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    input.current?.focus();
  }, []);

  const push = (...ls: Line[]) => setLines((l) => [...l, ...ls].slice(-14));

  const exec = () => {
    const c = cmd.trim().toLowerCase();
    push({ text: `> ${cmd}`, kind: 'pink' });
    setCmd('');
    switch (c) {
      case 'michelle.dev': {
        audio.play('glitch');
        DEV_LINES.forEach((t, i) => window.setTimeout(() => { audio.play('tick'); push({ text: t, kind: /ERROR/.test(t) ? 'err' : /WARNING/.test(t) ? 'warn' : undefined }); }, 200 + i * 350));
        gs.addXp(33);
        break;
      }
      case 'help':
        push({ text: 'commands: michelle.dev, cats, whiskey, chaos, metal, god, quest, achievements, clear, exit' });
        break;
      case 'cats':
        push({ text: `cats detected: 3 (+1 plush). petted: ${gs.data.catsPetted.length}/3`, kind: 'warn' });
        game.spawn('cat');
        break;
      case 'whiskey':
        push({ text: 'ERROR: NOT ENOUGH WHISKEY', kind: 'err' });
        audio.play('error');
        break;
      case 'chaos':
        push({ text: 'MAXIMUM BIRTHDAY CHAOS ACTIVATED' });
        game.startChaos();
        break;
      case 'metal':
        push({ text: 'BLEGH!' });
        game.startMetal();
        break;
      case 'god':
        push({ text: 'GOD MODE toggled' });
        game.toggleGod();
        break;
      case 'quest':
        push({ text: `whiskey: ${gs.data.whiskeyRounds >= 1 ? 'done' : 'todo'} | cat: ${gs.data.catsPetted.length >= 1 ? 'done' : 'todo'} | sloth: ${gs.data.slothFound ? 'done' : 'todo'} | voucher: ${gs.data.voucherUnlocked ? 'UNLOCKED' : 'locked'}` });
        break;
      case 'achievements':
        push({ text: `${ach.count}/${ach.total} unlocked` });
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        game.closeModal();
        break;
      case 'sudo rm -rf /':
        push({ text: 'nice try. the cats own root.', kind: 'err' });
        audio.play('error');
        break;
      case '':
        break;
      default:
        audio.play('error');
        push({ text: `command not found: ${c}. have you tried turning 33 off and on again?`, kind: 'err' });
    }
  };

  return (
    <div className="stack">
      <div className={styles.term} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={l.kind ? styles[l.kind] : undefined}>{l.text}</div>
        ))}
      </div>
      <input ref={input} className="pxinput" value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && exec()} placeholder="michelle.dev" aria-label="Terminal-Eingabe" />
      <div className="row" style={{ justifyContent: 'center' }}>
        <PxButton onClick={exec}>Enter</PxButton>
        <PxButton variant="ghost" onClick={game.closeModal}>Zurück zum Pub</PxButton>
      </div>
    </div>
  );
}
