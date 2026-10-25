import { useMemo, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { DUNGEON_BOSS, DUNGEON_ROOMS, type DungeonChoice, type DungeonRoom, type Stat } from '../content/texts';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import styles from './Apps.module.css';

const MAX_HP = 10;
const STATS: Record<Stat, number> = { STR: 2, CHA: 3, LUCK: 1 };
const ROOMS_PER_RUN = 5;

function pickRooms(): DungeonRoom[] {
  const pool = [...DUNGEON_ROOMS];
  const out: DungeonRoom[] = [];
  while (out.length < ROOMS_PER_RUN && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

export function Dungeon({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [rooms, setRooms] = useState<DungeonRoom[]>(pickRooms);
  const [step, setStep] = useState(-1);
  const [hp, setHp] = useState(MAX_HP);
  const [gold, setGold] = useState(3);
  const [items, setItems] = useState<string[]>(['Brezn']);
  const [log, setLog] = useState<{ text: string; bad?: boolean } | null>(null);
  const [roll, setRoll] = useState<string | null>(null);
  const [bossHits, setBossHits] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [state, setState] = useState<'intro' | 'room' | 'boss' | 'won' | 'dead'>('intro');
  const room = rooms[step];
  const hasSpell = items.includes('Feuerball of Sláinte');

  const begin = () => {
    setRooms(pickRooms());
    setStep(0);
    setHp(MAX_HP);
    setGold(3);
    setItems(['Brezn']);
    setLog(null);
    setRoll(null);
    setBossHits(0);
    setResolved(false);
    setState('room');
    audio.play('open');
  };

  const applyOutcome = (o: { text: string; hp?: number; gold?: number; item?: string }, bad: boolean) => {
    const nextHp = Math.min(MAX_HP, hp + (o.hp ?? 0));
    setHp(nextHp);
    setGold((g) => Math.max(0, g + (o.gold ?? 0)));
    if (o.item) setItems((it) => [...it, o.item!]);
    setLog({ text: o.text + (o.hp ? ` (${o.hp > 0 ? '+' : ''}${o.hp} HP)` : '') + (o.gold ? ` (${o.gold > 0 ? '+' : ''}${o.gold} Gold)` : '') + (o.item ? ` [Loot: ${o.item}]` : ''), bad });
    setResolved(true);
    if (nextHp <= 0) {
      setState('dead');
      audio.play('gameover');
    }
  };

  const choose = (c: DungeonChoice) => {
    if (resolved) return;
    if (c.costGold && gold < c.costGold) {
      audio.play('error');
      setLog({ text: 'Nicht genug Gold. Der Händler lacht. Alle lachen.', bad: true });
      return;
    }
    if (c.stat && c.dc) {
      const d = 1 + Math.floor(Math.random() * 20);
      const total = d + STATS[c.stat];
      audio.play('dice');
      setRoll(`W20: ${d} + ${c.stat} ${STATS[c.stat]} = ${total} gegen DC ${c.dc}${d === 20 ? ' – NATURAL 20!' : d === 1 ? ' – NATURAL 1!' : ''}`);
      const ok = d === 20 || (d !== 1 && total >= c.dc);
      window.setTimeout(() => {
        if (ok) {
          audio.play('xp');
          applyOutcome(c.success, false);
        } else {
          audio.play('hurt');
          applyOutcome(c.fail ?? { text: 'Fehlschlag.' }, true);
        }
      }, 500);
    } else {
      setRoll(null);
      audio.play('click');
      applyOutcome(c.success, false);
    }
  };

  const next = () => {
    setLog(null);
    setRoll(null);
    setResolved(false);
    if (step + 1 >= rooms.length) setState('boss');
    else setStep(step + 1);
    audio.play('step');
  };

  const attackBoss = () => {
    if (resolved) return;
    const d = 1 + Math.floor(Math.random() * 20);
    const bonus = STATS.STR + (hasSpell ? 2 : 0);
    const total = d + bonus;
    audio.play('dice');
    setRoll(`W20: ${d} + ${bonus} = ${total} gegen DC ${DUNGEON_BOSS.dc}${d === 20 ? ' – NATURAL 20!' : ''}`);
    setResolved(true);
    window.setTimeout(() => {
      if (d === 20 || total >= DUNGEON_BOSS.dc) {
        const hits = bossHits + (d === 20 ? 2 : 1);
        setBossHits(hits);
        audio.play('metalhit');
        if (hits >= DUNGEON_BOSS.hits) {
          setState('won');
          audio.play('fanfare');
          a.confetti({ count: 120 });
          game.inc('dungeonWins');
          ach.unlock('dungeonmaster');
          game.collect('ring');
          setLog({ text: 'Der Balrog der Bar fällt. Hinter dem Tresen: ein Ring. Nicht DER Ring. Aber ein guter.' });
        } else {
          setLog({ text: `Treffer! Der Balrog taumelt. (${hits}/${DUNGEON_BOSS.hits})` });
          setResolved(false);
        }
      } else {
        const nextHp = hp - 3;
        setHp(nextHp);
        audio.play('hurt');
        if (nextHp <= 0) {
          setState('dead');
          audio.play('gameover');
          setLog({ text: 'Der Balrog serviert dir die letzte Runde. Respawn at the nearest tavern.', bad: true });
        } else {
          setLog({ text: 'Daneben. Der Balrog kontert mit einem brennenden Tablett. -3 HP', bad: true });
          setResolved(false);
        }
      }
    }, 500);
  };

  const drinkPotion = () => {
    if (!items.includes('Brezn') || hp >= MAX_HP) return;
    setItems((it) => it.filter((x, i) => !(x === 'Brezn' && i === it.indexOf('Brezn'))));
    setHp((h) => Math.min(MAX_HP, h + 3));
    audio.play('bubble');
    setLog({ text: 'Brezn gegessen. +3 HP. Bavarian DLC sei Dank.' });
  };

  const hpBar = useMemo(() => Array.from({ length: MAX_HP }, (_, i) => i < hp), [hp]);

  return (
    <div className={styles.pane}>
      <div className={styles.row} style={{ justifyContent: 'space-between' }}>
        <b>🐉 Dungeon.exe</b>
        <span className={styles.muted}>Siege: {game.data.dungeonWins}</span>
      </div>
      <div className={styles.dgnStats}>
        <span className={styles.dgnHp} aria-label={`${hp} von ${MAX_HP} HP`}>{hpBar.map((on, i) => <i key={i} className={on ? '' : styles.empty} />)}</span>
        <span>Gold <b>{gold}</b></span>
        <span>STR <b>{STATS.STR}</b> CHA <b>{STATS.CHA}</b> LUCK <b>{STATS.LUCK}</b></span>
      </div>
      <div className={styles.muted}>Inventar: {items.join(', ') || 'leer'}</div>
      <div className={styles.dgn}>
        {state === 'intro' && (
          <>
            <div className={styles.dgnTitle}>Die Quest des Zauberers</div>
            <div>„Ein Balrog hat die Bar übernommen und serviert nur noch Tee. Das Pub braucht dich.“</div>
            <div>Fünf Räume, dann der Boss. Entscheidungen werden mit dem W20 geprüft. Eine Brezn hast du dabei.</div>
          </>
        )}
        {state === 'room' && room && (
          <>
            <div className={styles.dgnTitle}>Raum {step + 1}/{rooms.length}: {room.title}</div>
            <div>{room.text}</div>
          </>
        )}
        {state === 'boss' && (
          <>
            <div className={styles.dgnTitle}>Bossraum: {DUNGEON_BOSS.title}</div>
            <div>{DUNGEON_BOSS.text}</div>
            <div>Treffer nötig: {DUNGEON_BOSS.hits} · DC {DUNGEON_BOSS.dc}{hasSpell ? ' · Feuerball of Sláinte aktiv (+2)' : ''}</div>
          </>
        )}
        {state === 'won' && <div className={styles.dgnTitle}>QUEST ABGESCHLOSSEN. Die Bar ist frei. Das Pint ist dunkel. Alles ist gut.</div>}
        {state === 'dead' && <div className={styles.dgnTitle} style={{ color: '#f88' }}>DU BIST GEFALLEN. Respawn at the nearest tavern.</div>}
        {roll && <div className={styles.dgnRoll}>{roll}</div>}
        {log && <div className={`${styles.dgnLog} ${log.bad ? styles.bad : ''}`}>{log.text}</div>}
      </div>
      {state === 'intro' && (
        <div className={styles.buttons}>
          <button className="btn primary" onClick={begin}>Quest annehmen</button>
          <button className="btn" onClick={close}>Später</button>
        </div>
      )}
      {state === 'room' && room && !resolved && (
        <div className={styles.dgnChoices}>
          {room.choices.map((c) => (
            <button key={c.label} className="btn" onClick={() => choose(c)}>
              ▸ {c.label}{c.stat ? ` · DC ${c.dc}` : ''}
            </button>
          ))}
          {items.includes('Brezn') && hp < MAX_HP && <button className="btn" onClick={drinkPotion}>🥨 Brezn essen (+3 HP)</button>}
        </div>
      )}
      {state === 'room' && resolved && (
        <div className={styles.buttons}>
          <button className="btn primary" onClick={next}>{step + 1 >= rooms.length ? 'Zum Boss' : 'Weiter'}</button>
        </div>
      )}
      {state === 'boss' && (
        <div className={styles.buttons}>
          <button className="btn primary" onClick={attackBoss} disabled={resolved}>⚔ Angreifen (W20 + STR)</button>
          {items.includes('Brezn') && hp < MAX_HP && <button className="btn" onClick={drinkPotion} disabled={resolved}>🥨 Brezn essen</button>}
        </div>
      )}
      {(state === 'won' || state === 'dead') && (
        <div className={styles.buttons}>
          <button className="btn primary" onClick={begin}>Neue Quest</button>
          <button className="btn" onClick={close}>Zurück ins Pub</button>
        </div>
      )}
    </div>
  );
}
