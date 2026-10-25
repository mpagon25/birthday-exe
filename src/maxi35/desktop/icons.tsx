/** Tiny pixel-style icon set. Names map to pixel sprites, inline SVG or emoji. */
import { hasPixelIcon, PixelIcon } from './PixelIcon';

const PIXEL_ALIAS: Record<string, string> = { game: 'gamepad', climb: 'chalkbag', book: 'books' };
const px = { shapeRendering: 'crispEdges' as const };

const svgIcons: Record<string, (s: number) => React.ReactElement> = {
  info: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <circle cx="8" cy="8" r="7.5" fill="#fff" stroke="#000" />
      <rect x="7" y="3" width="2" height="2" fill="#000080" />
      <rect x="7" y="6" width="2" height="7" fill="#000080" />
    </svg>
  ),
  warn: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <polygon points="8,1 15,15 1,15" fill="#ffff00" stroke="#000" />
      <rect x="7" y="5" width="2" height="6" fill="#000" />
      <rect x="7" y="12" width="2" height="2" fill="#000" />
    </svg>
  ),
  error: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <circle cx="8" cy="8" r="7.5" fill="#ff0000" stroke="#000" />
      <path d="M4 4 L12 12 M12 4 L4 12" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  ok: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <circle cx="8" cy="8" r="7.5" fill="#00a000" stroke="#000" />
      <path d="M4 8 L7 11 L12 5" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  ),
  question: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <circle cx="8" cy="8" r="7.5" fill="#fff" stroke="#000" />
      <text x="8" y="12.5" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#000080" fontFamily="Arial">?</text>
    </svg>
  ),
  computer: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <rect x="1" y="1" width="14" height="10" fill="#c0c0c0" stroke="#000" />
      <rect x="3" y="3" width="10" height="6" fill="#000080" />
      <rect x="5" y="12" width="6" height="2" fill="#808080" />
      <rect x="3" y="14" width="10" height="1" fill="#000" />
    </svg>
  ),
  ie: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="#1e90ff" strokeWidth="2" />
      <rect x="7" y="4" width="2" height="8" fill="#1e90ff" />
      <path d="M2 10 Q8 4 15 6" stroke="#ffd700" strokeWidth="2" fill="none" />
    </svg>
  ),
  window: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <rect x="1" y="2" width="14" height="12" fill="#fff" stroke="#000" />
      <rect x="1" y="2" width="14" height="3" fill="#000080" />
    </svg>
  ),
  folder: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <path d="M1 3 H6 L7 5 H15 V13 H1 Z" fill="#ffd700" stroke="#000" />
      <rect x="1" y="6" width="14" height="7" fill="#ffe866" stroke="#000" />
    </svg>
  ),
  paint: (s) => (
    <svg width={s} height={s} viewBox="0 0 16 16" style={px}>
      <rect x="1" y="1" width="14" height="14" fill="#fff" stroke="#000" />
      <rect x="3" y="3" width="4" height="4" fill="#ff0000" />
      <rect x="9" y="3" width="4" height="4" fill="#0000ff" />
      <rect x="3" y="9" width="4" height="4" fill="#00a000" />
      <rect x="9" y="9" width="4" height="4" fill="#ffff00" />
    </svg>
  ),
};

const emojiIcons: Record<string, string> = {
  trophy: '🏆',
  beer: '🍺',
  whiskey: '🥃',
  wizard: '🧙',
  rabbit: '🐰',
  dice: '🎲',
  climb: '🧗',
  calendar: '📅',
  radio: '📻',
  coffee: '☕',
  game: '🎮',
  clover: '🍀',
  mushroom: '🍄',
  heart: '❤️',
  book: '📖',
  pretzel: '🥨',
  mountain: '⛰️',
  plant: '🌿',
  film: '🎬',
  lotus: '🪷',
  moon: '🌙',
  leaf: '🍁',
  cat: '🐈',
  dog: '🐕',
  cow: '🐮',
  alien: '👽',
  fire: '🔥',
  star: '⭐',
  disco: '🪩',
  scroll: '📜',
  map: '🗺️',
  key: '🔑',
  speaker: '🔊',
  mute: '🔇',
  start: '🪟',
};

export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const pixelName = PIXEL_ALIAS[name] ?? name;
  if (hasPixelIcon(pixelName)) return <PixelIcon name={pixelName} size={size} />;
  const svg = svgIcons[name];
  if (svg) return <span style={{ display: 'inline-flex', width: size, height: size, flex: 'none' }}>{svg(size)}</span>;
  const emoji = emojiIcons[name] ?? name;
  return (
    <span
      aria-hidden
      style={{ display: 'inline-flex', width: size, height: size, flex: 'none', fontSize: size * 0.85, lineHeight: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      {emoji}
    </span>
  );
}
