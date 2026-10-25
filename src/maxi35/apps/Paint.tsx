import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useAudio } from '../../shared/audio/AudioContext';
import { readStorage, writeStorage } from '../../shared/hooks/useLocalStorage';
import { useStage } from '../../shared/stage/StageContext';
import styles from './Apps.module.css';

const PW = 48;
const PH = 32;
const SCALE = 8;
const PALETTE = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
const KEY = 'maxi35.paint';

export function Paint({ close }: AppComponentProps) {
  const ach = useAchievements();
  const audio = useAudio();
  const { scale } = useStage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useRef<string[]>(readStorage<string[]>(KEY, Array(PW * PH).fill('#ffffff')));
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const drawing = useRef(false);
  const touched = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  const redraw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    for (let i = 0; i < pixels.current.length; i++) {
      ctx.fillStyle = pixels.current[i];
      ctx.fillRect((i % PW) * SCALE, Math.floor(i / PW) * SCALE, SCALE, SCALE);
    }
  }, []);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const setPixel = (x: number, y: number, c: string) => {
    if (x < 0 || y < 0 || x >= PW || y >= PH) return;
    pixels.current[y * PW + x] = c;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = c;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  };

  const fill = (x: number, y: number, c: string) => {
    const target = pixels.current[y * PW + x];
    if (target === c) return;
    const stack = [[x, y]];
    while (stack.length) {
      const [px, py] = stack.pop()!;
      if (px < 0 || py < 0 || px >= PW || py >= PH) continue;
      if (pixels.current[py * PW + px] !== target) continue;
      pixels.current[py * PW + px] = c;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    redraw();
  };

  const coords = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: Math.floor((e.clientX - rect.left) / scale / SCALE), y: Math.floor((e.clientY - rect.top) / scale / SCALE) };
  };

  const paint = (e: React.PointerEvent) => {
    const { x, y } = coords(e);
    const c = tool === 'eraser' ? '#ffffff' : color;
    if (tool === 'fill') fill(x, y, c);
    else {
      // Interpolate so fast strokes stay continuous.
      const from = lastPt.current ?? { x, y };
      const steps = Math.max(Math.abs(x - from.x), Math.abs(y - from.y));
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        setPixel(Math.round(from.x + (x - from.x) * t), Math.round(from.y + (y - from.y) * t), c);
      }
      lastPt.current = { x, y };
    }
    if (!touched.current) {
      touched.current = true;
      ach.unlock('bobross');
    }
  };

  const save = () => {
    writeStorage(KEY, pixels.current);
    audio.play('info');
  };
  const clear = () => {
    pixels.current = Array(PW * PH).fill('#ffffff');
    redraw();
    audio.play('close');
  };

  return (
    <div className={styles.pane}>
      <div className={styles.paintTools}>
        <button className={`btn small ${tool === 'pen' ? 'pressed' : ''}`} onClick={() => setTool('pen')}>✏️ Stift</button>
        <button className={`btn small ${tool === 'eraser' ? 'pressed' : ''}`} onClick={() => setTool('eraser')}>🧽 Radierer</button>
        <button className={`btn small ${tool === 'fill' ? 'pressed' : ''}`} onClick={() => setTool('fill')}>🪣 Füllen</button>
        <button className="btn small" onClick={clear}>Neu</button>
        <button className="btn small" onClick={save}>💾 Speichern</button>
      </div>
      <div className={styles.row} style={{ alignItems: 'flex-start' }}>
        <div className={styles.palette} aria-label="Farbpalette">
          {PALETTE.map((c) => (
            <button key={c} className={`${styles.swatch} ${color === c ? styles.active : ''}`} style={{ background: c }} onClick={() => { setColor(c); setTool('pen'); }} aria-label={`Farbe ${c}`} />
          ))}
        </div>
        <div className="bevel-in" style={{ padding: 0, lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            width={PW * SCALE}
            height={PH * SCALE}
            className={styles.paintCanvas}
            onPointerDown={(e) => {
              drawing.current = true;
              lastPt.current = null;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              paint(e);
            }}
            onPointerMove={(e) => drawing.current && tool !== 'fill' && paint(e)}
            onPointerUp={() => {
              drawing.current = false;
              lastPt.current = null;
            }}
            onPointerCancel={() => {
              drawing.current = false;
              lastPt.current = null;
            }}
            aria-label="Zeichenfläche"
          />
        </div>
      </div>
      <div className={styles.row} style={{ justifyContent: 'space-between' }}>
        <span className={styles.muted}>Es gibt keine Fehler, nur glückliche Pixel. {PW}×{PH}</span>
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  );
}
