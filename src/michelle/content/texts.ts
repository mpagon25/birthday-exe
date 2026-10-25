export const BOOT_LINES: Array<{ text: string; kind?: 'ok' | 'error' | 'warn' | 'big' }> = [
  { text: 'INITIALIZING MICHELLE.EXE...' },
  { text: 'LOADING PERSONALITY... 100%', kind: 'ok' },
  { text: 'LOADING CATS... 237%', kind: 'ok' },
  { text: 'LOADING METALCORE... 666%', kind: 'ok' },
  { text: 'LOADING WHISKEY... ERROR: NOT ENOUGH WHISKEY', kind: 'error' },
  { text: 'LOADING SLOTH... (still loading)', kind: 'warn' },
  { text: 'ACTIVATING BIRTHDAY MODE...' },
  { text: 'LEVEL 33 UNLOCKED!', kind: 'big' },
];

export const MICHELLE_LINES = [
  'Mit 33 bin ich nicht alt. Ich bin Legendary.',
  'Mein Social Battery Status: 3%.',
  'Whiskey ist auch nur ein sehr ambitionierter Heiltrank.',
  'Achievement unlocked: Existiert seit 33 Jahren.',
  'Ich wollte eigentlich nur meine Ruhe und eine Katze.',
  'Ist das ein Bug oder schon ein Feature?',
  'Meine Leber hat den Schwierigkeitsgrad erhöht.',
  'Breakdown incoming. Nein, musikalisch.',
  'Mein Build läuft. Mein Schlafrhythmus nicht.',
  'Katzen: 3. Social Battery: 0. Whiskey: ja.',
  'Level 33. Patch Notes: mehr Katzen, weniger Geduld.',
  'Headset auf, Welt aus. Ausnahme: Whiskey.',
  'Ich bin nicht genervt. Das ist mein Ruhegesicht. Level 33 Edition.',
];

export const ROULETTE_RESULTS: Array<{ text: string; xp: number }> = [
  { text: 'Tastes like responsible adulthood. Disgusting.', xp: 10 },
  { text: '+20 Wisdom, -15 Coordination', xp: 20 },
  { text: 'Legendary Drop: Liquid Courage', xp: 33 },
  { text: 'Smoky. Fancy. Financially Questionable.', xp: 15 },
  { text: 'Critical Hit: Scottish Peat Damage', xp: 25 },
  { text: 'Notes of oak, smoke and „ich hab morgen frei“.', xp: 12 },
  { text: 'Rare Drop: eine Meinung über Torf.', xp: 18 },
  { text: '+1 Charisma, +3 Lautstärke.', xp: 14 },
];

export const CAT_LINES = [
  'Miau. Übersetzung: Füttern. Jetzt.',
  'Die Katze erlaubt dir, weiterzuleben.',
  'Purr-Level: 100%. Social Battery +5%.',
  'Katze hat dich als Möbelstück akzeptiert.',
  'Schnurren detected. Chaos-Meter +3.',
  'Die Katze hat deinen Whiskey inspiziert. Freigegeben.',
  'Mrrp. (Das war ein Kompliment.)',
];

export const CATS: Array<{ id: string; name: string; x: number; y: number; w: number; h: number }> = [
  { id: 'grey', name: 'Graue Katze (schläft)', x: 55, y: 490, w: 110, h: 80 },
  { id: 'lap', name: 'Schwarze Katze (auf dem Schoß)', x: 175, y: 515, w: 95, h: 100 },
  { id: 'right', name: 'Schwarze Katze (am Beet)', x: 1295, y: 295, w: 110, h: 130 },
];

export const SLOTH_STEPS = ['...', 'Processing...', 'Still processing...', 'Achievement unlocked: PATIENCE IS A VIRTUE.'];
export const SLOTH_RUSH = 'STOP RUSHING ME.';

export const RANDOM_EVENTS = [
  'A WILD SLOTH APPEARED',
  'CAT HAS ENTERED THE CHAT',
  'CRITICAL WHISKEY HIT',
  'PUB SERVER IS EXPERIENCING TOO MUCH FUN',
  'NEW SIDE QUEST AVAILABLE: TOUCH GRASS',
  'SLOTH IS STILL LOADING',
  'WHISKEY GLASS RESPAWNED',
  'SOCIAL BATTERY: 2% (CRITICAL)',
];

export const DEV_LINES = [
  'console.log("Age is just a number");',
  'WARNING: Too many cats detected',
  'ERROR 33: Youth not found',
  'PATCH NOTES: Michelle v33.0',
  'Fixed: Absolutely nothing',
  'Added: More whiskey',
  'Deprecated: Sleeping before 2 AM',
  'Known issue: Social battery drains in multiplayer',
];

export const COCKTAIL_INGREDIENTS = [
  { id: 'whiskey', label: 'Whiskey', icon: 'whiskey' },
  { id: 'rum', label: 'Rum', icon: 'rum' },
  { id: 'passion', label: 'Passionsfrucht', icon: 'passion' },
  { id: 'pineapple', label: 'Ananas', icon: 'pineapple' },
  { id: 'coconut', label: 'Kokos', icon: 'coconut' },
  { id: 'grapefruit', label: 'Pink Grapefruit', icon: 'grapefruit' },
  { id: 'lime', label: 'Limette', icon: 'lime' },
  { id: 'cola', label: 'Cola', icon: 'cola' },
  { id: 'cathair', label: 'Katzenhaar', icon: 'cathair' },
];

export const COCKTAIL_NAMES = [
  'Pink Pixel Panic',
  'Sloth on the Beach',
  'Critical Daiquiri',
  'The 33rd Mistake',
  'Mana Colada',
  'Ctrl+Alt+Daiquiri',
  'Social Battery Spritz',
  "Headbanger's Highball",
  '404 Mojito Not Found',
  'Purr-fect Storm',
  'Breakdown Breeze',
];

export const COCKTAIL_SECRET = ['whiskey', 'passion', 'grapefruit'];
export const COCKTAIL_SLOTH = ['rum', 'pineapple', 'coconut'];

export const CROPS: Array<{ id: string; name: string; icon: string; weight: number; legendary?: boolean }> = [
  { id: 'carrot', name: 'Karotte', icon: 'carrot', weight: 30 },
  { id: 'tomato', name: 'Tomate', icon: 'tomato', weight: 30 },
  { id: 'pumpkin', name: 'Kürbis', icon: 'pumpkin', weight: 20 },
  { id: 'pink', name: 'Mysteriöse pinke Pflanze', icon: 'pinkplant', weight: 15 },
  { id: 'potato', name: 'LEGENDARY WHISKEY POTATO', icon: 'potato', weight: 5, legendary: true },
];

export const KIMCHI_GOOD = [
  { id: 'cabbage', label: 'Chinakohl', icon: 'cabbage' },
  { id: 'chili', label: 'Chili', icon: 'chili' },
  { id: 'garlic', label: 'Knoblauch', icon: 'garlic' },
  { id: 'ginger', label: 'Ingwer', icon: 'ginger' },
  { id: 'onion', label: 'Frühlingszwiebel', icon: 'onion' },
];
export const KIMCHI_BAD = [
  { id: 'donut', label: 'Donut', icon: 'donut', comment: 'Donut im Kimchi. Die Ahnen weinen.' },
  { id: 'sock', label: 'Socke', icon: 'sock', comment: 'Socke erkannt. Rezept abgelehnt.' },
  { id: 'choco', label: 'Schokolade', icon: 'choco', comment: 'Spice Level: Emotional Damage.' },
  { id: 'keyboard', label: 'Tastatur', icon: 'keyboard', comment: 'Das ist kein Kimchi. Das ist ein Hilferuf.' },
];

export const BUG_RATINGS = (score: number): string =>
  score <= 10 ? "It's not a bug. It's a feature." : score <= 25 ? 'Junior Bug Exterminator' : 'SENIOR CHAOS ENGINEER';

export const ATELIER = {
  materials: ['Latex glänzend', 'Latex matt', 'Vinyl', 'Leder'],
  colors: [
    { id: 'black', label: 'Tiefschwarz', a: '#0a0a0a', b: '#2a2a2a' },
    { id: 'pink', label: 'Neonpink', a: '#ff3fa4', b: '#ff7fc3' },
    { id: 'duo', label: 'Schwarz-Pink', a: '#0a0a0a', b: '#ff3fa4' },
    { id: 'wine', label: 'Weinrot', a: '#5a0f2a', b: '#8a1f45' },
  ],
  finishes: ['Hochglanz', 'Satin', 'Chrome', 'Matt'],
};

export const VOUCHER = {
  quest: 'QUEST COMPLETED!',
  reward: 'LEVEL 33 REWARD UNLOCKED',
  title: 'GUTSCHEIN FÜR EIN WHISKEYTASTING',
  date: '21.11.',
  tagline: 'GOOD WHISKEY. GREAT COMPANY. QUESTIONABLE DECISIONS.',
  wish: 'HAPPY BIRTHDAY, MICHELLE!',
};

export const HELP_LINES = [
  'Alles im Pub ist anklickbar. Wirklich alles.',
  'Quest zum Gutschein: Whiskey-Roulette spielen, eine Katze streicheln, das Faultier geduldig anklicken.',
  'Dann leuchtet am Kalender ein Ausrufezeichen.',
  'Untere Leiste: Faultier, Bug Hunter, Katzen, Beet, Kimchi, Reisen, Pool, Cocktails, Atelier, Gutschein.',
  'Der leere Slot ganz rechts ist nicht leer.',
  'Esc schließt Fenster. Pfeiltasten steuern Kimchi Combo.',
];
