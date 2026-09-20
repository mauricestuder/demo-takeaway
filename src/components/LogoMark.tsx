/**
 * Bildmarke: dunkle Tafel mit feinem Goldrand, darin eine Flamme in Gold.
 *
 * Bewusst eckig — die Marke soll sich von den vielen abgerundeten Quadraten
 * unterscheiden und bleibt bis hinunter auf 16 px erkennbar. Dieselbe
 * Zeichnung liegt als `public/icon.svg` im Browser-Tab.
 *
 * Die Farben sind fest eingetragen statt über Tokens gezogen — eine Marke
 * wechselt die Farbe nicht mit dem Umfeld. Sie entsprechen
 * `--color-card` und `--color-primary`.
 * Wer sie ändert, ändert sie auch in `public/icon.svg`.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      <rect x="0" y="0" width="100" height="100" fill="#1a1613" />
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="#d4af5a" strokeWidth="3" />
      <path
        d="M50 16c6 12 20 20 20 40a20 20 0 0 1-40 0c0-10 6-16 11-22 0 9 5 13 8 12-4-10-2-20 1-30z"
        fill="#d4af5a"
      />
      <path
        d="M50 52c4 6 9 9 9 16a9 9 0 0 1-18 0c0-5 3-8 5-11 0 4 2 6 4 5-2-4-1-7 0-10z"
        fill="#1a1613"
      />
    </svg>
  );
}
