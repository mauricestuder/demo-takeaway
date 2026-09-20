/**
 * Kontrast der Schrift über dem Hero-Foto nachmessen.
 *
 * Warum ein eigenes Skript? Schrift auf einem Foto lässt sich nicht wie
 * Schrift auf einer Farbfläche prüfen: Der Hintergrund ist an jeder Stelle
 * anders. Gemessen wird deshalb der **hellste Punkt** innerhalb jedes
 * Textkastens — das ist der ungünstigste Fall für helle Schrift.
 *
 * Das Skript bildet den Verlauf aus Hero.tsx nach. Wer dort die Werte
 * ändert, ändert sie auch hier — sonst misst es etwas anderes als die Seite
 * zeigt.
 *
 * Mitgemessen wird die Kopfzeile: Sie liegt im ungescrollten Zustand ohne
 * eigenen Hintergrund ueber demselben Foto. Sobald der dunkle Balken
 * erscheint, gilt sie nicht mehr — dann steht die Schrift auf dem Seitengrund.
 *
 * Aufruf:  node scripts/check-hero-contrast.mjs
 */
import sharp from "sharp";

const BILD = "public/images/hero-hintergrund.webp";
const OV = [16, 14, 12];

// Creme (--color-foreground), Gold (--color-primary), gedämpftes Creme
// (--color-foreground-soft) und Gold als Schrift (--color-primary-text).
const CREME = [241, 232, 216];
const GOLD = [212, 175, 90];
const CREME_SOFT = [215, 202, 181];
const GOLD_TEXT = [217, 184, 102];

// Ein senkrechter Verlauf für beide Breiten (Hero.tsx). Abmessungen und
// Textkästen im Browser abgelesen (1280 px bzw. 375 px Fensterbreite);
// die Breite der Überschriftzeilen ist die Breite des Worts, nicht des
// Blocks.
const STOPS = [[0, 0.6], [0.3, 0.5], [0.72, 0.88], [1, 1]];
const FAELLE = [
  {
    titel: "Desktop 1280 px",
    W: 1280, H: 933, WINKEL: 180, STOPS,
    BOXEN: [
      { name: "Wortmarke (18px)",     x: 91,  y: 26,  w: 110, h: 28,  fg: CREME,      ziel: 3   },
      { name: "Navigation (13px)",    x: 217, y: 30,  w: 668, h: 20,  fg: CREME,      ziel: 4.5 },
      { name: "Eyebrow (12px)",       x: 41,  y: 134, w: 242, h: 19,  fg: GOLD_TEXT,  ziel: 4.5 },
      { name: "Überschrift (120px)",  x: 41,  y: 184, w: 460, h: 230, fg: CREME,      ziel: 3   },
      { name: "Akzentzeile (120px)",  x: 41,  y: 414, w: 460, h: 115, fg: GOLD,       ziel: 3   },
      { name: "Fliesstext (18px)",    x: 41,  y: 558, w: 681, h: 58,  fg: CREME_SOFT, ziel: 4.5 },
      { name: "Infozeile (15px)",     x: 41,  y: 739, w: 768, h: 98,  fg: CREME,      ziel: 4.5 },
    ],
  },
  {
    titel: "Handy 375 px",
    W: 375, H: 911, WINKEL: 180, STOPS,
    BOXEN: [
      { name: "Wortmarke (18px)",     x: 70, y: 22,  w: 110, h: 28,  fg: CREME,      ziel: 3   },
      { name: "Eyebrow (12px)",       x: 20, y: 120, w: 242, h: 19,  fg: GOLD_TEXT,  ziel: 4.5 },
      { name: "Überschrift (41px)",   x: 20, y: 207, w: 170, h: 100, fg: CREME,      ziel: 3   },
      { name: "Akzentzeile (41px)",   x: 20, y: 307, w: 170, h: 50,  fg: GOLD,       ziel: 3   },
      { name: "Fliesstext (17px)",    x: 20, y: 385, w: 335, h: 77,  fg: CREME_SOFT, ziel: 4.5 },
      { name: "Infozeile (15px)",     x: 20, y: 646, w: 335, h: 209, fg: CREME,      ziel: 4.5 },
    ],
  },
];

const lin = (v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
const lum = (r,g,b) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);

let fehler = 0;
for (const fall of FAELLE) {
  const { W, H, WINKEL, STOPS, BOXEN } = fall;
  const foto = await sharp(BILD)
    .resize(W, H, { fit: "cover", position: "centre" })
    .removeAlpha().raw().toBuffer();

  const rad = ((WINKEL - 90) * Math.PI) / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  const laenge = Math.abs(W * dx) + Math.abs(H * dy);

  const alphaAt = (x, y) => {
    const t = Math.min(1, Math.max(0, ((x - W/2)*dx + (y - H/2)*dy) / laenge + 0.5));
    for (let i = 1; i < STOPS.length; i++) {
      const [t0, a0] = STOPS[i-1], [t1, a1] = STOPS[i];
      if (t <= t1) return a0 + (a1 - a0) * ((t - t0) / (t1 - t0));
    }
    return STOPS[STOPS.length-1][1];
  };

  console.log(`
${fall.titel}`);
  for (const b of BOXEN) {
    let maxL = 0;
    for (let y = b.y; y < b.y + b.h; y++) {
      for (let x = b.x; x < b.x + b.w; x++) {
        const i = (y * W + x) * 3, a = alphaAt(x, y);
        const L = lum(
          foto[i]   * (1-a) + OV[0]*a,
          foto[i+1] * (1-a) + OV[1]*a,
          foto[i+2] * (1-a) + OV[2]*a,
        );
        if (L > maxL) maxL = L;
      }
    }
    const L1 = lum(...b.fg);
    const v = (Math.max(L1,maxL)+0.05) / (Math.min(L1,maxL)+0.05);
    const ok = v >= b.ziel;
    if (!ok) fehler++;
    console.log(`  ${ok ? "OK  " : "FEHL"} ${b.name.padEnd(22)} ${v.toFixed(2)}:1   (nötig ${b.ziel}:1)`);
  }
}

if (fehler) {
  console.error(`\n${fehler} Textebene(n) unter dem Mindestkontrast.`);
  process.exit(1);
}
console.log("\nAlle Textebenen über dem Mindestkontrast.");
