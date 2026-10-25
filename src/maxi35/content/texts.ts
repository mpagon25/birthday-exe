export const BOOT_LINES = [
  'MAXI35.EXE',
  'Initializing birthday protocol...',
  'Loading whiskey.dll',
  'Loading pint_of_guinness.exe',
  'Mounting middle_earth.iso',
  'Installing Bavarian DLC... +10 Brezn, +20 Biergarten',
  'Checking liver integrity... WARNING',
  'Coffee dependency: Running in background',
  'Calibrating d20... natural twenties enabled',
  'Unlocking LEVEL 35...',
];

export const TASKBAR_MESSAGES = [
  'Nächster Halt: Mehr Abenteuer ...',
  'Quest accepted: One more round.',
  'Loading next pint... 87%',
  'Warning: Too many open tabs in life.',
  'Respawn Location: Irish Pub',
  'Coffee dependency: Running in background.',
  'Bavarian DLC installed: +10 Brezn, +20 Biergarten.',
  'Quest Log Updated: The Fellowship of the Pint.',
  'Defragmenting memories of 34...',
  'Searching for the one ring... 404',
  'Downloading motivation.zip... 2%',
  'May your rolls be natural twenties.',
  'One does not simply drink just one pint.',
  'Patch notes v35.0: More wisdom, same chaos.',
  'Watering plants.exe ... 100%',
  'Sláinte! (Pronunciation still loading)',
];

export const RANDOM_NOTIFICATIONS: Array<{ title: string; text: string; icon: 'info' | 'warn' | 'error' | 'ok' }> = [
  { title: 'Systemmeldung', text: '404: Verantwortungsbewusstsein not found.', icon: 'error' },
  { title: 'Quest Log', text: 'Quest Log Updated: The Fellowship of the Pint.', icon: 'info' },
  { title: 'Warnung', text: 'Warning: Too many open tabs in life.', icon: 'warn' },
  { title: 'Update', text: 'Bavarian DLC installed: +10 Brezn, +20 Biergarten.', icon: 'ok' },
  { title: 'Hintergrundprozess', text: 'Coffee dependency: Running in background.', icon: 'info' },
  { title: 'Weisheit des Tages', text: 'One does not simply drink just one pint.', icon: 'info' },
  { title: 'Respawn', text: 'Respawn Location: Irish Pub. Checkpoint gespeichert.', icon: 'ok' },
  { title: 'Botanik', text: 'Die Pflanzen wurden gegossen. Die Pflanzen sind zufrieden.', icon: 'ok' },
  { title: 'Kalender', text: 'Erinnerung: 21.11. – A legendary date.', icon: 'info' },
  { title: 'Anime-Modus', text: 'Opening übersprungen. Du Monster.', icon: 'warn' },
  { title: 'Game Night', text: 'Spielabend-Regel Nr. 1: Der Erklärbär hat immer recht.', icon: 'info' },
  { title: 'Serienmarathon', text: 'Noch eine Folge? [Ja] [Ja]', icon: 'question' as 'info' },
];

export const WIZARD_WISDOM = [
  'Ein Zauberer kommt nie zu spät. Er erscheint genau dann, wenn das nächste Bier kommt.',
  'Du sollst nicht passieren! ... ohne einen Dram zu probieren.',
  'Level 35. Die Quest wird schwieriger, aber die Tavernen werden besser.',
  'Alles, was wir entscheiden müssen, ist, was wir mit der Zeit anfangen, die uns gegeben ist. Ich empfehle: Whiskey.',
  'Selbst der kleinste Hobbit kann den Lauf der Zukunft verändern. Besonders beim Brettspielabend.',
  'Nicht alle, die umherwandern, sind verloren. Manche suchen nur die Toilette im Pub.',
  'Ein Dram am Tag hält den Balrog fern. Zwei Drams halten auch die Vernunft fern.',
  'Der Weg nach Mordor ist lang. Der Weg zur Bar ist kurz. Wähle weise.',
  'Mein Bart ist weiß, mein Glas ist voll, und mein Build ist seit 1998 nicht mehr kompiliert.',
  'Hüte dich vor dem Kaffee der Elben. Er ist stark, aber er hält bis Dienstag.',
  'Die Brezn ist der Lembas des Südens. Ein Bissen stillt den Hunger eines ganzen Mannes. Zwei Bissen machen durstig.',
  'Ich habe 2019 Jahre gelebt und sage dir: Ein Natural 20 fühlt sich immer gleich gut an.',
];

export const DICE_RESULTS = {
  nat1: 'Du verschüttest dein Guinness. Critical Failure.',
  low: 'Der Barkeeper schaut dich skeptisch an.',
  mid: 'Du erhältst +2 Charisma für den Abend.',
  nat20: 'LEGENDARY WHISKEY DROP!',
};

export const PINT_MESSAGES: Record<number, { title: string; text: string }> = {
  3: { title: 'Achievement', text: 'Achievement unlocked: Hydration is overrated' },
  5: { title: 'Fehler 418', text: "Error 418: I'm a teapot. But I'd rather be a pint." },
  7: { title: 'Hinweis', text: 'One does not simply drink just one pint.' },
  10: { title: 'Warnung', text: 'Liver.exe meldet: Resistance to another dram: UNKNOWN.' },
  15: { title: 'Systemmeldung', text: 'Respawn Location: Irish Pub. Tschüss, Gleichgewicht.' },
  20: { title: 'Legendär', text: 'Pint Nr. 20. Der Barkeeper hat jetzt deinen Namen tätowiert.' },
};

export const TOAST_LINES = [
  'Sláinte!',
  'Prost!',
  'Auf die nächsten 35!',
  'Cheers to Level 35!',
  'Auf gute Freunde!',
  'Oans, zwoa, gsuffa!',
  'May your rolls be natural twenties!',
];

export const ICONBAR_TIPS: Record<string, string> = {
  clover: 'Glück.exe – Kleeblatt-Regen',
  beer: 'Pint einschenken',
  film: 'Filme.exe – Popcorn wird geladen',
  game: 'GameNight.exe',
  dice: 'W20 werfen',
  mountain: 'Bouldern.exe',
  plant: 'Botanik.exe',
  coffee: 'Kaffee_irl.exe',
  pretzel: 'Bavarian DLC',
  lotus: 'Reality.exe',
  moon: 'Nachtmodus (ist schon Nacht)',
  leaf: '420.exe',
  heart: 'Der Gutschein',
};

export const INVENTORY_ITEMS: Array<{ icon: string; name: string; desc: string; rarity: 'common' | 'rare' | 'epic' | 'legendary' }> = [
  { icon: 'beer', name: 'Bierkrug', desc: '+5 Stimmung. Stapelbar bis 99. Realistisch: 4.', rarity: 'common' },
  { icon: 'whiskey', name: 'Whiskeyflasche', desc: 'Aromen: Torf, Eiche, interessante Geschichten.', rarity: 'epic' },
  { icon: 'dice', name: 'W20', desc: 'Natural 20 garantiert*. (*Nicht garantiert.)', rarity: 'rare' },
  { icon: 'pretzel', name: 'Brezn', desc: 'Bavarian DLC Item. Heilt 20 HP und Heimweh.', rarity: 'common' },
  { icon: 'coffee', name: 'Kaffeetasse', desc: 'Coffee dependency: Running in background.', rarity: 'legendary' },
  { icon: 'pipe', name: 'Pfeife des Zauberers', desc: 'Erzeugt Rauchringe und Weisheiten. Beides optional.', rarity: 'epic' },
  { icon: 'books', name: 'Band I–III', desc: 'Schwer. Episch. Wurde dreimal gelesen und viermal verliehen.', rarity: 'rare' },
  { icon: 'chalkbag', name: 'Chalkbag', desc: 'Grip Strength +10. Haut an den Fingern -10.', rarity: 'common' },
  { icon: 'mushroom', name: 'Verdächtiger Pilz', desc: 'Reality.exe has stopped responding. Nur im Bild. Ehrlich.', rarity: 'legendary' },
  { icon: 'gamepad', name: 'Retro-Controller', desc: 'Leicht klebrig. Funktioniert trotzdem.', rarity: 'common' },
  { icon: 'potplant', name: 'Zimmerpflanze #47', desc: 'Lebt noch. Das ist ein Achievement.', rarity: 'rare' },
  { icon: 'clover', name: 'Vierblättriges Kleeblatt', desc: '+1 Glück. Wirkt besonders im Pub.', rarity: 'epic' },
  { icon: 'map', name: 'Karte des Nebelgebirges', desc: 'Berge. Touren. Mindestens eine Hütte mit Bier.', rarity: 'rare' },
  { icon: 'key', name: 'Schlüssel zum Rabbit Hole', desc: 'Follow the white rabbit.', rarity: 'legendary' },
  { icon: 'floppy', name: 'Diskette "ideen.zip"', desc: 'Kreativprojekte, 1.44 MB, 97% belegt.', rarity: 'common' },
  { icon: 'ticket', name: 'Whiskeytasting-Gutschein', desc: 'Siehe Fenster unten rechts. Oder Herz-Icon.', rarity: 'legendary' },
];

export const RABBIT_HOLE_SECRET = [
  'Du bist dem weißen Kaninchen gefolgt.',
  'Hier unten gibt es: kein Signal, aber gutes Bier.',
  'Geheimer Cheat-Code: ↑ ↑ ↓ ↓ ← → ← → B A',
  'Er aktiviert den Party Mode. Du hast es nicht von mir.',
];

export const CALENDAR_LINES = [
  '21.11. – A legendary date',
  'Status: im Kalender eingetragen',
  'Quest: Whiskeytasting',
  'Teilnehmer: du + gute Gesellschaft',
  'Vorbereitung: Durst mitbringen',
];

export const BSOD_TEXT = `Ein fataler Ausnahmefehler 0x35 ist in MAXI35.EXE aufgetreten.
Das aktuelle Lebensjahr wird beendet.

* Drücken Sie eine beliebige Taste, um Level 35 fortzusetzen.
* Drücken Sie STRG+ALT+ENTF, um nochmal 34 zu werden.
  Das funktioniert nicht. Niemand weiß warum.

Drücken Sie eine beliebige Taste, um fortzufahren _`;

/* ---------- PubQuiz.exe ---------- */
export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  comment: string;
}
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q: 'Der wichtigste Gegenstand in jedem Fantasy-Inventar?', options: ['Heiltrank', 'Brezn', 'Ein unerklärlich schwerer Stein', '47 Lederstreifen'], correct: 1, comment: 'Brezn. Heilt 20 HP und Heimweh.' },
  { q: 'Ein Zauberer kommt...', options: ['nie zu spät', 'immer zu früh', 'nur mit Whiskey', 'per Postkutsche'], correct: 0, comment: 'Er erscheint genau dann, wenn das nächste Bier kommt.' },
  { q: 'Wie viele Pints sind ein Pint zu viel?', options: ['Eins', 'Drei', 'Das nächste', 'Keins'], correct: 2, comment: 'Das nächste. Immer das nächste.' },
  { q: 'Natural 20 beim Bouldern bedeutet:', options: ['Top erreicht', 'Hautfetzen', 'Beides', 'Crashpad vergessen'], correct: 2, comment: 'Beides. Grip Strength +10, Haut -10.' },
  { q: 'Was sagt der Barkeeper bei „Noch eins“?', options: ['Natürlich', 'Nein', 'Die Küche hat zu', 'Sláinte'], correct: 3, comment: 'Sláinte. Alles andere wäre unhöflich.' },
  { q: 'Welche Klasse spielt die Katze?', options: ['Schurke', 'Barde', 'Möbelstück', 'Endboss'], correct: 3, comment: 'Endboss. Mit Schlafresistenz.' },
  { q: 'Lembas oder Brezn?', options: ['Lembas', 'Brezn', 'Ja', 'Beides, mit Obazda'], correct: 3, comment: 'Bavarian DLC installed.' },
  { q: 'Der Weg nach Mordor führt...', options: ['über die Berge', 'durch Moria', 'über die Bar', 'entlang eines Wanderwegs mit Hütte'], correct: 2, comment: 'One does not simply walk past the bar.' },
  { q: 'Der beste Whiskey ist...', options: ['der torfige', 'der milde', 'der aus dem Sherry-Fass', 'der, den jemand anderes bezahlt'], correct: 3, comment: 'Whiskey Knowledge: 12%. Lebensweisheit: 100%.' },
  { q: 'Game Night, Regel Nr. 1:', options: ['Der Erklärbär hat immer recht', 'Keine Snacks am Tisch', 'Mit beiden Händen würfeln', 'Nicht weinen'], correct: 0, comment: 'Regel Nr. 2: Siehe Regel Nr. 1.' },
  { q: 'Was passiert bei Error 418?', options: ['Teekanne', 'Pint', 'Neustart', 'BSOD'], correct: 0, comment: "I'm a teapot. But I'd rather be a pint." },
  { q: 'Wie viele offene Tabs sind zu viele?', options: ['10', '50', 'Alle', 'Die Frage ist falsch gestellt'], correct: 3, comment: 'Warning: Too many open tabs in life.' },
];
export const QUIZ_RATING = (correct: number, total: number): string =>
  correct === total ? 'Quizmaster von Bruchtal' : correct >= total * 0.7 ? 'Ehrenmitglied der Fellowship of the Pint' : correct >= total * 0.4 ? 'Lehrling des Barkeepers' : 'Respawn Location: Irish Pub';

/* ---------- Dungeon.exe ---------- */
export type Stat = 'STR' | 'CHA' | 'LUCK';
export interface DungeonChoice {
  label: string;
  stat?: Stat;
  dc?: number;
  costGold?: number;
  success: { text: string; hp?: number; gold?: number; item?: string };
  fail?: { text: string; hp?: number; gold?: number };
}
export interface DungeonRoom {
  id: string;
  title: string;
  text: string;
  choices: DungeonChoice[];
}
export const DUNGEON_ROOMS: DungeonRoom[] = [
  {
    id: 'bridge',
    title: 'Die Brücke von Khazad-Bar',
    text: 'Ein Troll versperrt die Brücke. Er riecht nach altem Kilkenny und verlangt Maut.',
    choices: [
      { label: '5 Gold zahlen', costGold: 5, success: { text: 'Der Troll nickt. „Angenehmen Abend.“ Höflicher Troll.', gold: -5 } },
      { label: 'Überreden (CHA)', stat: 'CHA', dc: 12, success: { text: 'Du erzählst ihm von der Happy Hour. Er lässt dich durch und folgt dir fast.', gold: 2 }, fail: { text: 'Der Troll lacht. Dann schubst er dich. Ins Wasser.', hp: -3 } },
      { label: 'Angreifen (STR)', stat: 'STR', dc: 14, success: { text: 'Kritischer Treffer mit dem Maßkrug. Der Troll geht schlafen.', gold: 6, item: 'Trollzahn' }, fail: { text: 'Der Troll pariert mit einem Tisch. Autsch.', hp: -4 } },
    ],
  },
  {
    id: 'gollum',
    title: 'Gollums Kammer',
    text: 'Eine bleiche Gestalt schleicht heran. „Mein Schatz...“, zischt sie und starrt auf deine Brezn.',
    choices: [
      { label: 'Brezn teilen', success: { text: 'Gollum ist gerührt. Er zeigt dir einen Geheimgang und 4 Gold.', gold: 4 } },
      { label: 'Rätselwettstreit (LUCK)', stat: 'LUCK', dc: 11, success: { text: '„Was hat Hopfen und ist nie allein?“ Gollum gibt auf. Du bekommst seinen Ring.', item: 'Ein Ring (nicht DER Ring)' }, fail: { text: 'Du verlierst beim Rätsel um die Brezn. Hunger.', hp: -2 } },
      { label: 'Weglaufen', success: { text: 'Du rennst. Gollum ruft dir Beleidigungen nach. Kreative Beleidigungen.' } },
    ],
  },
  {
    id: 'tavern',
    title: 'Die Taverne der Zwei Türme',
    text: 'Ein Zwischenstopp. Der Wirt poliert ein Glas, das schon sauber ist.',
    choices: [
      { label: 'Ein Pint (1 Gold, +2 HP)', costGold: 1, success: { text: 'Guinness. Dunkel, cremig, heilend. Wissenschaftlich belegt.', hp: 2, gold: -1 } },
      { label: 'Würfeln um Gold (LUCK)', stat: 'LUCK', dc: 11, success: { text: 'Natural Win. Die Zwerge am Nebentisch zahlen zähneknirschend.', gold: 7 }, fail: { text: 'Die Zwerge hatten gezinkte Würfel. Natürlich.', gold: -3 } },
      { label: 'Weiterziehen', success: { text: 'Keine Zeit für Pints. Mutig. Fragwürdig.' } },
    ],
  },
  {
    id: 'shrooms',
    title: 'Der Pilzwald',
    text: 'Zwischen den Bäumen leuchten Pilze in Farben, die es nicht geben sollte.',
    choices: [
      { label: 'Pilz probieren (LUCK)', stat: 'LUCK', dc: 13, success: { text: 'Heilpilz! Du siehst kurz die Matrix, dann geht es dir prächtig.', hp: 4, item: 'Leuchtpilz' }, fail: { text: 'Reality.exe has stopped responding. Du wachst mit Kopfweh auf.', hp: -3 } },
      { label: 'Pilze sammeln', success: { text: 'Du sammelst, ohne zu essen. Verantwortungsbewusstsein found.', gold: 3 } },
      { label: 'Vorsichtig umgehen', success: { text: 'Botanik mit Sicherheitsabstand. Die Pilze winken dir zu. Vermutlich.' } },
    ],
  },
  {
    id: 'wall',
    title: 'Die Boulderwand des Schicksals',
    text: 'Eine senkrechte Wand mit bunten Griffen. Oben wartet eine Abkürzung. Unten eine Matte, die schon bessere Tage sah.',
    choices: [
      { label: 'Hochklettern (STR)', stat: 'STR', dc: 12, success: { text: 'Flash! Oben liegt eine Schatztruhe mit Chalk und Gold.', gold: 5, item: 'Magischer Chalkbag' }, fail: { text: 'Der Griff bröselt. Die Matte fängt dich. Halbwegs.', hp: -3 } },
      { label: 'Außenrum laufen', success: { text: 'Der lange Weg. Dafür mit Aussicht und einer Hütte mit Bier.', hp: 1 } },
    ],
  },
  {
    id: 'merchant',
    title: 'Der fahrende Händler',
    text: 'Ein Händler mit zu vielen Ringen bietet Heiltränke an. „Frisch gebraut. Gestern. Oder letztes Jahr.“',
    choices: [
      { label: 'Heiltrank kaufen (4 Gold, +4 HP)', costGold: 4, success: { text: 'Schmeckt nach Whiskey und Hustensaft. Wirkt.', hp: 4, gold: -4 } },
      { label: 'Feilschen (CHA)', stat: 'CHA', dc: 13, success: { text: 'Er gibt dir den Trank für ein Lächeln. Und einen Kaffee obendrauf.', hp: 4, item: 'Kaffee der Elben' }, fail: { text: 'Er verkauft dir eine Karte von einem Ort, der nicht existiert.', gold: -2 } },
      { label: 'Nichts kaufen', success: { text: 'Sparsam. Dein Konto freut sich, deine HP nicht.' } },
    ],
  },
  {
    id: 'library',
    title: 'Die Bibliothek von Minas Pint',
    text: 'Staubige Bände. Eines der Bücher heißt „Zaubersprüche für Barkeeper, Band III“.',
    choices: [
      { label: 'Spruch lernen (CHA)', stat: 'CHA', dc: 10, success: { text: 'Du lernst „Feuerball of Sláinte“. +2 auf alle Würfe gegen Bossgegner.', item: 'Feuerball of Sláinte' }, fail: { text: 'Du liest drei Stunden das Regelwerk. Es ist jetzt Nacht.', hp: -1 } },
      { label: 'Nur stöbern', success: { text: 'Du findest einen Gutschein für ein Whiskeytasting zwischen den Seiten. Zufall? Nein.', gold: 2 } },
    ],
  },
  {
    id: 'cat',
    title: 'Der Schrein der Schlafenden Katze',
    text: 'Eine Katze schläft auf einem Altar. Sie ist eindeutig der Endboss dieses Raumes. Sie weiß es.',
    choices: [
      { label: 'Streicheln (LUCK)', stat: 'LUCK', dc: 9, success: { text: 'Sie schnurrt. Du erhältst den Segen der Katze: +3 HP.', hp: 3 }, fail: { text: 'Krallen. Sofort. Ohne Vorwarnung.', hp: -2 } },
      { label: 'Leise vorbeischleichen', success: { text: 'Die Katze öffnet ein Auge. Schließt es wieder. Du darfst leben.' } },
    ],
  },
];
export const DUNGEON_BOSS = {
  title: 'Der Balrog der Bar',
  text: 'Am Ende des Dungeons: ein Balrog hinter dem Tresen. Er poliert ein Glas mit Feuer. „Letzte Runde“, grollt er.',
  hits: 3,
  dc: 12,
};

/* ---------- Fundstücke ---------- */
export const COLLECTIBLES: Array<{ id: string; name: string; icon: string; hint: string; desc: string }> = [
  { id: 'bookmark', name: 'Lesezeichen aus Bruchtal', icon: 'bookmark', hint: 'Jemand hat dreimal in den Büchern geblättert.', desc: 'Liegt auf Seite 342 von Band III. Seit 2014.' },
  { id: 'hairball', name: 'Haarball der Katze', icon: 'hairball', hint: 'Die Katze gibt nur beharrlichen Streichlern ein Geschenk.', desc: 'Ein Geschenk. Die Katze besteht darauf.' },
  { id: 'ring', name: 'Ein Ring (nicht DER Ring)', icon: 'ring', hint: 'Wer den Balrog der Bar besiegt, bekommt ihn.', desc: 'Macht nicht unsichtbar. Macht durstig.' },
  { id: 'medal', name: 'Pintsweeper-Medaille', icon: 'medal', hint: 'Ein Feld ohne verschüttetes Pint.', desc: 'Für das Aufräumen eines ganzen Minenfelds voller Pints.' },
  { id: 'diploma', name: 'Diplom des Pub-Quiz', icon: 'diploma', hint: 'Acht richtige Antworten. Mindestens.', desc: 'Verliehen von der Universität des Irish Pub. Akkreditiert von niemandem.' },
  { id: 'goldpint', name: 'Goldenes Pint', icon: 'goldpint', hint: 'Fünf perfekte Pints in einer Schicht.', desc: 'Der Barkeeper hat geweint. Vor Freude. Vermutlich.' },
  { id: 'glowshroom', name: 'Leuchtpilz', icon: 'glowshroom', hint: 'Ein Memory mit sehr gutem Gedächtnis.', desc: 'Leuchtet im Dunkeln. Und bei Tageslicht. Immer.' },
  { id: 'secretfile', name: 'SECRET.TXT', icon: 'secretfile', hint: 'Im Ausführen-Dialog gibt es ein Verzeichnis.', desc: 'Enthält den Inhalt von SECRET.TXT. Logisch.' },
];

export const DIR_LISTING = `Verzeichnis von C:\\MAXI35

AUTOEXEC  BAT       35  21.11.  Startet den Tag mit Kaffee
CONFIG    SYS      420  21.11.  Pflanzen=gegossen
WHISKEY   DLL    1.337  21.11.  Siehe Gutschein
SECRET    TXT       33  21.11.  Nicht öffnen
DONT_OPEN EXE  1.000.000 21.11. Wirklich nicht öffnen
        5 Datei(en)     1.001.855 Bytes
        0 Verzeichnis(se)  35 Jahre frei`;

export const SECRET_TXT = ['SECRET.TXT:', '„Level 35 ist nicht das Ende. Es ist der Patch, in dem endlich die guten Quests freigeschaltet werden.“', 'PS: Das Kaninchen weiß mehr.'];
