import Image from "next/image";
import { Icon } from "./Icon";
import { OpenStatus } from "./OpenStatus";
import { assetPath } from "@/lib/assets";
import type { HeroContent, OpeningHours, SiteConfig } from "@/lib/types";

interface HeroProps {
  hero: HeroContent;
  site: SiteConfig;
  hours: OpeningHours;
}

/**
 * Kopfbereich: Foto über die volle Breite, Text links, Info-Karte rechts.
 *
 * Die Karte „Heute bei uns" steht bewusst hier oben und nicht nur unter
 * „Besuch": Wer eine Take-away-Seite öffnet, will zuerst wissen, ob offen
 * ist und wo das Lokal liegt.
 *
 * Ohne hinterlegtes Foto (`hero.image.src` leer) fällt der Bereich auf den
 * hellen, warmen Verlauf zurück und setzt den Text dunkel. Es bleibt also
 * auch ohne Bild eine vollständige Gestaltung.
 */
export function Hero({ hero, site, hours }: HeroProps) {
  const foto = hero.image?.src ? assetPath(hero.image.src) : null;

  const heute = hours.days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const zeitenHeute =
    heute && !heute.closed
      ? heute.slots.map((s) => `${s.open} – ${s.close}`).join(", ")
      : "Heute geschlossen";

  return (
    <section
      id="top"
      className={`relative isolate overflow-hidden ${foto ? "" : "bg-surface-warm"}`}
      style={{ paddingTop: "calc(var(--header-height) + 2rem)" }}
    >
      {foto ? (
        <>
          <Image
            src={foto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* Der Schleier ist neutral-dunkel, nicht rot. Nachgemessen braucht
              ein roter und ein neutraler Schleier exakt dieselbe Deckkraft,
              um die Schrift lesbar zu halten — der Rotstich kostet also nur
              die Farben des Fotos und bringt nichts.

              Zwei Verläufe, weil der Text die Spalte wechselt:

              Ab 1024 px steht er links neben der Karte, also läuft der
              Verlauf waagrecht — links so dunkel, wie die Schrift es
              braucht, rechts deutlich heller. Dort liegt die deckende
              Karte, und ringsherum kommt das Foto durch.

              Darunter steht der Text über die volle Breite. Ein waagrechter
              Verlauf würde sein Ende bei 0.38 erwischen: Der Fliesstext kam
              dort auf 3.98:1 und lag damit unter dem Mindestwert. Deshalb
              auf dem Handy senkrecht und fast gleichmässig.

              Die Werte sind nicht geschätzt, sondern der jeweils kleinste
              Verlauf, bei dem alle vier Textebenen bestehen. Nachzurechnen
              mit `npm run check:hero`. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(38,24,20,0.64)_0%,rgba(38,24,20,0.58)_100%)] lg:bg-[linear-gradient(96deg,rgba(38,24,20,0.66)_0%,rgba(38,24,20,0.60)_44%,rgba(38,24,20,0.38)_100%)]"
          />
        </>
      ) : (
        /* Warmer Verlauf als Grundton, statisch und damit gratis. */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 80% at 78% 8%, rgba(220,38,38,0.10), transparent 58%), linear-gradient(180deg, #fff7f5 0%, #fef2f2 100%)",
          }}
        />
      )}

      <div className="container-page pb-14 sm:pb-20">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Textspalte */}
          <div
            className={`lg:col-span-6 ${
              foto
                ? "[&_.eyebrow]:text-background [&_.lead]:text-background [&_h1]:text-background"
                : ""
            }`}
          >
            <div data-reveal className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{hero.eyebrow}</span>
              {/* Auf dem Foto deckend — sonst steht dunkles Grün auf dem Bild. */}
              <OpenStatus hours={hours} onPhoto={!!foto} />
            </div>

            <h1
              className={`mt-6 font-display font-bold ${
                foto ? "[text-shadow:0_2px_18px_rgba(38,24,20,0.5)]" : ""
              }`}
              style={{ fontSize: "clamp(2.75rem, 9vw, 5.25rem)", lineHeight: 0.98 }}
            >
              {hero.titleLines.map((line, index) => (
                <span
                  key={line}
                  data-reveal
                  style={{ "--reveal-delay": `${60 + index * 70}ms` } as React.CSSProperties}
                  className="block"
                >
                  {/* Die letzte Zeile trägt den Hauptakzent. Auf dem Foto ein
                      helles Rosé statt des Palettenrots: Rot erreicht dort nur
                      1.5:1 und wäre praktisch unlesbar. */}
                  {index === hero.titleLines.length - 1 ? (
                    <span className={foto ? "text-border" : "text-primary"}>{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            <p
              data-reveal
              style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
              className={`lead mt-6 ${foto ? "[text-shadow:0_1px_10px_rgba(38,24,20,0.55)]" : ""}`}
            >
              {hero.subtitle}
            </p>

            {/* Genau eine primäre Aktion; der Anruf ist bewusst
                zurückhaltender gestaltet. */}
            <div
              data-reveal
              style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <a href={hero.primaryCta.href} className="btn btn-primary">
                {hero.primaryCta.label}
                <Icon name="arrowRight" size={20} />
              </a>
              <a
                href={hero.secondaryCta.href}
                className={
                  foto
                    ? "btn border-2 border-background/50 bg-foreground/40 text-background backdrop-blur-sm"
                    : "btn btn-secondary"
                }
              >
                <Icon name="phone" size={20} />
                <span className="tnum">{hero.secondaryCta.label}</span>
              </a>
            </div>
          </div>

          {/* Info-Karte: bewusst deckend, nicht durchscheinend. Auf einem Foto
              ist das die einzige Art, kleine Schrift unter allen Umständen
              lesbar zu halten — unabhängig davon, welches Bild später
              hinterlegt wird. */}
          <div
            data-reveal
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            className="lg:col-span-6"
          >
            <div className="card border-2 p-6 shadow-[0_28px_70px_-32px_rgba(38,24,20,0.7)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-5">
                <h2 className="font-display text-xl sm:text-2xl">Heute bei uns</h2>
                <OpenStatus hours={hours} compact />
              </div>

              <dl className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Icon name="clock" size={22} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-accent-text">
                      Heute geöffnet
                    </dt>
                    <dd className="tnum mt-1 font-bold">{zeitenHeute}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="pin" size={22} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-accent-text">
                      Adresse
                    </dt>
                    <dd className="mt-1 font-bold">
                      {site.address.street}, <span className="tnum">{site.address.zip}</span>{" "}
                      {site.address.city}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="hand" size={22} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-accent-text">
                      Vor Ort
                    </dt>
                    <dd className="mt-1.5">
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {hero.facts.map((fact) => (
                          <li
                            key={fact}
                            className="flex items-center gap-1.5 text-[0.9375rem] font-semibold"
                          >
                            <Icon name="check" size={17} className="shrink-0 text-primary" />
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
