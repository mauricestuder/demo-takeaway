/**
 * Bringt die vier Gerichtsbilder auf einen gemeinsamen Look.
 *
 * Warum ueberhaupt? Vier fremde Aufnahmen aus einer Bilddatenbank sehen
 * nebeneinander aus wie vier Zufallsfunde: eine ist blass, die naechste
 * knallorange, die dritte flau. Angeglichen werden deshalb zwei Groessen:
 *
 *   Helligkeit  — mittlerer Grauwert ueber alle Kanaele
 *   Farbspanne  — Abstand zwischen staerkstem und schwaechstem Kanal,
 *                 als grobes Mass fuer die Saettigung
 *
 * Beides wird iterativ angefahren statt einmal geschaetzt: modulate()
 * rechnet in linearem Licht, ein Faktor von 1.2 hebt den gemessenen
 * Mittelwert also nicht um 20 Prozent. Zwei bis drei Durchgaenge treffen
 * das Ziel zuverlaessig auf wenige Punkte genau.
 *
 * Aufruf: node scripts/build-gerichtsbilder.mjs [name]
 *
 * Ohne Namen laufen alle vier durch. Mit Namen nur das eine Bild — das ist
 * nicht Bequemlichkeit: Zwei der Eintraege haben keine Quelldatei und lesen
 * ihr eigenes fertiges WebP erneut ein. Jeder Gesamtlauf jagt die also durch
 * eine weitere verlustbehaftete Runde, ohne dass sich etwas aendert.
 */
import sharp from "sharp";
import fs from "node:fs";

const ZIEL_HELL = 112;
const ZIEL_SPANNE = 78;
const BREITE = 1000;
const HOEHE = 750;
const QUELLEN = process.env.BILDQUELLEN ?? "Images/gerichtsquellen";
const NUR = process.argv[2] ?? null;

/**
 * Die vier Karten der Startseite. `schnitt` greift nur, wenn aus einer
 * groesseren Aufnahme ein Ausschnitt geholt wird — sonst wird mittig auf
 * 4:3 beschnitten.
 */
const BILDER = [
  {
    ziel: "doener-kebab",
    quelle: "29306497-full.jpg",
    // Ausschnitt bewusst links begrenzt: Im Original steht dort eine
    // Coca-Cola-Dose. Fremde Marken haben auf der Seite nichts verloren.
    schnitt: { left: 420, top: 60, width: 1280, height: 960 },
  },
  { ziel: "duerum-kebab", quelle: null },
  {
    ziel: "doener-box",
    quelle: "flickr-54446966205-doenerbox.jpg",
    // Eine Doener Box ist die Faltschachtel, nicht ihr Inhalt auf einem
    // Teller — genau daran ist der vorherige Platzhalter gescheitert.
    //
    // Der Zuschnitt endet rechts bei x=824. Im Original steht dort ein
    // Blechascher auf dem Tisch; die Schachtel hoert bei rund x=798 auf,
    // der Ascher faengt bei rund x=774 an. Deshalb dieser enge Rand: Er
    // ist der einzige Schnitt, der die Schachtel ganz behaelt und den
    // Ascher fast ganz verliert. Wer links mehr Luft haben will, holt ihn
    // sich zurueck.
    schnitt: { left: 24, top: 130, width: 800, height: 600 },
  },
  {
    ziel: "doener-teller",
    quelle: "18062061-full.jpg",
    // Eng auf den Teller: Im Original nimmt eine Backsteinwand das obere
    // Drittel ein. Die drei anderen Karten stehen auf Holz — der Ausschnitt
    // holt den Teller vor das Holzbrett und laesst die Wand ganz weg.
    schnitt: { left: 440, top: 555, width: 1031, height: 773 },
  },
];

/**
 * Misst Helligkeit und Farbspanne eines fertigen Bildpuffers.
 *
 * Wichtig: Gemessen wird immer ein bereits gerechneter Puffer, nie eine
 * Pipeline mit offenen Operationen. sharp.stats() wertet die QUELLE aus
 * und ignoriert angehaengtes modulate() — eine Messung auf der Pipeline
 * liefert also stur den Ausgangswert, und die Regelschleife dreht die
 * Faktoren immer weiter hoch. Genau das hatte den Doener Teller auf
 * Saettigung x4.5 getrieben.
 */
const messe = async (puffer) => {
  const { channels } = await sharp(puffer).stats();
  const [r, g, b] = channels.map((c) => c.mean);
  return {
    hell: (r + g + b) / 3,
    spanne: Math.max(r, g, b) - Math.min(r, g, b),
  };
};

for (const eintrag of BILDER) {
  if (NUR && eintrag.ziel !== NUR) continue;

  const zielDatei = `public/images/${eintrag.ziel}.webp`;

  let basis;
  if (eintrag.quelle) {
    const pfad = `${QUELLEN}/${eintrag.quelle}`;
    if (!fs.existsSync(pfad)) {
      console.log(`${eintrag.ziel.padEnd(16)} uebersprungen — ${pfad} fehlt`);
      continue;
    }
    basis = sharp(pfad);
    if (eintrag.schnitt) basis = basis.extract(eintrag.schnitt);
  } else {
    basis = sharp(zielDatei);
  }

  let roh = await basis.resize(BREITE, HOEHE, { fit: "cover" }).toBuffer();

  // Annaeherung: messen, korrigieren, erneut messen.
  let hellFaktor = 1;
  let sattFaktor = 1;
  let stand = await messe(roh);
  const start = { ...stand };

  for (let runde = 0; runde < 6; runde++) {
    hellFaktor *= Math.pow(ZIEL_HELL / stand.hell, 0.85);
    sattFaktor *= Math.pow(ZIEL_SPANNE / stand.spanne, 0.8);
    // Deckel auf den Gesamtfaktor, nicht auf den Schritt: Ein flaues Bild
    // darf angehoben werden, aber x4 zoege nur Farbrauschen hoch.
    sattFaktor = Math.min(1.8, Math.max(0.5, sattFaktor));

    const versuch = await sharp(roh)
      .modulate({ brightness: hellFaktor, saturation: sattFaktor })
      .toBuffer();
    stand = await messe(versuch);
    if (Math.abs(stand.hell - ZIEL_HELL) < 1.5 && Math.abs(stand.spanne - ZIEL_SPANNE) < 4) break;
  }

  await sharp(roh)
    .modulate({ brightness: hellFaktor, saturation: sattFaktor })
    .webp({ quality: 82 })
    .toFile(zielDatei);

  const kb = (fs.statSync(zielDatei).size / 1024).toFixed(0);
  console.log(
    `${eintrag.ziel.padEnd(16)} ${start.hell.toFixed(0)}/${start.spanne.toFixed(0)} -> ` +
      `${stand.hell.toFixed(0)}/${stand.spanne.toFixed(0)}  ` +
      `(Hell x${hellFaktor.toFixed(2)}, Saett x${sattFaktor.toFixed(2)}, ${kb} KB)`,
  );
}
