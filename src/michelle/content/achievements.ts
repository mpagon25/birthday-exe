import type { AchievementDef } from '../../shared/achievements/AchievementsContext';

export const M_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'level33', title: 'LEVEL 33 UNLOCKED', description: 'Spiel gestartet. Das war der leichte Teil.', hint: 'Press Start.', icon: 'star', xp: 33 },
  { id: 'catservant', title: 'CERTIFIED CAT SERVANT', description: 'Alle drei Katzen gestreichelt.', hint: 'Jede Katze. Auch die, die schläft.', icon: 'cat', xp: 50 },
  { id: 'whiskeywizard', title: 'WHISKEY WIZARD', description: 'Drei Runden Whiskey Roulette überstanden.', hint: 'Die Flaschen auf dem Tresen.', icon: 'whiskey', xp: 60 },
  { id: 'patience', title: 'PATIENCE IS A VIRTUE', description: 'Das Faultier hat fertig geladen.', hint: 'Klick. Warte. Warte länger.', icon: 'sloth', xp: 40 },
  { id: 'chaosengineer', title: 'SENIOR CHAOS ENGINEER', description: 'Mehr als 25 Punkte im Bug Hunter 33.', hint: 'Der Laptop. Schnelle Finger.', icon: 'bug', xp: 80 },
  { id: 'greenthumb', title: 'GREEN THUMB OF DOOM', description: 'Die LEGENDARY WHISKEY POTATO geerntet.', hint: 'Pflanzen, gießen, ernten, hoffen.', icon: 'potato', xp: 70 },
  { id: 'kimchimaster', title: 'KIMCHI MASTER', description: 'Kimchi Combo gewonnen.', hint: 'Die Schüssel auf dem Tisch.', icon: 'cabbage', xp: 60 },
  { id: 'cocktailchaos', title: 'COCKTAIL CHAOS', description: 'Den geheimen Spezialcocktail gemixt.', hint: 'Pink. Passion. Whiskey. Irgendwas davon.', icon: 'cocktail', xp: 50 },
  { id: 'blegh', title: 'BLEGH!', description: 'Metalcore Mode aktiviert.', hint: 'Das Poster an der Wand.', icon: 'horns', xp: 45 },
  { id: 'shiny', title: 'SHINY CRAFTSMANSHIP +100', description: 'Das Atelier entdeckt und ein Design gespeichert.', hint: 'Die glänzende Figur rechts.', icon: 'heel', xp: 40 },
  { id: 'miasanmia', title: 'MIA SAN MIA', description: 'Das kleinste Easter Egg der Welt gefunden.', hint: 'Rechts. Rot-weiß. Klein.', icon: 'ball', xp: 11 },
  { id: 'worldtraveler', title: 'WORLD TRAVELER', description: 'Dänemark und Spanien besucht.', hint: 'Die Wegweiser am Fenster.', icon: 'globe', xp: 40 },
  { id: 'whiskeyquest', title: 'WHISKEY QUEST COMPLETE', description: 'Den finalen Gutschein freigeschaltet.', hint: 'Drei kleine Aufgaben, dann der Kalender.', icon: 'ticket', xp: 333 },
  { id: 'nothingbetter', title: 'NOTHING BETTER TO DO', description: '33 Klicks auf das Geburtstagsschild. Respekt. Irgendwie.', hint: '???', icon: 'skull', secret: true, xp: 3 },
];
