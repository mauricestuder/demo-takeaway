/**
 * PNG-Varianten des Logos aus public/icon.svg erzeugen.
 *
 * Warum überhaupt PNG, wenn ein SVG vorliegt? Zwei Stellen können mit SVG
 * nichts anfangen:
 *  - `apple-touch-icon` auf iOS akzeptiert nur Bitmaps. Dort darf das Bild
 *    ausserdem nicht transparent sein und keine eigenen runden Ecken haben —
 *    iOS schneidet selbst zu. Deshalb bekommt diese Variante eine volle rote
 *    Fläche und einen eigenen Zuschnitt.
 *  - Ältere Browser und einige Vorschaudienste ziehen ein 32-px-PNG vor.
 *
 * Aufruf:  node scripts/build-icons.mjs
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/icon.svg");

// Tab-Symbol als Bitmap, mit den runden Ecken aus dem SVG.
const png32 = await sharp(svg, { density: 512 })
  .resize(32, 32)
  .png()
  .toFile("public/icon-32.png");

// iOS: randvoll, ohne eigene Rundung. Dieselbe Zeichnung, aber die Tafel
// füllt die Fläche — die Ecken übernimmt das Betriebssystem.
const APPLE = 180;
const inner = Math.round(APPLE * 0.8);
const mark = await sharp(svg, { density: 512 }).resize(inner, inner).png().toBuffer();
const apple = await sharp({
  create: { width: APPLE, height: APPLE, channels: 4, background: { r: 220, g: 38, b: 38, alpha: 1 } },
})
  .composite([{ input: mark, gravity: "centre" }])
  .png()
  .toFile("public/apple-icon.png");

console.log(`icon-32.png  ${png32.width}x${png32.height}  ${png32.size} B`);
console.log(`apple-icon.png  ${apple.width}x${apple.height}  ${apple.size} B`);
