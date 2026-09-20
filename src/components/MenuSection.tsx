import { Icon } from "./Icon";
import { MenuBadge } from "./MenuBadge";
import { MenuCategoryNav } from "./MenuCategoryNav";
import { SmartImage } from "./SmartImage";
import { getFeaturedItems } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import type { Menu, MenuItem, MenuSectionContent } from "@/lib/types";

interface MenuSectionProps {
  content: MenuSectionContent;
  menu: Menu;
}

/**
 * Speisekarte — der Hauptinhalt der Seite.
 *
 * Auf das Handy hin gebaut: Empfehlungen und Gerichte stehen ab 360 px zu
 * zweit nebeneinander statt untereinander. Das halbiert die Höhe der Karte,
 * ohne dass etwas verloren geht — auf dem Handy sucht man einen Namen und
 * einen Preis, nicht einen Fliesstext. Beschreibungen erscheinen deshalb erst
 * ab 640 px.
 *
 * Unter 360 px bleibt es bei einer Spalte: Dort wäre eine Zelle nur noch rund
 * 109 px breit — schmaler als das Abzeichen „Hausspezialität".
 */
export function MenuSection({ content, menu }: MenuSectionProps) {
  const featured = getFeaturedItems(menu, 4);

  return (
    <section id="speisekarte" className="section relative scroll-mt-24">
      <div className="container-page">
        {/* Bewusst flach gehalten: Der Weg zur Karte soll kurz sein, nicht
            zeremoniell. */}
        <header data-reveal className="max-w-2xl">
          {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
          <h2 className="section-title">{content.title}</h2>
          <p className="lead mt-2.5 sm:mt-4">{content.intro}</p>
        </header>

        {/* Preishinweis bewusst nicht ausblendbar, solange die Preise nicht
            bestätigt sind — er steht direkt über den ersten Beträgen. */}
        {menu.priceNotice && (
          <p
            data-reveal
            className="mt-5 flex items-start gap-2 rounded-xl border-2 border-accent/30 bg-accent/[0.07] px-3.5 py-2.5 text-sm font-semibold text-accent-text sm:mt-7 sm:gap-2.5 sm:px-4 sm:py-3 sm:text-[0.9375rem]"
          >
            <Icon name="sparkle" size={20} className="mt-0.5 shrink-0" />
            {menu.priceNotice}
          </p>
        )}

        {featured.length > 0 && (
          <ul className="mt-7 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {featured.map((item, index) => (
              <li
                key={item.id}
                data-reveal
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <article className="card h-full border-2 transition-colors duration-200 hover:border-primary">
                  <SmartImage
                    image={item.image}
                    ratio="4 / 3"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 46vw"
                    fallbackLabel={item.name}
                  />

                  <div className="p-3 sm:p-5">
                    <p className="hidden text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-accent-text sm:block">
                      {item.categoryName}
                    </p>
                    <h3 className="break-words font-display text-[0.9375rem] leading-snug hyphens-auto sm:mt-2 sm:text-xl">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 hidden text-[0.9375rem] text-muted-foreground sm:line-clamp-2 sm:block">
                      {item.description}
                    </p>
                    {/* "ab" wie in der vollständigen Karte: Die Döner Box
                        kostet je nach Grösse 10 oder 12 — ohne den Zusatz
                        stünde hier ein Festpreis, den es so nicht gibt. */}
                    <p className="tnum mt-2 text-[0.9375rem] font-bold text-primary-text sm:mt-4 sm:text-lg">
                      {item.variants?.length ? (
                        <span className="mr-1 text-xs font-semibold text-muted-foreground">
                          ab
                        </span>
                      ) : null}
                      {menu.currency} {formatPrice(item.price)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {/* Vollständige Karte */}
        <div className="mt-10 sm:mt-14">
          <MenuCategoryNav
            categories={menu.categories.map(({ id, name }) => ({ id, name }))}
          />

          <div className="mt-7 flex flex-col gap-8 sm:mt-10 sm:gap-12">
            {menu.categories.map((category) => (
              <section
                key={category.id}
                id={`kategorie-${category.id}`}
                aria-labelledby={`kategorie-${category.id}-titel`}
                className="scroll-mt-40"
              >
                <div
                  data-reveal
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:gap-x-4"
                >
                  <h3
                    id={`kategorie-${category.id}-titel`}
                    className="font-display text-xl sm:text-3xl"
                  >
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="hidden text-[0.9375rem] text-muted-foreground sm:block">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="rule mt-2.5 sm:mt-4" />

                {/* Ab 640 px wieder das ursprüngliche Raster: eine Spalte,
                    ab 1024 px zwei — mit Punktlinien-Zeilen statt Kästchen. */}
                <ul className="mt-3 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:mt-1 sm:grid-cols-1 sm:gap-x-12 sm:gap-y-0 lg:grid-cols-2">
                  {category.items
                    .filter((item) => item.kind !== "surcharge")
                    .map((item) => (
                      <li
                        key={item.id}
                        data-reveal
                        className="sm:border-b sm:border-border"
                      >
                        <MenuRow item={item} currency={menu.currency} />
                      </li>
                    ))}
                </ul>

                {/* Aufpreise stehen als Fussnote unter der Kategorie. Als
                    gleichwertige Zeile im Raster gelesen wirkte „Jede weitere
                    Zutat" wie ein Gericht für einen Franken. */}
                {category.items.some((item) => item.kind === "surcharge") && (
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 sm:mt-4">
                    {category.items
                      .filter((item) => item.kind === "surcharge")
                      .map((item) => (
                        <li
                          key={item.id}
                          className="flex items-baseline gap-1.5 text-sm"
                        >
                          <span aria-hidden="true" className="font-bold text-accent-text">
                            +
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {item.name}
                          </span>
                          {item.price !== null && (
                            <span className="tnum font-bold text-primary-text">
                              <span className="text-xs font-semibold text-muted-foreground">
                                {menu.currency}{" "}
                              </span>
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {menu.note && (
            <p className="mt-8 max-w-2xl text-sm text-muted-foreground">{menu.note}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function MenuRow({ item, currency }: { item: MenuItem; currency: string }) {
  const hasVariants = Boolean(item.variants?.length);

  return (
    // Auf dem Handy ein Kästchen, ab 640 px wieder die klassische Kartenzeile:
    // kein Rahmen, dafür Punktlinie und Hover-Fläche wie ursprünglich.
    <div className="h-full rounded-lg border border-border bg-card px-3 py-2.5 transition-colors duration-200 hover:border-primary sm:-mx-3 sm:h-auto sm:border-0 sm:bg-transparent sm:py-4 sm:hover:bg-card">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
        {/* break-words als harte Absicherung: Chrome trennt lange deutsche
            Komposita in schmalen Spalten auch mit hyphens-auto nicht. */}
        <h4 className="break-words text-[0.9375rem] font-bold leading-snug hyphens-auto sm:text-[1.0625rem]">
          {item.name}
        </h4>

        {/* Punktlinie wie auf einer klassischen Karte — auf dem Handy fehlt
            dafür schlicht die Breite. */}
        <span
          aria-hidden="true"
          className="hidden min-w-6 flex-1 translate-y-[-0.25rem] border-b-2 border-dotted border-border sm:block"
        />

        <span className="tnum mt-1.5 text-[0.9375rem] font-bold text-primary-text sm:mt-0 sm:shrink-0 sm:text-[1.0625rem]">
          {item.price === null ? (
            <span className="text-sm font-semibold text-muted-foreground">
              auf Anfrage
            </span>
          ) : (
            <>
              {hasVariants && (
                <span className="mr-1 text-xs font-semibold text-muted-foreground">
                  ab
                </span>
              )}
              <span className="mr-1 text-xs font-semibold text-muted-foreground">
                {currency}
              </span>
              {formatPrice(item.price)}
            </>
          )}
        </span>
      </div>

      {item.description && (
        <p className="mt-1 hidden max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground sm:mt-1.5 sm:block">
          {item.description}
        </p>
      )}

      {(hasVariants || (item.badges && item.badges.length > 0)) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-2.5 sm:gap-x-4 sm:gap-y-2">
          {item.variants?.map((variant) => (
            <span key={variant.label} className="tnum text-sm text-muted-foreground">
              {variant.label}{" "}
              <span className="font-semibold text-foreground">
                {currency} {formatPrice(variant.price)}
              </span>
            </span>
          ))}
          {item.badges?.map((badge) => <MenuBadge key={badge} badge={badge} />)}
        </div>
      )}
    </div>
  );
}
