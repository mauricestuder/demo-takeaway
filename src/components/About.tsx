import { SmartImage } from "./SmartImage";
import type { AboutContent } from "@/lib/types";

/**
 * Bewusst zurückhaltend gehalten und weit unten platziert: Die Karte ist der
 * Grund, warum Gäste hier sind — die Geschichte kommt danach.
 */
export function About({ content }: { content: AboutContent }) {
  return (
    <section id="ueber-uns" className="section relative bg-surface-warm">
      <div className="container-page">
        {/* Auf dem Handy in drei Blöcken untereinander: erst die Überschrift,
            dann das Bild, dann der Text. Vorher stand das Bild ganz oben und
            die Überschrift darunter — mit 2.5rem Abstand dazwischen las sich
            das wie zwei Dinge, die nichts miteinander zu tun haben.

            Ab 1024 px wieder nebeneinander: Bild links über beide Zeilen,
            Überschrift und Text rechts daneben. Deshalb hier feste Zeilen
            und Spalten statt der bisherigen Reihenfolge im Fluss. */}
        <div className="grid gap-x-12 gap-y-5 lg:grid-cols-12 lg:gap-y-6">
          <header data-reveal className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)]">
              {content.title}
            </h2>
          </header>

          <div
            data-reveal
            className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center"
          >
            <SmartImage
              image={content.image}
              ratio={null}
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="aspect-[16/10] rounded-sm border border-border lg:aspect-[5/4]"
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
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
