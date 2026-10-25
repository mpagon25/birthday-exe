import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from '../shared/stage/Stage';
import { useStage } from '../shared/stage/StageContext';
import { useWindowManager } from './desktop/WindowManager';
import { Window } from './desktop/Window';
import { TitleBar } from './desktop/TitleBar';
import { MenuBar } from './desktop/MenuBar';
import { IconBar } from './desktop/IconBar';
import { Taskbar } from './desktop/Taskbar';
import { Scene, type Bubble } from './scene/Scene';
import { ParticleCanvas, type ParticleHandle } from '../shared/fx/Particles';
import { CursorTrail } from '../shared/fx/CursorTrail';
import { PartyOverlay } from './overlays/PartyOverlay';
import { TripOverlay } from './overlays/TripOverlay';
import { Bsod } from './overlays/Bsod';
import { AchievementToasts } from './overlays/AchievementToasts';
import { ActionsCtx, type DesktopActions } from './state/ActionsContext';
import { useAudio } from '../shared/audio/AudioContext';
import { useAchievements } from '../shared/achievements/AchievementsContext';
import { useGameState } from './state/GameState';
import { useReducedMotion } from '../shared/hooks/useReducedMotion';
import { usePageVisible } from '../shared/hooks/usePageVisible';
import { useInterval } from '../shared/hooks/useInterval';
import { PROGRAM_IDS } from './apps/registry';
import { music } from './audio/music';
import { PINT_MESSAGES, RANDOM_NOTIFICATIONS, TOAST_LINES, WIZARD_WISDOM } from './content/texts';
import { STAGE_W } from '../shared/stage/constants';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

let bubbleKey = 0;

export function Desktop({ booted }: { booted: boolean }) {
  const wm = useWindowManager();
  const audio = useAudio();
  const ach = useAchievements();
  const game = useGameState();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const { scale } = useStage();
  const fx = useRef<ParticleHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [pourKey, setPourKey] = useState(0);
  const [party, setParty] = useState(false);
  const [trip, setTrip] = useState(false);
  const [bsod, setBsod] = useState(false);
  const [discoBoost, setDiscoBoost] = useState(false);
  const [signBlink, setSignBlink] = useState(false);
  const partyTimers = useRef<number[]>([]);
  const effects = !game.data.reducedEffects;

  const bubble = useCallback((text: string, x: number, y: number, ms = 2600) => {
    bubbleKey += 1;
    const key = bubbleKey;
    setBubbles((b) => [...b.slice(-4), { key, text, x, y }]);
    window.setTimeout(() => setBubbles((b) => b.filter((x) => x.key !== key)), ms);
  }, []);

  const notify = useCallback<DesktopActions['notify']>(
    (title, text, icon = 'info') => {
      wm.message({ title, text, icon });
    },
    [wm],
  );

  const openApp = useCallback(
    (appId: string, props?: Record<string, unknown>) => {
      audio.play('open');
      wm.open(appId, { props });
    },
    [audio, wm],
  );

  const confetti = useCallback<DesktopActions['confetti']>((opts = {}) => fx.current?.confetti(opts.x, opts.y, opts.count), []);
  const cloverRain = useCallback(() => {
    audio.play('xp');
    fx.current?.cloverRain();
  }, [audio]);

  const showVoucher = useCallback(() => {
    const already = wm.isOpen('voucher');
    wm.open('voucher');
    if (!already) {
      audio.play('clink');
      fx.current?.confetti(780, 300, 90);
      bubble(TOAST_LINES[Math.floor(Math.random() * TOAST_LINES.length)], 560, 480);
      ach.unlock('whiskeywizard');
    }
  }, [wm, audio, bubble, ach]);

  const showLevelUp = useCallback(() => {
    wm.open('levelup');
  }, [wm]);

  const pourPint = useCallback(() => {
    audio.play('pour');
    setPourKey((k) => k + 1);
    const n = game.inc('pints');
    ach.unlock('fellowship');
    if (n >= 10) ach.unlock('hydration');
    const msg = PINT_MESSAGES[n];
    if (msg) window.setTimeout(() => notify(msg.title, msg.text, n === 5 ? 'error' : 'beer'), 1400);
    if (n % 2 === 0) bubble('Noch eins? Immer.', 600, 560, 1800);
  }, [audio, game, ach, notify, bubble]);

  const clink = useCallback(() => {
    audio.play('clink');
    const n = game.inc('clinks');
    fx.current?.sparkle(560, 545, 10);
    fx.current?.sparkle(1300, 450, 6);
    bubble(TOAST_LINES[Math.floor(Math.random() * TOAST_LINES.length)], 540, 470, 1800);
    if (n >= 5) ach.unlock('onemoreround');
  }, [audio, game, bubble, ach]);

  const stopParty = useCallback(() => {
    partyTimers.current.forEach((t) => window.clearInterval(t));
    partyTimers.current.forEach((t) => window.clearTimeout(t));
    partyTimers.current = [];
    setParty(false);
  }, []);

  const startParty = useCallback(() => {
    if (party) return;
    setParty(true);
    ach.unlock('party');
    audio.play('fanfare');
    window.setTimeout(() => audio.play('error'), 900);
    window.setTimeout(() => audio.play('birthday'), 1500);
    fx.current?.confetti(STAGE_W / 2, 300, 200);
    fx.current?.cloverRain(60);
    fx.current?.beerRise(14);
    const fw = window.setInterval(() => {
      fx.current?.firework();
      audio.play('firework');
    }, 700);
    const cf = window.setInterval(() => fx.current?.confetti(200 + Math.random() * 1100, 200 + Math.random() * 300, 50), 1200);
    const end = window.setTimeout(() => stopParty(), 14000);
    partyTimers.current = [fw, cf, end];
  }, [party, ach, audio, stopParty]);

  const stopTrip = useCallback(() => setTrip(false), []);
  const startTrip = useCallback(() => {
    if (trip) return;
    setTrip(true);
    ach.unlock('reality');
    audio.play('glitch');
    fx.current?.stars(40);
    window.setTimeout(() => fx.current?.stars(30), 2000);
  }, [trip, ach, audio]);

  useEffect(() => {
    if (!trip) return;
    const t = window.setTimeout(() => setTrip(false), 8000);
    return () => window.clearTimeout(t);
  }, [trip]);

  // Party and trip end on Escape.
  useEffect(() => {
    if (!party && !trip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopParty();
        stopTrip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [party, trip, stopParty, stopTrip]);

  const shutdown = useCallback(() => {
    audio.play('error');
    setBsod(true);
  }, [audio]);
  const dismissBsod = useCallback(() => {
    setBsod(false);
    audio.play('boot');
    notify('Systemmeldung', ['Nur Spaß. Level 35 läuft weiter.', 'Beenden ist keine Option. Das Pub schließt nie.'], 'ok');
  }, [audio, notify]);

  const minimizeAll = useCallback(() => {
    audio.play('close');
    wm.windows.forEach((w) => wm.minimize(w.id));
  }, [audio, wm]);

  const wizardSpeak = useCallback(() => {
    openApp('wizard');
  }, [openApp]);

  const cowToast = useCallback(() => {
    audio.play('moo');
    window.setTimeout(() => audio.play('clink'), 400);
    bubble('Prost! Muuuh. 🍺', 1250, 350, 2200);
    fx.current?.sparkle(1300, 450, 8);
    game.inc('clinks');
    ach.unlock('moo');
  }, [audio, bubble, game, ach]);

  const petAnimal = useCallback<DesktopActions['petAnimal']>(
    (which) => {
      if (which === 'dog') {
        audio.play('snore');
        bubble('Zzz... *schnarch* ...wuff... Zzz', 150, 540);
      } else if (which === 'cat') {
        audio.play('tick');
        bubble('Miau. (Ignoriert dich weiter.)', 1050, 720);
      } else {
        audio.play('tick');
        bubble('Zzz... (träumt von Guinness-Schaum)', 1300, 850);
      }
    },
    [audio, bubble],
  );

  const alien = useCallback(() => {
    audio.play('glitch');
    fx.current?.sparkle(1225, 360, 12);
    bubble('👽 Ich komme in Frieden. Und wegen des Whiskeys.', 1150, 270);
  }, [audio, bubble]);

  const fireplace = useCallback(() => {
    audio.play('bubble');
    fx.current?.sparkle(150, 560, 14);
    bubble('*knister* Gemütlichkeit +5. Hobbit-Modus aktiv.', 100, 430);
  }, [audio, bubble]);

  const disco = useCallback(() => {
    audio.play('xp');
    setDiscoBoost(true);
    fx.current?.stars(25);
    window.setTimeout(() => setDiscoBoost(false), 6000);
    bubble('🪩 Saturday Night Fellowship!', 1000, 160, 2000);
  }, [audio, bubble]);

  const lastNotification = useRef(-1);
  const randomNotification = useCallback(() => {
    let i = Math.floor(Math.random() * RANDOM_NOTIFICATIONS.length);
    if (i === lastNotification.current) i = (i + 1) % RANDOM_NOTIFICATIONS.length;
    lastNotification.current = i;
    const n = RANDOM_NOTIFICATIONS[i];
    wm.message({ title: n.title, text: n.text, icon: n.icon, x: 1000 + Math.random() * 200, y: 120 + Math.random() * 500 });
  }, [wm]);

  const actions = useMemo<DesktopActions>(
    () => ({
      openApp, pourPint, clink, showLevelUp, showVoucher, startParty, stopParty, startTrip, stopTrip, cloverRain, confetti, notify, randomNotification, shutdown, minimizeAll, wizardSpeak, cowToast, petAnimal, alien, fireplace, disco,
      partyActive: party,
      tripActive: trip,
    }),
    [openApp, pourPint, clink, showLevelUp, showVoucher, startParty, stopParty, startTrip, stopTrip, cloverRain, confetti, notify, randomNotification, shutdown, minimizeAll, wizardSpeak, cowToast, petAnimal, alien, fireplace, disco, party, trip],
  );

  // Welcome sequence after boot.
  const welcomed = useRef(false);
  useEffect(() => {
    if (!booted || welcomed.current) return;
    welcomed.current = true;
    setSignBlink(true);
    window.setTimeout(() => {
      music.selectById('spell');
      music.play();
    }, 2200);
    window.setTimeout(() => setSignBlink(false), 2600);
    window.setTimeout(() => fx.current?.confetti(780, 200, 110), 600);
    window.setTimeout(() => {
      audio.play('info');
      wm.message({
        title: 'Systemmeldung',
        text: ['Level 35 erfolgreich freigeschaltet!', 'Neue Quests, mehr Erfahrungspunkte und ein ziemlich guter Tropfen warten auf dich.'],
        icon: 'ok',
        buttons: [{ label: 'Geil!', primary: true, onClick: () => fx.current?.sparkle(780, 500, 12) }],
        x: 560,
        y: 380,
      });
    }, 1400);
  }, [booted, audio, wm]);

  // Random system notifications.
  useInterval(() => {
    const openMsgs = wm.windows.filter((w) => w.appId === 'msgbox').length;
    if (openMsgs < 2 && Math.random() < 0.6) {
      audio.play('info');
      randomNotification();
    }
  }, 50000, booted && visible);

  // Wizard mutters occasionally.
  useInterval(() => {
    if (Math.random() < 0.5) bubble(WIZARD_WISDOM[Math.floor(Math.random() * WIZARD_WISDOM.length)].split('.')[0] + '.', 520, 400, 3200);
  }, 38000, booted && visible && effects);

  // Cow toasts the user now and then.
  useInterval(() => {
    if (Math.random() < 0.5) {
      bubble('Prost! 🍺', 1250, 350, 1800);
      fx.current?.sparkle(1300, 450, 6);
    }
  }, 27000, booted && visible && effects);

  // Konami code + keyboard shortcuts.
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if (!typing) {
        if (e.key === KONAMI[pos] || e.key.toLowerCase() === KONAMI[pos]) {
          pos += 1;
          if (pos === KONAMI.length) {
            pos = 0;
            startParty();
          }
        } else pos = e.key === KONAMI[0] ? 1 : 0;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        pourPint();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        showVoucher();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startParty, pourPint, showVoucher]);

  // Curiosity achievement: all programs opened at least once.
  useEffect(() => {
    if (PROGRAM_IDS.every((id) => game.data.openedPrograms.includes(id))) ach.unlock('curiosity');
  }, [game.data.openedPrograms, ach]);

  return (
    <ActionsCtx.Provider value={actions}>
      <Stage>
        <div
          ref={stageRef}
          className={trip ? 'trip-active' : undefined}
          style={{ position: 'absolute', inset: 0, ['--stage-scale' as string]: 1 } as React.CSSProperties}
        >
          <Scene bubbles={bubbles} pourKey={pourKey} discoBoost={discoBoost} neonBlink={party} signBlink={signBlink} effects={effects} partyActive={party} />
          <TitleBar />
          <MenuBar />
          <IconBar />
          {wm.windows.map((w) => (
            <Window key={w.id} win={w} />
          ))}
          <Taskbar />
          <ParticleCanvas ref={fx} enabled={!reduced && effects} />
          <CursorTrail fx={fx} enabled={!reduced && effects && scale > 0.4} stageRef={stageRef} />
          {party && <PartyOverlay onStop={stopParty} />}
          {trip && <TripOverlay onStop={stopTrip} />}
          <AchievementToasts />
          {bsod && <Bsod onDismiss={dismissBsod} />}
        </div>
      </Stage>
    </ActionsCtx.Provider>
  );
}
