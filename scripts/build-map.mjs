/**
 * Statisches Kartenbild für den Besuch-Bereich erzeugen.
 *
 * Warum nicht einfach eine eingebettete Karte? Eine Google-Maps-Einbettung
 * (oder Leaflet mit Live-Tiles) lädt bei jedem Seitenaufruf von fremden
 * Servern nach, setzt Cookies und kostet Ladezeit. Die ganze Seite kommt
 * bewusst ohne solche Requests aus — deshalb wird das Bild hier
 * **einmalig beim Entwickeln** erzeugt und in public/images/ abgelegt.
 * Zur Laufzeit passiert nichts mehr.
 *
 * Warum selbst gezeichnet statt fertige Kacheln? Kachel-Anbieter ohne
 * Beschriftung (CARTO, Stadia, Thunderforest) verlangen inzwischen einen
 * API-Schlüssel und liefern sonst ein Wasserzeichen; die OpenStreetMap-
 * Standardkacheln haben Strassennamen fest eingebrannt und sind hell.
 * Dieses Skript holt stattdessen die rohen Daten (Strassen, Gebäude,
 * Bahn, Wasser, Grün) über die Overpass-API und zeichnet sie als SVG in
 * den Farben der Seite: dunkler Grund, Strassen als feine helle Linien,
 * kein einziges Wort. Die Adresse steht direkt über der Karte.
 *
 * Aufruf:  node scripts/build-map.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Altstadt Liestal — ein erfundener Betrieb hat keine echte Adresse.
const LAT = 47.4842;
const LON = 7.7345;
const ZOOM = 17;
// Angezeigt wird die Karte höchstens ~640 CSS-Pixel breit. 1200 px reichen
// damit auch für Retina-Displays.
const WIDTH = 1200;
const HEIGHT = 525; // 16:7 — schmalere Zuschnitte übernimmt CSS per object-cover
const TILE = 256;

const UA = "Firestone-Beispielseite/1.0 (statisches Kartenbild, einmaliger Build)";

// Farben entsprechen den Tokens in src/app/globals.css.
const FARBEN = {
  grund: "#151210",
  gruen: "#181a14",
  wasser: "#161c22",
  gebaeude: "#221c17",
  gebaeudeRand: "#2c251f",
  strasseKlein: "#3a3129",
  strasseMittel: "#4a3f34",
  strasseGross: "#5a4d40",
  weg: "#2e2721",
  bahn: "#2a231d",
  bahnStrich: "#57493c",
  marker: "#d4af5a",
  markerRand: "#100e0c",
};

/** Weltpixel-Koordinaten nach Web-Mercator. */
function project(lat, lon) {
  const scale = TILE * 2 ** ZOOM;
  const x = ((lon + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

const center = project(LAT, LON);
const left = center.x - WIDTH / 2;
const top = center.y - HEIGHT / 2;

/** Bildkoordinate eines Punkts, mit etwas Rand für Linien am Bildrand. */
function toPx({ lat, lon }) {
  const p = project(lat, lon);
  return [(p.x - left).toFixed(1), (p.y - top).toFixed(1)];
}

// Umgekehrt: Bildecken zurück in Breiten- und Längengrad für die Abfrage,
// mit einem Rand von 15 %, damit Linien am Bildrand nicht abgeschnitten
// wirken.
function unproject(x, y) {
  const scale = TILE * 2 ** ZOOM;
  const lon = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lon };
}
const rand = 0.15;
const sw = unproject(left - WIDTH * rand, top + HEIGHT * (1 + rand));
const ne = unproject(left + WIDTH * (1 + rand), top - HEIGHT * rand);
const bbox = `${sw.lat},${sw.lon},${ne.lat},${ne.lon}`;

const query = `
[out:json][timeout:60];
(
  way["highway"](${bbox});
  way["building"](${bbox});
  way["railway"~"^(rail|tram|light_rail)$"](${bbox});
  way["waterway"~"^(river|stream|canal)$"](${bbox});
  way["natural"="water"](${bbox});
  way["landuse"~"^(grass|forest|meadow|cemetery|orchard|vineyard|farmland)$"](${bbox});
  way["leisure"~"^(park|garden|pitch|playground)$"](${bbox});
);
out geom;
`;

console.log("Lade Kartendaten von der Overpass-API …");
const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
  body: "data=" + encodeURIComponent(query),
});
if (!res.ok) throw new Error(`Overpass: HTTP ${res.status}`);
const { elements } = await res.json();
console.log(`${elements.length} Objekte erhalten.`);

const pathOf = (way) => way.geometry.map((p, i) => (i ? "L" : "M") + toPx(p).join(" ")).join("");
const polyOf = (way) => pathOf(way) + "Z";

// Zeichenreihenfolge: Flächen zuerst, dann Bahn, dann Strassen nach
// Bedeutung, damit die Hauptstrassen oben liegen.
const flaechen = [];
const gebaeude = [];
const bahn = [];
const wege = [];
const strassen = { klein: [], mittel: [], gross: [] };

const BREITE = {
  motorway: 9, trunk: 9, primary: 8, secondary: 7, tertiary: 6,
  residential: 4.5, unclassified: 4.5, living_street: 4, pedestrian: 4, service: 2.5,
};

for (const w of elements) {
  if (w.type !== "way" || !w.geometry) continue;
  const t = w.tags ?? {};
  if (t.building) {
    gebaeude.push(polyOf(w));
  } else if (t.natural === "water") {
    flaechen.push(`<path d="${polyOf(w)}" fill="${FARBEN.wasser}"/>`);
  } else if (t.waterway) {
    flaechen.push(`<path d="${pathOf(w)}" fill="none" stroke="${FARBEN.wasser}" stroke-width="5"/>`);
  } else if (t.landuse || t.leisure) {
    flaechen.push(`<path d="${polyOf(w)}" fill="${FARBEN.gruen}"/>`);
  } else if (t.railway) {
    bahn.push(pathOf(w));
  } else if (t.highway) {
    const h = t.highway;
    if (h in BREITE) {
      const gruppe = BREITE[h] >= 7 ? "gross" : BREITE[h] >= 6 ? "mittel" : "klein";
      strassen[gruppe].push(`<path d="${pathOf(w)}" stroke-width="${BREITE[h]}"/>`);
    } else if (["footway", "path", "steps", "cycleway", "track"].includes(h)) {
      wege.push(pathOf(w));
    }
  }
}

const markerR = 16;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${FARBEN.grund}"/>
  ${flaechen.join("\n  ")}
  <g fill="${FARBEN.gebaeude}" stroke="${FARBEN.gebaeudeRand}" stroke-width="0.8">
    ${gebaeude.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g fill="none" stroke="${FARBEN.weg}" stroke-width="1.4" stroke-dasharray="4 4" stroke-linecap="round">
    ${wege.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${FARBEN.strasseKlein}">${strassen.klein.join("")}</g>
    <g stroke="${FARBEN.strasseMittel}">${strassen.mittel.join("")}</g>
    <g stroke="${FARBEN.strasseGross}">${strassen.gross.join("")}</g>
  </g>
  <g fill="none" stroke-linecap="butt">
    <g stroke="${FARBEN.bahn}" stroke-width="6">${bahn.map((d) => `<path d="${d}"/>`).join("")}</g>
    <g stroke="${FARBEN.bahnStrich}" stroke-width="2" stroke-dasharray="10 8">${bahn.map((d) => `<path d="${d}"/>`).join("")}</g>
  </g>
  <!-- Markierung in Gold (color-primary), der einzige Farbtupfer. -->
  <circle cx="${WIDTH / 2}" cy="${HEIGHT / 2}" r="${markerR * 2.6}" fill="${FARBEN.marker}" opacity="0.16"/>
  <circle cx="${WIDTH / 2}" cy="${HEIGHT / 2}" r="${markerR * 1.7}" fill="${FARBEN.marker}" opacity="0.26"/>
  <circle cx="${WIDTH / 2}" cy="${HEIGHT / 2}" r="${markerR}" fill="${FARBEN.marker}" stroke="${FARBEN.markerRand}" stroke-width="5"/>
</svg>`;

await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile("public/images/karte.webp");

writeFileSync(
  "public/images/karte.txt",
  `Kartenausschnitt Altstadt, 4410 Liestal\n` +
    `Koordinaten: ${LAT}, ${LON} (Zoom ${ZOOM})\n` +
    `Erzeugt mit scripts/build-map.mjs: Rohdaten von der Overpass-API,\n` +
    `selbst gezeichnet, ohne Beschriftung\n` +
    `Kartendaten (c) OpenStreetMap-Mitwirkende, ODbL\n`,
);

console.log(`Fertig: ${WIDTH}x${HEIGHT} -> public/images/karte.webp`);
