import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from '../shared/stage/Stage';
import { useStage } from '../shared/stage/StageContext';
import { ParticleCanvas, type ParticleHandle } from '../shared/fx/Particles';
import { CursorTrail } from '../shared/fx/CursorTrail';
import { useAudio } from '../shared/audio/AudioContext';
import { useAchievements } from '../shared/achievements/AchievementsContext';
import { useReducedMotion } from '../shared/hooks/useReducedMotion';
import { usePageVisible } from '../shared/hooks/usePageVisible';
import { useInterval } from '../shared/hooks/useInterval';
import { STAGE_W } from '../shared/stage/constants';
import { GameCtx, type GameApi, type ModalKind, type ReactionKind, type SpriteKind } from './state/GameContext';
import { useGameState } from './state/GameState';
import { Scene, type Bubble, type XpPop } from './scene/Scene';
import type { SpriteItem } from './scene/SpriteLayer';
import { Boot } from './overlays/Boot';
import { Hud } from './ui/Hud';
import { Toasts } from './ui/Toasts';
import { DialogBox, type DialogItem } from './ui/DialogBox';
import { Modal, PxButton } from './ui/PixelUI';
import { WhiskeyRoulette } from './games/WhiskeyRoulette';
import { BugHunter } from './games/BugHunter';
import { Garden } from './games/Garden';
import { KimchiCombo } from './games/KimchiCombo';
import { CocktailMixer } from './games/CocktailMixer';
import { Atelier } from './games/Atelier';
import { Terminal } from './games/Terminal';
import { AchievementsMenu, HelpMenu, SettingsMenu, VoucherView } from './overlays/Menus';
import { mMusic } from './audio/tracks';
import { RANDOM_EVENTS } from './content/texts';
import ui from './ui/UI.module.css';
import ov from './overlays/Overlays.module.css';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const MODAL_TITLES: Record<ModalKind, string> = {
  roulette: 'Whiskey Roulette',
  bughunter: 'Bug Hunter 33',
  garden: 'Gemüsebeet',
  kimchi: 'Kimchi Combo',
  cocktail: 'Cocktail Mixer',
  atelier: 'Atelier',
  terminal: 'Terminal',
  achievements: 'Achievements',
  voucher: 'Level 33 Reward',
  settings: 'Einstellungen',
  help: 'Hilfe',
};
const GAME_MODALS: ModalKind[] = ['roulette', 'bughunter', 'garden', 'kimchi', 'cocktail'];

let keyCounter = 0;
const nextKey = () => ++keyCounter;

export function MichelleGame() {
  const audio = useAudio();
  const ach = useAchievements();
  const gs = useGameState();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const { scale } = useStage();
  const fx = useRef<ParticleHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [xpPops, setXpPops] = useState<XpPop[]>([]);
  const [sprites, setSprites] = useState<SpriteItem[]>([]);
  const [reaction, setReaction] = useState<ReactionKind | null>(null);
  const [metal, setMetal] = useState(false);
  const [chaos, setChaos] = useState(false);
  const [finale, setFinale] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [dark, setDark] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [chaosMeter, setChaosMeter] = useState(0);
  const [floatXp, setFloatXp] = useState<Array<{ key: number; x: number; y: number }>>([]);
  const clicks = useRef<number[]>([]);
  const chaosTimers = useRef<number[]>([]);
  const god = gs.data.godMode;
  const effects = !gs.data.reducedEffects;

  // ---------- helpers ----------
  const say = useCallback((lines: string | string[], speaker = 'Michelle') => {
    const item: DialogItem = { key: nextKey(), lines: Array.isArray(lines) ? lines : [lines], speaker };
    setDialogs((d) => [...d.slice(-2), item]);
  }, []);
  const bubble = useCallback((text: string, x: number, y: number, ms = 2400) => {
    const key = nextKey();
    setBubbles((b) => [...b.slice(-3), { key, text, x, y }]);
    window.setTimeout(() => setBubbles((b) => b.filter((i) => i.key !== key)), ms);
  }, []);
  const xpPopup = useCallback(
    (x: number, y: number, amount: number) => {
      const key = nextKey();
      setXpPops((p) => [...p.slice(-6), { key, x, y, amount }]);
      gs.addXp(amount);
      window.setTimeout(() => setXpPops((p) => p.filter((i) => i.key !== key)), 1300);
    },
    [gs],
  );
  const spawn = useCallback((kind: SpriteKind) => setSprites((s) => [...s.slice(-8), { key: nextKey(), kind }]), []);
  const removeSprite = useCallback((key: number) => setSprites((s) => s.filter((i) => i.key !== key)), []);
  const shake = useCallback(
    (ms = 500) => {
      if (!effects) return;
      setShaking(true);
      window.setTimeout(() => setShaking(false), ms);
    },
    [effects],
  );
  const react = useCallback((kind: ReactionKind) => {
    setReaction(kind);
    if (kind === 'glass') audio.play('clink');
    if (kind === 'horns') audio.play('metalhit');
    if (kind === 'heart') audio.play('coin');
    if (kind === 'headbang') audio.play('metalhit');
    if (kind === 'glass') fx.current?.sparkle(505, 375, 12);
    window.setTimeout(() => setReaction((r) => (r === kind ? null : r)), kind === 'headbang' ? 2000 : 1600);
  }, [audio]);
  const event = useCallback((text: string) => {
    setBanner(text);
    audio.play('coin');
    window.setTimeout(() => setBanner((b) => (b === text ? null : b)), 3500);
  }, [audio]);

  const openModal = useCallback(
    (kind: ModalKind) => {
      audio.play('open');
      setDialogs([]);
      setModal(kind);
      if (GAME_MODALS.includes(kind) && mMusic.playing && mMusic.track.id === 'main') mMusic.playTrack('arcade');
    },
    [audio],
  );
  const closeModal = useCallback(() => {
    audio.play('close');
    setModal(null);
    if (mMusic.playing && mMusic.track.id === 'arcade') mMusic.playTrack('main');
  }, [audio]);

  // ---------- modes ----------
  const startMetal = useCallback(() => {
    if (metal) return;
    setMetal(true);
    gs.set('metal', true);
    ach.unlock('blegh');
    audio.play('metalhit');
    const wasPlaying = mMusic.playing;
    audio.unlock();
    mMusic.playTrack('metal');
    shake(5000);
    window.setTimeout(() => {
      setMetal(false);
      if (wasPlaying) mMusic.playTrack('main');
      else mMusic.stop();
    }, 5200);
  }, [metal, gs, ach, audio, shake]);

  const stopChaos = useCallback(() => {
    chaosTimers.current.forEach((t) => {
      window.clearInterval(t);
      window.clearTimeout(t);
    });
    chaosTimers.current = [];
    setChaos(false);
    setChaosMeter(0);
    clicks.current = [];
  }, []);

  const startChaos = useCallback(() => {
    if (chaos) return;
    setChaos(true);
    audio.play('metalhit');
    window.setTimeout(() => audio.play('explosion'), 300);
    fx.current?.confetti(STAGE_W / 2, 300, 180);
    fx.current?.rain('💗', 40, '#ff3fa4');
    spawn('cat');
    window.setTimeout(() => spawn('cat'), 1500);
    shake(1200);
    const c1 = window.setInterval(() => fx.current?.confetti(200 + Math.random() * 1100, 200 + Math.random() * 400, 40), 900);
    const c2 = window.setInterval(() => {
      const key = nextKey();
      setFloatXp((f) => [...f.slice(-6), { key, x: 10 + Math.random() * 80, y: 20 + Math.random() * 60 }]);
      gs.addXp(33);
      audio.play('coin');
      window.setTimeout(() => setFloatXp((f) => f.filter((i) => i.key !== key)), 1500);
    }, 1100);
    const end = window.setTimeout(() => stopChaos(), 8000);
    chaosTimers.current = [c1, c2, end];
  }, [chaos, audio, spawn, shake, gs, stopChaos]);

  const toggleGod = useCallback(() => {
    const next = !gs.data.godMode;
    gs.set('godMode', next);
    audio.play(next ? 'fanfare' : 'close');
    if (next) {
      fx.current?.stars(40);
      say(['GOD MODE: INFINITE WHISKEY VIBES.', 'Rein visuell. Die Leber bleibt im Normalmodus.'], 'System');
    }
  }, [gs, audio, say]);

  const registerClick = useCallback(() => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 4000), now];
    const meter = Math.min(100, clicks.current.length * 7);
    setChaosMeter(meter);
    if (meter >= 100 && !chaos) startChaos();
  }, [chaos, startChaos]);
  useInterval(() => setChaosMeter((m) => Math.max(0, m - 6)), 500, chaosMeter > 0 && !chaos);

  // ---------- finale ----------
  const runFinale = useCallback(() => {
    if (finale) return;
    setFinale(true);
    setModal(null);
    setDialogs([]);
    setDark(true);
    mMusic.stop();
    audio.play('whoosh');
    const steps: Array<[string | null, number]> = [['3', 1200], ['2', 2200], ['1', 3200], [null, 4200]];
    steps.forEach(([v, t]) =>
      window.setTimeout(() => {
        setCountdown(v);
        if (v) audio.play('countdown');
      }, t),
    );
    window.setTimeout(() => {
      setDark(false);
      setCountdown('GO');
      audio.play('explosion');
      audio.play('clink');
      fx.current?.confetti(STAGE_W / 2, 350, 220);
      fx.current?.rain('★', 50, '#ff3fa4');
      fx.current?.firework();
      fx.current?.firework();
      shake(800);
      audio.unlock();
      mMusic.playTrack('victory', () => mMusic.playTrack('main'));
      gs.set('voucherUnlocked', true);
      ach.unlock('whiskeyquest');
    }, 4300);
    window.setTimeout(() => {
      setCountdown(null);
      setFinale(false);
      setModal('voucher');
    }, 6200);
  }, [finale, audio, shake, gs, ach]);

  // ---------- boot ----------
  const onBoot = useCallback(() => {
    setBooted(true);
    gs.inc('booted');
    shake(900);
    fx.current?.confetti(STAGE_W / 2, 250, 200);
    window.setTimeout(() => {
      fx.current?.firework();
      fx.current?.firework();
      audio.play('firework');
    }, 500);
    window.setTimeout(() => audio.play('fanfare'), 900);
    window.setTimeout(() => {
      ach.unlock('level33');
      mMusic.playTrack('main');
    }, 1800);
    window.setTimeout(() => say(['Level 33 geladen. Willkommen im Pub.', 'Alles hier ist anklickbar. Die Quest zum Gutschein hängt am Kalender.'], 'System'), 2600);
  }, [gs, shake, audio, ach, say]);

  // ---------- intervals ----------
  useInterval(() => {
    if (Math.random() < 0.7) {
      const e = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      event(e);
      if (e.includes('SLOTH')) spawn('slothpaw');
      if (e.includes('CAT')) spawn('cat');
      if (e.includes('WHISKEY')) fx.current?.sparkle(940, 680, 20);
    }
  }, 45000, booted && visible);
  useInterval(() => Math.random() < 0.6 && spawn('bat'), 40000, booted && visible && effects && !reduced);
  useInterval(() => Math.random() < 0.5 && spawn('cat'), 75000, booted && visible && effects && !reduced);
  useInterval(() => god && fx.current?.sparkle(200 + Math.random() * 1100, 100 + Math.random() * 700, 6), 1500, booted && visible && god && effects);

  // ---------- keyboard ----------
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (e.key === KONAMI[pos] || e.key.toLowerCase() === KONAMI[pos]) {
        pos += 1;
        if (pos === KONAMI.length) {
          pos = 0;
          toggleGod();
        }
      } else pos = e.key === KONAMI[0] ? 1 : 0;
      if (e.key === 'Escape' && chaos) stopChaos();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleGod, chaos, stopChaos]);

  useEffect(() => {
    const onConcert = () => {
      audio.unlock();
      const wasPlaying = mMusic.playing;
      mMusic.playTrack('concert', () => (wasPlaying ? mMusic.playTrack('main') : mMusic.stop()));
      setMetal(true);
      window.setTimeout(() => setMetal(false), 3500);
    };
    window.addEventListener('michelle:concert', onConcert);
    return () => window.removeEventListener('michelle:concert', onConcert);
  }, [audio]);

  const api = useMemo<GameApi>(
    () => ({
      modal, openModal, closeModal, say, bubble, xpPopup, fx, shake, react, spawn, startMetal, startChaos, stopChaos, toggleGod, finale: runFinale, registerClick, event,
      flags: { metal, chaos, god, finale, booted },
      effects,
      chaosMeter,
    }),
    [modal, openModal, closeModal, say, bubble, xpPopup, shake, react, spawn, startMetal, startChaos, stopChaos, toggleGod, runFinale, registerClick, event, metal, chaos, god, finale, booted, effects, chaosMeter],
  );

  const modalBody = (kind: ModalKind) => {
    switch (kind) {
      case 'roulette': return <WhiskeyRoulette />;
      case 'bughunter': return <BugHunter />;
      case 'garden': return <Garden />;
      case 'kimchi': return <KimchiCombo />;
      case 'cocktail': return <CocktailMixer />;
      case 'atelier': return <Atelier />;
      case 'terminal': return <Terminal />;
      case 'achievements': return <AchievementsMenu />;
      case 'voucher': return <VoucherView />;
      case 'settings': return <SettingsMenu />;
      case 'help': return <HelpMenu />;
      default: return null;
    }
  };

  return (
    <GameCtx.Provider value={api}>
      <div className="no-print">
        <Stage>
          <div ref={stageRef} style={{ position: 'absolute', inset: 0 }}>
            <Scene
              effects={effects}
              reduced={reduced}
              questReady={gs.questReady && !gs.data.voucherUnlocked}
              bubbles={bubbles}
              xpPops={xpPops}
              sprites={sprites}
              removeSprite={removeSprite}
              reaction={reaction}
              metal={metal}
              chaos={chaos}
              god={god}
              shaking={shaking}
              dark={dark}
              partyHat={chaos}
            />
            <ParticleCanvas ref={fx} enabled={!reduced && effects} />
            <CursorTrail fx={fx} enabled={!reduced && effects && god && scale > 0.4} stageRef={stageRef} />
          </div>
        </Stage>
        {booted && <Hud />}
        <Toasts />
        {banner && <div className={`pxbox dark ${ui.banner}`} role="status">★ {banner} ★</div>}
        {dialogs.length > 0 && !modal && <DialogBox item={dialogs[dialogs.length - 1]} onDone={() => setDialogs((d) => d.slice(0, -1))} />}
        {metal && <div className={`${ov.modeText} ${ov.blegh}`}>BLEGH! LEVEL 33!</div>}
        {chaos && (
          <>
            <div className={`${ov.modeText} ${ov.chaosText}`}>WHAT COULD POSSIBLY GO WRONG?</div>
            {floatXp.map((f) => (
              <span key={f.key} className={ov.xpFloat} style={{ left: `${f.x}vw`, top: `${f.y}vh` }}>+33 XP</span>
            ))}
            <div className={ov.skip}>
              <PxButton variant="ghost" onClick={stopChaos}>Chaos überspringen (Esc)</PxButton>
            </div>
          </>
        )}
        {finale && (
          <div className={ov.finale} aria-live="assertive">
            {countdown && countdown !== 'GO' && <div key={countdown} className={ov.count}>{countdown}</div>}
            {countdown === 'GO' && <div className={ov.go}>LEVEL 33<br />REWARD UNLOCKED</div>}
          </div>
        )}
      </div>
      {modal && (
        <Modal title={MODAL_TITLES[modal]} onClose={closeModal} width={modal === 'voucher' ? 760 : modal === 'achievements' ? 640 : 720}>
          {modalBody(modal)}
        </Modal>
      )}
      {!booted && <Boot onStart={onBoot} />}
    </GameCtx.Provider>
  );
}
