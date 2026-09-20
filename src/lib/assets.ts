/**
 * Pfade zu Dateien aus /public um den Basispfad ergänzen.
 *
 * Hintergrund: Beim Export für GitHub Pages liegt die Seite nicht an der
 * Wurzel, sondern unter `/<repo>/`. Next.js setzt diesen Basispfad
 * automatisch vor die eigenen Bundles (`_next/…`) und vor alle internen
 * Links — **nicht** aber vor das `src` von `next/image`, sobald
 * `images.unoptimized` gilt. Dort wird der Pfad unverändert übernommen.
 *
 * Folge ohne diese Funktion: `/images/hero.webp` zeigt im Browser auf
 * `https://<user>.github.io/images/hero.webp` statt auf
 * `https://<user>.github.io/<repo>/images/hero.webp` — jedes Bild 404.
 * Lokal fällt das nicht auf, weil der Basispfad dort leer ist.
 *
 * `NEXT_PUBLIC_BASE_PATH` wird in next.config.ts gesetzt und beim Build
 * fest in den Code geschrieben.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(src: string): string {
  // Leere Werte, absolute URLs und data:-URIs bleiben unangetastet.
  if (!src.startsWith("/")) return src;
  return `${basePath}${src}`;
}
