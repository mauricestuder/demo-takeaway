/**
 * Statisches Kartenbild für den Besuch-Bereich erzeugen.
 *
 * Warum nicht einfach eine eingebettete Karte? Eine Google-Maps-Einbettung
 * (oder Leaflet mit Live-Tiles) lädt bei jedem Seitenaufruf von fremden
 * Servern nach, setzt Cookies und kostet Ladezeit. Die ganze Seite kommt
 * bewusst ohne solche Requests aus — deshalb werden die Kacheln hier
 * **einmalig beim Entwickeln** heruntergeladen und als fertiges Bild in
 * public/images/ abgelegt. Zur Laufzeit passiert nichts mehr.
 *
 * Warum Kacheln ohne Beschriftung? Das Bild soll ruhig wirken und keine
 * Strassen- oder Ortsnamen zeigen. Die Standard-Kacheln von OpenStreetMap
 * haben die Namen fest eingebrannt und lassen sich nicht abschalten; die
 * "nolabels"-Variante von CARTO (Stil "Voyager") zeichnet dieselben Daten
 * rein grafisch: Strassen, Gebäude und die Bahnlinie als Flächen und Linien,
 * kein einziges Wort. Die Adresse steht auf der Seite direkt über der Karte.
 *
 * Aufruf:  node scripts/build-map.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Rathausstrasse, Liestal — ein erfundener Betrieb hat keine echte Adresse.
const LAT = 47.4842;
const LON = 7.7345;
const ZOOM = 17;
// Angezeigt wird die Karte höchstens ~640 CSS-Pixel breit. 1200 px reichen
// damit auch für Retina-Displays; 1400 war unnötig schwer, und beim
// statischen Export liefert Next.js die Datei ungerechnet aus.
const WIDTH = 1200;
const HEIGHT = 525; // 16:7 — schmalere Zuschnitte übernimmt CSS per object-cover
const TILE = 256;

const UA = "Sesam-Beispielseite/1.0 (statisches Kartenbild, einmaliger Build)";
const SUBDOMAINS = ["a", "b", "c", "d"];

/** Weltpixel-Koordinaten nach Web-Mercator. */
function project(lat, lon, zoom) {
  const scale = TILE * 2 ** zoom;
  const x = ((lon + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

async function fetchTile(z, x, y, i) {
  const sub = SUBDOMAINS[i % SUBDOMAINS.length];
  const url = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${z}/${x}/${y}.png`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Kachel ${z}/${x}/${y}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const center = project(LAT, LON, ZOOM);
const left = Math.round(center.x - WIDTH / 2);
const top = Math.round(center.y - HEIGHT / 2);

const tileX0 = Math.floor(left / TILE);
const tileY0 = Math.floor(top / TILE);
const tileX1 = Math.floor((left + WIDTH) / TILE);
const tileY1 = Math.floor((top + HEIGHT) / TILE);

const cols = tileX1 - tileX0 + 1;
const rows = tileY1 - tileY0 + 1;
console.log(`Lade ${cols * rows} Kacheln (Zoom ${ZOOM}, ohne Beschriftung) …`);

const composites = [];
let index = 0;
for (let ty = tileY0; ty <= tileY1; ty++) {
  for (let tx = tileX0; tx <= tileX1; tx++) {
    const buf = await fetchTile(ZOOM, tx, ty, index++);
    composites.push({
      input: buf,
      left: tx * TILE - tileX0 * TILE,
      top: ty * TILE - tileY0 * TILE,
    });
    // Höflich bleiben: die Kachelserver sind ein kostenloses Angebot.
    await new Promise((r) => setTimeout(r, 120));
  }
}

const stitched = await sharp({
  create: {
    width: cols * TILE,
    height: rows * TILE,
    channels: 3,
    background: { r: 242, g: 239, b: 233 },
  },
})
  .composite(composites)
  .png()
  .toBuffer();

// Ausschnitt so wählen, dass das Lokal genau in der Mitte liegt.
const cropped = await sharp(stitched)
  .extract({
    left: left - tileX0 * TILE,
    top: top - tileY0 * TILE,
    width: WIDTH,
    height: HEIGHT,
  })
  .toBuffer();

// Die Farben der Kacheln werden angehoben, nicht gedämpft: Gebäudeflächen,
// Grünanlagen und die Bahnanlage sollen sich deutlich voneinander abheben.
// Der ganz leichte warme Schleier bindet das Ganze an die Palette der Seite
// (Hintergrund #fef2f2), ohne die Farben zu schlucken — multiplizieren statt
// einfärben, dadurch bleiben die Helligkeitsabstufungen erhalten.
//
// Das `linear` spreizt zusätzlich den Kontrast. Ohne diesen Schritt liegt
// die Karte so nah am Seitenhintergrund, dass sie wie ein nicht geladenes
// Bild wirkt — Strassen und Bahnlinie waren kaum vom Untergrund zu trennen.
const warmed = await sharp(cropped)
  .modulate({ brightness: 0.9, saturation: 2.3 })
  .linear(1.5, -110)
  .composite([
    {
      input: {
        create: {
          width: WIDTH,
          height: HEIGHT,
          channels: 4,
          background: { r: 255, g: 247, b: 242, alpha: 1 },
        },
      },
      blend: "multiply",
    },
  ])
  .toBuffer();

// Markierung in den Farben der Seite (--color-primary #dc2626). Ohne
// Beschriftung ist sie der einzige Anhaltspunkt — deshalb etwas kräftiger.
const markerSize = 104;
const marker = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}" viewBox="0 0 104 104">
  <circle cx="52" cy="52" r="40" fill="#dc2626" opacity="0.14"/>
  <circle cx="52" cy="52" r="26" fill="#dc2626" opacity="0.22"/>
  <circle cx="52" cy="52" r="15" fill="#dc2626" stroke="#ffffff" stroke-width="5"/>
</svg>`);

const withMarker = await sharp(warmed)
  .composite([
    {
      input: marker,
      left: Math.round(WIDTH / 2 - markerSize / 2),
      top: Math.round(HEIGHT / 2 - markerSize / 2),
    },
  ])
  .toBuffer();

await sharp(withMarker)
  .webp({ quality: 78 })
  .toFile("public/images/karte.webp");

// Bewusst nur WebP: Alles in public/ wird beim statischen Export
// mitausgeliefert, ein ungenutztes JPEG wäre reiner Ballast. WebP wird von
// allen aktuellen Browsern unterstützt.
const meta = await sharp(withMarker).metadata();
writeFileSync(
  "public/images/karte.txt",
  `Kartenausschnitt Altstadt, 4410 Liestal\n` +
    `Koordinaten: ${LAT}, ${LON} (Zoom ${ZOOM})\n` +
    `Erzeugt mit scripts/build-map.mjs\n` +
    `Kacheln: CARTO "voyager_nolabels" (ohne Beschriftung)\n` +
    `Kartendaten (c) OpenStreetMap-Mitwirkende, ODbL - Kacheln (c) CARTO\n`,
);

console.log(`Fertig: ${meta.width}x${meta.height} -> public/images/karte.webp`);
