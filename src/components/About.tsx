import type { AboutContent } from "@/lib/types";

/**
 * Bewusst zurückhaltend gehalten und weit unten platziert: Die Karte ist der
 * Grund, warum Gäste hier sind — die Geschichte kommt danach.
 */
export function About({ content }: { content: AboutContent }) {
  return (
    <section id="ueber-uns" className="section relative bg-surface-warm">
      <div className="container-page">
        {/* Ohne Foto (Wunsch 01.10.): Überschrift und Text untereinander,
            auf grossen Schirmen auf eine gut lesbare Breite begrenzt. */}
        <div className="grid max-w-3xl gap-y-5 lg:gap-y-6">
          <header data-reveal>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)]">
              {content.title}
            </h2>
          </header>

          <div>
            <div
              data-reveal
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              className="flex flex-col gap-4 leading-relaxed text-muted-foreground"
            >
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <dl
              data-reveal
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-6"
            >
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="tnum block font-display text-3xl font-bold text-primary">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
