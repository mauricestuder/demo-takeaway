import { Icon } from "./Icon";
import type { ReviewsContent } from "@/lib/types";

/**
 * Bewertungsbereich.
 *
 * Bewusst als Zusammenfassung mit Quellenangabe gebaut statt mit erfundenen
 * Einzelzitaten: Gezeigt werden die aggregierte Bewertung, ein Link zur Quelle
 * und wiederkehrende Themen aus öffentlichen Rückmeldungen. Sobald echte,
 * freigegebene Zitate in `content/reviews.json` stehen, erscheinen sie
 * zusätzlich.
 *
 * Die Note steht als waagrechte Zeile statt als hohe Karte — Zahl, Sterne und
 * Quelle nebeneinander. Das spart auf dem Handy rund eine halbe Bildschirmhöhe.
 */
export function Reviews({ content }: { content: ReviewsContent }) {
  const { rating } = content;

  return (
    <section id="bewertungen" className="section relative">
      <div className="container-page">
        <header data-reveal className="max-w-2xl">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          {content.intro && <p className="lead mt-2.5">{content.intro}</p>}
        </header>

        {/* Ab 1024 px wieder die ursprüngliche Aufteilung: Notenkarte links
            (4 von 12 Spalten), Themen rechts. Darunter stehen sie
            untereinander, die Note als flache Zeile statt hoher Karte. */}
        <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-12">
          {rating && (
            /* `lg:self-start`: Ohne diese Klasse zieht das Raster die
               Notenkarte auf die Höhe der Themenkarten daneben — nach dem
               Wegfall der Fussnote blieben darunter rund 200 px leere
               Fläche. */
            <div
              data-reveal
              className="card border p-4 sm:p-6 lg:col-span-4 lg:self-start lg:p-7"
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:block">
                <p className="flex items-baseline gap-1.5 lg:gap-2">
                  <span className="tnum font-display text-4xl font-bold text-primary sm:text-6xl">
                    {rating.value.toLocaleString("de-CH", { minimumFractionDigits: 1 })}
                  </span>
                  <span className="tnum text-base font-bold text-muted-foreground lg:text-xl">
                    / {rating.max}
                  </span>
                </p>

                <div
                  className="flex gap-0.5 text-accent lg:mt-3 lg:gap-1"
                  role="img"
                  aria-label={`${rating.value} von ${rating.max} Sternen bei ${rating.count} Bewertungen`}
                >
                  {Array.from({ length: rating.max }, (_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size={20}
                      filled
                      className={index < Math.round(rating.value) ? "" : "text-border"}
                    />
                  ))}
                </div>

                <p className="tnum w-full text-sm font-semibold sm:w-auto lg:mt-4 lg:text-base">
                  {rating.count} Bewertungen auf {rating.source}
                </p>

                <a
                  href={rating.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary-text underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-primary-hover lg:mt-3 lg:text-base"
                >
                  Bewertungen ansehen
                  <Icon name="external" size={18} />
                </a>
              </div>

            </div>
          )}

          {/* Wiederkehrende Themen */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:col-span-8">
          {content.themes.map((theme, index) => {
            const isLastOdd =
              content.themes.length % 2 === 1 && index === content.themes.length - 1;

            return (
              <li
                key={theme.id}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                className={
                  isLastOdd ? "sm:col-span-1" : undefined
                }
              >
                <article className="card flex h-full flex-col border p-4 sm:p-6">
                  {/* Wie bei den Gründen: auf dem Handy eine Zeile,
                      ab 640 px Icon oben und Titel darunter. */}
                  <div className="flex items-center gap-2.5 sm:block">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-accent/10 text-accent sm:h-12 sm:w-12 sm:rounded-sm">
                      <Icon name={theme.icon} size={22} />
                    </span>
                    <h3 className="min-w-0 break-words font-display text-[0.9375rem] leading-tight hyphens-auto sm:mt-5 sm:text-xl sm:leading-[1.06]">
                      {theme.label}
                    </h3>
                  </div>
                  {/* Kurzfassung auf dem Handy, ausformulierte ab 640 px. Beide
                      stehen im Markup; `hidden` blendet die jeweils andere
                      per display:none aus und nimmt sie damit auch aus dem
                      Vorlese-Baum. */}
                  {theme.textShort ? (
                    <>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-2 sm:hidden">
                        {theme.textShort}
                      </p>
                      <p className="hidden mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-2 sm:block">
                        {theme.text}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-2">{theme.text}</p>
                  )}
                </article>
              </li>
            );
          })}
          </ul>
        </div>

        {/* Echte Zitate, sobald welche freigegeben sind. */}
        {content.quotes.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {content.quotes.map((quote) => (
              <li key={quote.id} data-reveal>
                <figure className="card flex h-full flex-col border p-4 sm:p-6">
                  <div
                    className="flex gap-0.5 text-accent"
                    role="img"
                    aria-label={`Bewertung: ${quote.rating} von 5 Sternen`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon
                        key={index}
                        name="star"
                        size={16}
                        filled
                        className={index < quote.rating ? "" : "text-border"}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-relaxed">
                    „{quote.quote}“
                  </blockquote>
                  <figcaption className="mt-4 border-t border-border pt-3 text-sm">
                    <span className="font-bold">{quote.author}</span>
                    {quote.meta && (
                      <span className="ml-2 text-muted-foreground">{quote.meta}</span>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
