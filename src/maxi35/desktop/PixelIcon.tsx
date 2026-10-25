import { useMemo } from 'react';
import { PALETTE, PIXEL_ICONS } from './pixelIcons';

interface Run {
  x: number;
  y: number;
  w: number;
  fill: string;
}

function toRuns(name: string): Run[] {
  const def = PIXEL_ICONS[name];
  if (!def) return [];
  const pal = { ...PALETTE, ...def.palette };
  const runs: Run[] = [];
  def.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.' || !pal[ch]) {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w += 1;
      runs.push({ x, y, w, fill: pal[ch] });
      x += w;
    }
  });
  return runs;
}

export function hasPixelIcon(name: string): boolean {
  return name in PIXEL_ICONS;
}

export function PixelIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const runs = useMemo(() => toRuns(name), [name]);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ shapeRendering: 'crispEdges', display: 'block', flex: 'none' }}
      aria-hidden
    >
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
