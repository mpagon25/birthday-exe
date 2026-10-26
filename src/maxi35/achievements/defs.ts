export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  secret?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'fellowship', title: 'The Fellowship of the Pint', description: 'Ein Guinness eingeschenkt.', hint: 'Irgendwo auf dem Tisch steht ein Pint.', icon: '🍺' },
  { id: 'natural20', title: 'Natural Twenty', description: 'Einen W20-Treffer gelandet.', hint: 'Würfel. Hoffe. Wiederhole.', icon: '🎲' },
  { id: 'whiterabbit', title: 'The White Rabbit', description: 'Das geheime Kaninchen-Easter-Egg gefunden.', hint: 'Follow the white rabbit.', icon: '🐰' },
  { id: 'whiskeywizard', title: 'Whiskey Wizard', description: 'Den Gutschein geöffnet.', hint: 'Geil!', icon: '🥃' },
  { id: 'rocksolid', title: 'Rock Solid', description: 'Das Boulder-Minigame geschafft.', hint: 'Die Wand rechts ist nicht nur Deko.', icon: '🧗' },
  { id: 'onemoreround', title: 'One More Round', description: 'Fünfmal angestoßen.', hint: 'Sláinte! Mehrfach.', icon: '🥂' },
  { id: 'curiosity', title: 'Curiosity Killed the Tab', description: 'Alle Desktop-Programme einmal geöffnet.', hint: 'Das Startmenü ist dein Freund.', icon: '🪟' },
  { id: 'reality', title: 'Reality.exe', description: 'Den psychedelischen Effekt aktiviert.', hint: 'Nicht jeder Pilz ist Deko.', icon: '🍄' },
  { id: 'party', title: 'Party Animal', description: 'Den Party Mode entdeckt.', hint: 'Geheimer Code oder hartnäckiges Klicken.', icon: '🎉', secret: true },
  { id: 'greywisdom', title: 'Wisdom of the Grey', description: 'Fünf Weisheiten des Zauberers gehört.', hint: 'Der alte Mann redet gern.', icon: '🧙' },
  { id: 'hydration', title: 'Hydration is Overrated', description: 'Zehn Pints eingeschenkt.', hint: 'Der Zähler in der Taskbar lügt nicht.', icon: '💧' },
  { id: 'savethedate', title: 'Save the Date', description: 'Den Kalender geöffnet.', hint: '21.11.', icon: '📅' },
  { id: 'bobross', title: 'Happy Little Pixels', description: 'In Paint.exe gekritzelt.', hint: 'Es gibt keine Fehler, nur glückliche Pixel.', icon: '🎨' },
  { id: 'tavernDJ', title: 'Tavern DJ', description: 'Das Tavern Radio angeworfen.', hint: 'Musik aus dem Startmenü.', icon: '📻' },
  { id: 'moo', title: 'Holy Cow', description: 'Mit der Kuh angestoßen.', hint: 'Sie trägt Sonnenbrille. Natürlich.', icon: '🐮' },
  { id: 'quizmaster', title: 'Quizmaster von Bruchtal', description: 'Mindestens 8 von 10 Fragen im Pub-Quiz richtig.', hint: 'Das Neon-Schild IRISH PUB stellt Fragen.', icon: '🧠' },
  { id: 'perfectpour', title: 'Perfect Pour', description: 'Drei perfekte Pints in einer Schicht gezapft.', hint: 'Das Guinness-Schild an der Wand.', icon: '🍺' },
  { id: 'dungeonmaster', title: 'Dungeon Master', description: 'Den Balrog der Bar besiegt.', hint: 'Der Zauberer hat eine Quest. Oder die Bücher.', icon: '🐉' },
  { id: 'pintsweeper', title: 'Pintsweeper', description: 'Ein Feld ohne verschüttetes Pint aufgedeckt.', hint: 'Ein Klassiker im Startmenü.', icon: '💣' },
  { id: 'herbalist', title: 'Herbalist', description: 'Alle Pflanzenpaare im Botanik-Memory gefunden.', hint: 'Plants make people happier.', icon: '🌱' },
  { id: 'lootgoblin', title: 'Loot Goblin', description: 'Alle acht Fundstücke gesammelt.', hint: 'Das Inventory zeigt, was fehlt.', icon: '🎒' },
  { id: 'secretfile', title: 'Dateiexplorer', description: 'SECRET.TXT gefunden und geöffnet.', hint: 'dir. Dann lesen.', icon: '📁', secret: true },
  { id: 'completionist', title: 'Level 35 Completionist', description: 'Alle Easter Eggs gefunden.', hint: 'Alles. Wirklich alles.', icon: '👑' },
];

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id);
