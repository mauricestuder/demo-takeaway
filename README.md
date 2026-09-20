# Firestone — Beispiel-Website für ein Steakhouse

Beispielseite für die Projektarbeit von Maurice Studer (Sek Frenke, Liestal):
So könnte die Website eines Restaurants aussehen. **«Firestone» ist
erfunden** — Name, Adresse (Musterstrasse 12), Telefonnummer, Speisekarte,
Weinkarte und die Familie Brenner sind ausgedacht. Die Fotos sind Platzhalter
von Pexels (Nachweis in
[`public/images/BILDNACHWEIS.txt`](./public/images/BILDNACHWEIS.txt)).

Gestaltung: dunkel und gold (Playfair Display + Inter), Foto über die volle
Höhe, Reservation per Telefon als Hauptaktion. Alle Farben liegen als Tokens
in `src/app/globals.css`.

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
| `npm run build:map` | Kartenbild aus OpenStreetMap-Daten zeichnen (Koordinaten im Skript) |
| `npm run check:hero` | Kontrast der Schrift über dem Hero-Foto nachmessen |
| `npm run build:icons` | Tab-Symbole aus `public/icon.svg` erzeugen |

## Inhalte ändern

Alles, was auf der Seite steht, liegt in [`content/`](./content) als JSON —
Anleitung in [`content/README.md`](./content/README.md).

```
content/
├── site.json      Name, Adresse, Kontakt, SEO, Beispiel-Hinweis
├── pages.json     Texte der Startseite (Hero, Gründe, Über uns, Besuch, Footer)
├── menu.json      Speisekarte inkl. Weinkarte
├── hours.json     Öffnungszeiten
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
