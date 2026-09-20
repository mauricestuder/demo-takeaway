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
 * Kopfbereich: Foto über die volle Breite und fast die volle Höhe, die
 * Überschrift liegt direkt darauf. Keine Info-Karte daneben — die drei
 * Angaben, die ein Gast zuerst braucht (offen?, heute bis wann?, wo?), stehen
 * als schmale Zeile unter den Schaltflächen.
 *
 * Die Reservation ist die primäre Aktion, die Speisekarte die zweite: Wer ein
 * Steakhouse aufruft, will einen Tisch, nicht eine Bestellung zum Mitnehmen.
 *
 * Ohne hinterlegtes Foto (`hero.image.src` leer) bleibt der dunkle Grund mit
 * einem warmen Glutschimmer oben rechts — auch ohne Bild eine vollständige
 * Gestaltung.
 */
export function Hero({ hero, site, hours }: HeroProps) {
  const foto = hero.image?.src ? assetPath(hero.image.src) : null;

  const heute = hours.days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const zeitenHeute =
    heute && !heute.closed
      ? heute.slots.map((s) => `${s.open} – ${s.close}`).join(" · ")
      : "Heute geschlossen";

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-0px)] items-end overflow-hidden"
      style={{ paddingTop: "calc(var(--header-height) + 3rem)" }}
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
          {/* Der Schleier läuft von oben nach unten in den Seitengrund über:
              oben kommt das Foto durch, unten ist es praktisch der Grund.
              So sitzt der Text auf einer dunklen Fläche, und der Übergang zur
              nächsten Sektion braucht keine Kante. Der Farbwert ist der
              Seitengrund (#100e0c), nichts Eigenes.

              Die Werte sind nicht geschätzt: Der Rauch im Foto ist fast
              weiss, und das Foto selbst ist deshalb schon beim Zuschnitt
              auf 72 % Helligkeit gebracht. Mit diesem Verlauf erreicht die
              goldene Eyebrow auf dem hellsten Bildpunkt 4.6:1, die
              Überschrift 6.6:1. Nachzurechnen mit `npm run check:hero`. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(16,14,12,0.6)_0%,rgba(16,14,12,0.5)_30%,rgba(16,14,12,0.88)_72%,#100e0c_100%)]"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(90% 70% at 85% 10%, rgba(184,85,47,0.22), transparent 60%), linear-gradient(180deg, #151210 0%, #100e0c 100%)",
          }}
        />
      )}

      <div className="container-page pb-14 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{hero.eyebrow}</span>
            <OpenStatus hours={hours} onPhoto={!!foto} />
          </div>

          <h1
            className="mt-6 font-display font-semibold [text-shadow:0_2px_24px_rgba(16,14,12,0.6)]"
            style={{ fontSize: "clamp(3.25rem, 11vw, 7.5rem)", lineHeight: 0.96 }}
          >
            {hero.titleLines.map((line, index) => (
              <span
                key={line}
                data-reveal
                style={{ "--reveal-delay": `${60 + index * 90}ms` } as React.CSSProperties}
                className="block"
              >
                {/* Die letzte Zeile trägt das Gold. */}
                {index === hero.titleLines.length - 1 ? (
                  <span className="text-primary">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            data-reveal
            style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
            className="lead mt-7 text-foreground-soft [text-shadow:0_1px_12px_rgba(16,14,12,0.6)]"
          >
            {hero.subtitle}
          </p>

          <div
            data-reveal
            style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <a href={hero.primaryCta.href} className="btn btn-primary">
              <Icon name="phone" size={18} />
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-secondary backdrop-blur-sm">
              {hero.secondaryCta.label}
              <Icon name="arrowRight" size={18} />
            </a>
          </div>

          {/* Die drei Angaben, die ein Gast zuerst braucht. Eine Zeile mit
              feinen Trennlinien statt einer Karte — auf dem Handy bricht sie
              in Blöcke um. */}
          <dl
            data-reveal
            style={{ "--reveal-delay": "460ms" } as React.CSSProperties}
            className="mt-10 flex flex-col gap-4 border-t border-foreground/20 pt-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-foreground/20"
          >
            <div className="sm:pr-8">
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary-text">
                Heute
              </dt>
              <dd className="tnum mt-1 font-medium">{zeitenHeute}</dd>
            </div>
            <div className="sm:px-8">
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary-text">
                Adresse
              </dt>
              <dd className="mt-1 font-medium">
                {site.address.street}, <span className="tnum">{site.address.zip}</span>{" "}
                {site.address.city}
              </dd>
            </div>
            <div className="sm:pl-8">
              <dt className="sr-only">Auf einen Blick</dt>
              <dd className="mt-1">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {hero.facts.map((fact) => (
                    <li key={fact} className="flex items-center gap-1.5 text-[0.9375rem] font-medium">
                      <Icon name="check" size={16} className="shrink-0 text-primary" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
