# Sesam — Beispiel-Website für einen Take-away

Beispielseite für die Projektarbeit von Maurice Studer (Sek Frenke, Liestal):
So könnte die Website eines kleinen Betriebs aussehen. **«Sesam» ist
erfunden** — Name, Adresse (Musterstrasse 12), Telefonnummer, Speisekarte und
Familie Demir sind ausgedacht. Die Fotos sind Platzhalter von Pexels (Nachweis
in [`public/images/BILDNACHWEIS.txt`](./public/images/BILDNACHWEIS.txt)).

Die Seite trägt deshalb oben einen Hinweis «Beispielseite» (`demoMode` in
`content/site.json`) und ist für Suchmaschinen gesperrt.

## Live

<https://mauricestuder.github.io/demo-takeaway/>

Veröffentlichen (baut lokal und schiebt das Ergebnis in den Zweig `gh-pages`):

```bash
npm run deploy
```

## Lokal starten

```bash
npm install
npm run dev
```

Dann <http://localhost:3000> öffnen.

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Auto-Reload |
| `npm run build` | Produktions-Build |
| `npm run typecheck` | TypeScript prüfen |
| `npm run check:hours` | Selbsttest der Öffnungszeiten-Logik |
| `npm run build:map` | Kartenbild neu erzeugen (Koordinaten im Skript) |
| `npm run build:icons` | Tab-Symbole aus `public/icon.svg` erzeugen |

## Inhalte ändern

Alles, was auf der Seite steht, liegt in [`content/`](./content) als JSON —
Anleitung in [`content/README.md`](./content/README.md).

```
content/
├── site.json      Name, Adresse, Kontakt, SEO, Beispiel-Hinweis
├── pages.json     Texte der Startseite (Hero, Gründe, Über uns, Besuch, Footer)
├── menu.json      Speisekarte
├── hours.json     Öffnungszeiten
├── reviews.json   Drei Aussagen über den Betrieb (keine erfundenen Zitate, keine Note)
└── legal.json     Impressum und Datenschutz
```

## Für einen echten Kunden

1. Ordner kopieren, `content/*.json` mit den echten Angaben füllen
2. Fotos des Betriebs nach `public/images/`, Pfade in den JSON-Dateien eintragen
3. Farben in `src/app/globals.css` (`@theme`), Logo in
   `src/components/LogoMark.tsx` und `public/icon.svg`
4. Koordinaten in `scripts/build-map.mjs`, dann `npm run build:map`
5. `demoMode` auf `false`, Impressum vervollständigen

## Technik

Next.js 15, React 19, TypeScript, Tailwind CSS 4. Statisch exportiert, keine
externen Requests zur Laufzeit: keine Font-CDN, keine Analytics, keine
eingebettete Karte — deshalb kein Cookie-Banner. Öffnungsstatus wird im
Browser in `Europe/Zurich` berechnet.
