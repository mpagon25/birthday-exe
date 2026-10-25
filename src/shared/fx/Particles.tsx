import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { STAGE_H, STAGE_W } from '../stage/constants';

type Kind = 'confetti' | 'clover' | 'spark' | 'beer' | 'rocket' | 'sparkle' | 'star';

interface Particle {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  text?: string;
}

export interface ParticleHandle {
  confetti: (x?: number, y?: number, count?: number) => void;
  cloverRain: (count?: number) => void;
  rain: (text: string, count?: number, color?: string) => void;
  firework: (x?: number, y?: number) => void;
  beerRise: (count?: number) => void;
  sparkle: (x: number, y: number, count?: number) => void;
  stars: (count?: number) => void;
  clear: () => void;
}

const COLORS = ['#ff2fd6', '#19f5ff', '#39ff14', '#ffd23f', '#ff5c5c', '#ffffff', '#b967ff'];

export const ParticleCanvas = forwardRef<ParticleHandle, { enabled: boolean }>(function ParticleCanvas({ enabled }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const last = useRef(0);
  const running = useRef(false);

  const loop = (now: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dt = Math.min(0.05, (now - last.current) / 1000 || 0.016);
    last.current = now;
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);
    const list = particles.current;
    const spawned: Particle[] = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.life += dt;
      if (p.life >= p.maxLife || p.y > STAGE_H + 40 || p.y < -80) {
        list.splice(i, 1);
        continue;
      }
      switch (p.kind) {
        case 'confetti':
          p.vy += 500 * dt;
          p.vx *= 0.99;
          break;
        case 'clover':
          p.vx = Math.sin(p.life * 3 + p.rot) * 40;
          break;
        case 'spark':
          p.vy += 260 * dt;
          p.vx *= 0.98;
          break;
        case 'rocket':
          p.vy += 60 * dt;
          if (p.vy > -60) {
            p.life = p.maxLife;
            for (let k = 0; k < 42; k++) {
              const ang = (Math.PI * 2 * k) / 42;
              const sp = 160 + Math.random() * 160;
              spawned.push({ kind: 'spark', x: p.x, y: p.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, maxLife: 1.2 + Math.random() * 0.6, size: 3, color: p.color, rot: 0, vr: 0 });
            }
          }
          break;
        case 'beer':
          p.vx = Math.sin(p.life * 2 + p.rot) * 30;
          break;
        default:
          break;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      const alpha = p.kind === 'sparkle' || p.kind === 'spark' ? 1 - p.life / p.maxLife : Math.min(1, (p.maxLife - p.life) / 0.6);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = p.color;
      if (p.kind === 'confetti') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else if (p.kind === 'spark' || p.kind === 'rocket') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (p.kind === 'sparkle' || p.kind === 'star') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const s = p.size * (p.kind === 'star' ? 1 : 1 - p.life / p.maxLife);
        ctx.fillRect(-s / 2, -s / 6, s, s / 3);
        ctx.fillRect(-s / 6, -s / 2, s / 3, s);
        ctx.restore();
      } else if (p.text) {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    list.push(...spawned);
    if (list.length > 0 && document.visibilityState !== 'hidden') {
      raf.current = requestAnimationFrame(loop);
    } else {
      running.current = false;
      ctx.clearRect(0, 0, STAGE_W, STAGE_H);
    }
  };

  const ensureRunning = () => {
    if (running.current) return;
    running.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(loop);
  };

  const add = (ps: Particle[]) => {
    if (!enabled) return;
    const list = particles.current;
    list.push(...ps);
    if (list.length > 1500) list.splice(0, list.length - 1500);
    ensureRunning();
  };

  useImperativeHandle(
    ref,
    () => ({
      confetti: (x = STAGE_W / 2, y = STAGE_H / 3, count = 120) =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'confetti' as Kind,
            x,
            y,
            vx: (Math.random() - 0.5) * 700,
            vy: -Math.random() * 500 - 100,
            life: 0,
            maxLife: 2.5 + Math.random() * 1.5,
            size: 8 + Math.random() * 8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 12,
          })),
        ),
      cloverRain: (count = 40) =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'clover' as Kind,
            x: Math.random() * STAGE_W,
            y: -40 - Math.random() * 600,
            vx: 0,
            vy: 90 + Math.random() * 90,
            life: 0,
            maxLife: 10,
            size: 18 + Math.random() * 18,
            color: '#39ff14',
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 2,
            text: Math.random() < 0.3 ? '🍀' : '☘️',
          })),
        ),
      rain: (text, count = 30, color = '#ff3fa4') =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'clover' as Kind,
            x: Math.random() * STAGE_W,
            y: -40 - Math.random() * 500,
            vx: 0,
            vy: 100 + Math.random() * 120,
            life: 0,
            maxLife: 9,
            size: 20 + Math.random() * 16,
            color,
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 2,
            text,
          })),
        ),
      firework: (x = 200 + Math.random() * (STAGE_W - 400), y = 150 + Math.random() * 250) =>
        add([
          {
            kind: 'rocket',
            x,
            y: STAGE_H - 60,
            vx: (Math.random() - 0.5) * 40,
            vy: -Math.sqrt(2 * 60 * (STAGE_H - 60 - y)) - 60,
            life: 0,
            maxLife: 6,
            size: 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: 0,
            vr: 0,
          },
        ]),
      beerRise: (count = 12) =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'beer' as Kind,
            x: 100 + Math.random() * (STAGE_W - 200),
            y: STAGE_H + Math.random() * 300,
            vx: 0,
            vy: -120 - Math.random() * 120,
            life: 0,
            maxLife: 12,
            size: 32 + Math.random() * 24,
            color: '#fff',
            rot: Math.random() * 6,
            vr: 0,
            text: Math.random() < 0.5 ? '🍺' : '🥃',
          })),
        ),
      sparkle: (x, y, count = 6) =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'sparkle' as Kind,
            x: x + (Math.random() - 0.5) * 24,
            y: y + (Math.random() - 0.5) * 24,
            vx: (Math.random() - 0.5) * 40,
            vy: -20 - Math.random() * 40,
            life: 0,
            maxLife: 0.5 + Math.random() * 0.5,
            size: 8 + Math.random() * 10,
            color: Math.random() < 0.5 ? '#ffffff' : '#ffd23f',
            rot: Math.random() * Math.PI,
            vr: 4,
          })),
        ),
      stars: (count = 30) =>
        add(
          Array.from({ length: count }, () => ({
            kind: 'star' as Kind,
            x: Math.random() * STAGE_W,
            y: Math.random() * STAGE_H,
            vx: (Math.random() - 0.5) * 60,
            vy: (Math.random() - 0.5) * 60,
            life: 0,
            maxLife: 3 + Math.random() * 3,
            size: 10 + Math.random() * 20,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: 0,
            vr: 2 + Math.random() * 4,
          })),
        ),
      clear: () => {
        particles.current.length = 0;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled],
  );

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'hidden' && particles.current.length > 0) ensureRunning();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={STAGE_W}
      height={STAGE_H}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8000 }}
      aria-hidden
    />
  );
});
