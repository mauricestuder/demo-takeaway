/**
 * Bildmarke: rote Tafel mit einem hellen Sesamkorn, darunter die goldene
 * Tresenkante.
 *
 * Eine Ecke bleibt eckig; das unterscheidet die Marke von den vielen Formen
 * in abgerundeten Quadraten und bleibt bis hinunter auf 16 px erkennbar.
 * Dieselbe Zeichnung liegt als `public/icon.svg` im Browser-Tab.
 *
 * Die Farben sind bewusst fest eingetragen statt über Tokens gezogen — eine
 * Marke wechselt die Farbe nicht mit dem Umfeld. Sie entsprechen
 * `--color-primary`, `--color-background` und `--color-accent-on-dark`.
 * Wer sie ändert, ändert sie auch in `public/icon.svg`.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M24 0 H100 V76 A24 24 0 0 1 76 100 H24 A24 24 0 0 1 0 76 V24 A24 24 0 0 1 24 0 Z"
        fill="#dc2626"
      />
      <ellipse cx="50" cy="42" rx="17" ry="25" transform="rotate(-25 50 42)" fill="#fef2f2" />
      <rect x="22" y="75" width="56" height="9" rx="4.5" fill="#e8b04b" />
    </svg>
  );
}
