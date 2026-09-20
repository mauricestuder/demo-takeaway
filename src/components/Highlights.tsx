import { Icon } from "./Icon";
import type { AccentTone, HighlightsContent } from "@/lib/types";

/**
 * Farbklassen je Karte. Bewusst als vollständige Klassennamen ausgeschrieben:
 * Tailwind liest den Quelltext statisch, aus `bg-${tone}/10` entstünde kein CSS.
 *
 * Für Text stehen die dunkleren Stufen (`primary-text`, `accent-text`), weil
 * das Palettenrot und das Gold bei kleinen Schriftgraden sonst unter 4.5:1
 * liegen.
 */
const TONES: Record<AccentTone, { tile: string; pill: string }> = {
  primary: {
    tile: "bg-primary/10 text-primary-text",
    pill: "border-primary/30 bg-primary/10 text-primary-text",
  },
  accent: {
    tile: "bg-accent/12 text-accent-text",
    pill: "border-accent/35 bg-accent/10 text-accent-text",
  },
  success: {
    tile: "bg-success/10 text-success-text",
    pill: "border-success/30 bg-success/10 text-success-text",
  },
};

/**
 * „Warum Sesam".
 *
 * Ab 640 px exakt wie ursprünglich: Icon über der Überschrift, grosszügige
 * Karten, zwei bzw. drei Spalten.
 *
 * Auf dem Handy eine Spalte: Bei zwei Spalten blieben je Karte rund 160 px
 * Breite, also etwa 17 Zeichen pro Zeile — die ausformulierten Texte liefen
 * dort über vierzehn Zeilen. Eine Spalte ist nicht nur lesbarer, sondern in
 * der Summe sogar kürzer. Das Icon rückt dort neben die Überschrift.
 * Bei ungerader Anzahl nimmt der letzte Eintrag ab 640 px die volle Breite ein.
 *
 * Jede Karte trägt eine eigene Akzentfarbe und schliesst mit einer kurzen
 * Kennzahl ab. Beides gegen den vorher sehr leeren Eindruck: Die Karten
 * bestanden aus Symbol, Titel und einem einzigen Satz.
 */
export function Highlights({ content }: { content: HighlightsContent }) {
  return (
    <section id="highlights" className="section relative bg-surface-warm">
      <div className="container-page">
        <header data-reveal className="max-w-2xl">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
        </header>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {content.items.map((item, index) => {
            const isLastOdd =
              content.items.length % 2 === 1 && index === content.items.length - 1;
            const tone = TONES[item.tone ?? "primary"];

            return (
              <li
                key={item.id}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                className={
                  isLastOdd ? "sm:col-span-2 lg:col-span-1" : undefined
                }
              >
                <article className="card flex h-full flex-col border-2 p-4 transition-colors duration-200 hover:border-primary sm:p-7">
                  {/* Auf dem Handy eine Zeile (Icon neben Titel), ab 640 px
                      wieder normaler Blockfluss: Icon oben, Titel darunter. */}
                  <div className="flex items-center gap-3 sm:block">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg sm:h-14 sm:w-14 sm:rounded-xl ${tone.tile}`}
                    >
                      <Icon name={item.icon} size={22} />
                    </span>
                    <h3 className="min-w-0 break-words font-display text-[0.9375rem] leading-tight hyphens-auto sm:mt-6 sm:text-2xl sm:leading-[1.06]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Kurzfassung auf dem Handy, ausformulierte ab 640 px. Beide
                      stehen im Markup; `hidden` blendet die jeweils andere
                      per display:none aus und nimmt sie damit auch aus dem
                      Vorlese-Baum. */}
                  {item.textShort ? (
                    <>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-3 sm:text-base sm:hidden">
                        {item.textShort}
                      </p>
                      <p className="hidden mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-3 sm:text-base sm:block">
                        {item.text}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">{item.text}</p>
                  )}

                  {/* `mt-auto` am Wrapper hält die Pillen aller Karten auf
                      einer Linie, auch wenn die Texte unterschiedlich lang
                      umbrechen. Der Abstand steht am Wrapper, nicht an der
                      Pille — sonst überschreibt `mt-auto` ihn. */}
                  {item.fact && (
                    <div className="mt-auto pt-4 sm:pt-6">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${tone.pill}`}
                      >
                        {item.fact}
                      </span>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
