import { useMemo } from 'react';
import { SPRITES, SPRITE_PALETTE } from './pixelArt';

interface Run {
  x: number;
  y: number;
  w: number;
  fill: string;
}

export function spriteSize(name: string): { w: number; h: number } {
  const def = SPRITES[name];
  if (!def) return { w: 8, h: 8 };
  return { w: Math.max(...def.rows.map((r) => [...r].length)), h: def.rows.length };
}

function toRuns(name: string): Run[] {
  const def = SPRITES[name];
  if (!def) return [];
  const pal = { ...SPRITE_PALETTE, ...def.palette };
  const runs: Run[] = [];
  def.rows.forEach((row, y) => {
    const chars = [...row];
    let x = 0;
    while (x < chars.length) {
      const ch = chars[x];
      if (ch === '.' || !pal[ch]) {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < chars.length && chars[x + w] === ch) w += 1;
      runs.push({ x, y, w, fill: pal[ch] });
      x += w;
    }
  });
  return runs;
}

/** Renders a pixel sprite scaled by `scale` (device pixels per sprite pixel). */
export function Sprite({ name, scale = 4, className, style }: { name: string; scale?: number; className?: string; style?: React.CSSProperties }) {
  const runs = useMemo(() => toRuns(name), [name]);
  const { w, h } = spriteSize(name);
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{ shapeRendering: 'crispEdges', display: 'block', ...style }}
      aria-hidden
    >
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
