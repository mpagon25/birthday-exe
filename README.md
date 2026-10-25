# birthday-exe

Zwei digitale Geburtstagskarten mit Whiskeytasting-Gutschein als Browser-Spiele: „Maxi 35.exe“
für Maxi als Windows-95-Desktop über einem Irish Pub und „MICHELLE.EXE“ für Michelle als
Pixel-RPG über einem Irish Pub. Vollständig clientseitig, keine Backend-Abhängigkeit, statisch
deploybar.

## Start

```bash
npm install
npm run dev
```

Produktionsbuild nach `dist/`:

```bash
npm run build
```

Eine Single-Page-App mit drei Routen: `/` Landingpage mit zwei Buttons, `/maxi35` die
Win95-Karte, `/michelle33` das Pixel-RPG. Routing läuft in `src/Router.tsx` über die History-API
ohne zusätzliche Abhängigkeit, die beiden Karten werden per `React.lazy` erst beim Aufruf
geladen.

Hosting: Da die Routen clientseitig sind, muss der Host Deep-Links wie `/michelle33` auf
`index.html` umschreiben (SPA-Fallback). Bei Netlify reicht eine `public/_redirects` mit
`/* /index.html 200`, bei Vercel ein Rewrite in `vercel.json`, bei nginx `try_files $uri
/index.html`.

## Aufbau

- `index.html`, `src/main.tsx`, `src/Router.tsx` – Einstieg und Routing.
- `src/Landing.tsx` – Landingpage als „Select Player“: zwei neutrale Spielmodule mit Name und
  Level, ohne Hinweise auf den Inhalt der Karten. Kein Bootscreen.
- Jede Karte ist ein eigener App-Baum mit eigenem Wrapper (`.app-maxi35`, `.app-michelle33`),
  auf den ihre globalen Styles gescopt sind.

### Gemeinsame Basis `src/shared/`

- `stage/` Bühne in 1536 × 1024, uniform skaliert, auf schmalen Screens Höhen-Skalierung mit
  horizontalem Scrollen.
- `fx/` Canvas-Partikel (Konfetti, Regen aus beliebigen Glyphen, Feuerwerk, Sterne) und Cursor-Trail.
- `audio/` Web-Audio-Synth mit allen Soundeffekten, generischer Chiptune-Sequencer
  (`MusicPlayer`), Audio-Provider mit Mute, Lautstärke und Musiklautstärke pro App.
- `achievements/` generischer Achievement-Provider mit LocalStorage-Key pro App.
- `hooks/` reduced-motion, Sichtbarkeit, Intervalle, LocalStorage.

### maxi35 – Maxi 35.exe (`src/maxi35/`)

- `public/scene.webp` – das Referenzbild (1536 × 1024). Es ist der Hintergrund der Bühne, die
  Win95-Elemente (Titelleiste, Menü, Icon-Leiste, Taskbar, Bestätigungsdialog) liegen als echtes
  HTML pixelgenau darüber. Alle Koordinaten im Code sind Bildpixel.
- `desktop/` – Window-Manager (öffnen, schließen, minimieren, verschieben, Fokus), Fenster,
  Titelleiste, Menüleiste, Icon-Leiste, Taskbar, Startmenü, Message-Box.
- `scene/` – Hotspots (transparente Buttons über Bildobjekten), Ambient-Overlays (Feuer,
  Neon, Discokugel, Pilze, Rauch, Lichterketten, Zzz), Pixel-Läufer.
- `apps/` – alle Fenster: Level-Up, Gutschein, WhiskeyTasting, Zauberer, Boulder-Minigame,
  W20, Rabbit Hole, Kalender, Internet Explorer, Inventory mit Fundstücken, Achievements, Paint,
  Tavern Radio, GameNight, Kaffee, Quest Log, Einstellungen, Ausführen, Über. Minigames mit
  echter Mechanik: Bouldern, PubQuiz (Zeitlimit), Zapfhahn (Timing), Dungeon (W20-Textabenteuer),
  Pintsweeper (Minesweeper), Botanik (Memory). Registry in `registry.tsx`.
- `desktop/FrameExtension.tsx` – verlängert Titelleiste, Menü und Taskbar über die volle
  Viewport-Breite, wenn die 3:2-Bühne Rand hat.
- `audio/` – alle Sounds und vier Musiktitel werden per Web Audio synthetisiert; das Spellcaster-Theme startet nach dem Boot automatisch, Umschalter in Taskbar und Einstellungen. Keine
  Audiodateien, kein Lizenzrisiko. Mute und Lautstärke in Taskbar, Radio und Einstellungen.
- `achievements/` – 23 Achievements, gespeichert im LocalStorage. Acht Fundstücke sind in Spielen,
  Büchern, Katze und versteckten Dateien verteilt (Inventory zeigt Hinweise).
- `overlays/` – Bootscreen, Party Mode, Pilz-Modus, BSOD, Achievement-Toasts.
- `content/texts.ts` – alle Texte zentral.

### michelle33 – MICHELLE.EXE (`src/michelle/`)

- `MichelleGame.tsx` orchestriert Boot, Dialoge, Modi (Metal, Chaos, God Mode), Finale und Modals.
- `scene/` Hotspots über dem Bild, Ambient-Overlays, Sprite-Layer (Katzen, Fledermaus, Wikinger,
  Palme, Pool-Faultier, Fußball), untere Icon-Leiste.
- `games/` Whiskey Roulette, Bug Hunter 33, Gemüsebeet, Kimchi Combo, Cocktail Mixer, Atelier,
  Terminal.
- `sprites/` handgezeichnete Pixel-Sprites als Textraster, `ui/` Pixel-Designsystem (Boxen,
  Buttons, RPG-Dialogbox, HUD, Toasts, Modal), `content/` alle Texte und Achievements,
  `audio/tracks.ts` vier synthetisierte Musiktitel plus Katzenkonzert.
- Gutschein-Quest: Whiskey Roulette spielen, eine Katze streicheln, das Faultier geduldig
  anklicken. Dann leuchtet am Kalender ein Ausrufezeichen. Der Gutschein bleibt danach jederzeit
  über die untere Leiste und den Kalender erreichbar und lässt sich drucken.

## Geheimnisse (maxi35)

- Konami-Code oder fünf schnelle Klicks aufs Schild: Party Mode.
- Start → Ausführen: `help` zeigt die Befehle, `dir` zeigt versteckte Dateien.
- Rotes Pilz-Icon, Pilze im Bild oder Menü 420: Reality.exe.
- Kaninchen: Follow the white rabbit.
- Strg+P schenkt ein Pint ein, Strg+O öffnet den Gutschein, Esc schließt das aktive Fenster.

## Geheimnisse (michelle33)

- Konami-Code: God Mode. 33 Klicks aufs Schild: geheimes Achievement.
- Drei Katzen schnell hintereinander: Katzenkonzert. Terminal (leerer Slot rechts unten):
  `michelle.dev`, `help`, `chaos`, `metal`, `god`.
- Viele Klicks in kurzer Zeit füllen den Chaos-Meter.

## Barrierefreiheit und Performance

- `prefers-reduced-motion` schaltet Daueranimationen, Partikel und Übergänge ab; zusätzlich gibt
  es in den Einstellungen „Effekte reduzieren“.
- Alle Hotspots, Icons, Menüs und Fenster sind per Tastatur bedienbar.
- Partikel-Loop und Audio pausieren in Hintergrund-Tabs.
