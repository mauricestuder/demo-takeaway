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
 * eigenen Hintergrund ueber demselben Foto. Sobald der weisse Balken
 * erscheint, gilt sie nicht mehr — dann steht die Schrift auf Weiss.
 *
 * Aufruf:  node scripts/check-hero-contrast.mjs
 */
import sharp from "sharp";

const BILD = "public/images/hero-hintergrund.webp";
const OV = [38, 24, 20];

// Zwei Fälle, weil Hero.tsx zwei Verläufe setzt. Abmessungen und Textkästen
// im Browser abgelesen (1280 px bzw. 375 px Fensterbreite).
const FAELLE = [
  {
    titel: "Desktop 1280 px — waagrechter Verlauf",
    W: 1265, H: 661, WINKEL: 96,
    STOPS: [[0, 0.66], [0.44, 0.60], [1, 0.38]],
    BOXEN: [
      { name: "Wortmarke (20px, fett)", x: 83, y: 26,  w: 60,  h: 28,  fg: [254,242,242], ziel: 3   },
      { name: "Navigation (16px)",      x: 263, y: 30, w: 573, h: 20,  fg: [254,242,242], ziel: 4.5 },
      { name: "Eyebrow (12px)",     x: 41, y: 133, w: 268, h: 19,  fg: [254,242,242], ziel: 4.5 },
      { name: "Überschrift (84px)", x: 41, y: 183, w: 568, h: 82,  fg: [254,242,242], ziel: 3   },
      { name: "Akzentzeile (84px)", x: 41, y: 336, w: 484, h: 103, fg: [254,202,202], ziel: 3   },
      { name: "Fliesstext (18px)",  x: 41, y: 454, w: 568, h: 58,  fg: [254,242,242], ziel: 4.5 },
    ],
  },
  {
    titel: "Handy 375 px — senkrechter Verlauf",
    W: 375, H: 1027, WINKEL: 180,
    STOPS: [[0, 0.64], [1, 0.58]],
    BOXEN: [
      { name: "Wortmarke (20px, fett)", x: 70, y: 22, w: 60, h: 28, fg: [254,242,242], ziel: 3   },
      { name: "Eyebrow (12px)",     x: 20, y: 118, w: 268, h: 19, fg: [254,242,242], ziel: 4.5 },
      { name: "Überschrift (44px)", x: 20, y: 206, w: 335, h: 43, fg: [254,242,242], ziel: 3   },
      { name: "Akzentzeile (44px)", x: 20, y: 286, w: 254, h: 54, fg: [254,202,202], ziel: 3   },
      { name: "Fliesstext (17px)",  x: 20, y: 359, w: 335, h: 77, fg: [254,242,242], ziel: 4.5 },
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
