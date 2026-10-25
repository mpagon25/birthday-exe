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
