import Image from "next/image";
import { Icon } from "./Icon";
import { OpenStatus } from "./OpenStatus";
import { OpeningHoursTable } from "./OpeningHoursTable";
import { assetPath } from "@/lib/assets";
import { telHref } from "@/lib/format";
import type { OpeningHours, SiteConfig, VisitContent } from "@/lib/types";

interface VisitProps {
  content: VisitContent;
  site: SiteConfig;
  hours: OpeningHours;
}

export function Visit({ content, site, hours }: VisitProps) {
  const { address, contact } = site;
  const query =
    address.mapsQuery || `${site.name}, ${address.street}, ${address.zip} ${address.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section id="besuch" className="section relative">
      <div className="container-page">
        <header data-reveal className="max-w-2xl">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="lead mt-4">{content.intro}</p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {/* Linke Spalte: Zeiten, darunter der Anruf-Block.
              Die Karte endet jetzt nach den Zeiten. Vorher streckte das
              Raster sie auf die Höhe der Nachbarkarte, darunter standen rund
              370 px leeres Weiss. */}
          <div data-reveal className="flex flex-col gap-5 lg:col-span-5">
            <div className="card border p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex min-w-0 items-center gap-2.5 font-display text-xl sm:text-2xl">
                  <Icon name="clock" size={24} className="text-primary" />
                  Öffnungszeiten
                </h3>
                <OpenStatus hours={hours} compact />
              </div>

              <div className="mt-5">
                <OpeningHoursTable hours={hours} />
              </div>
            </div>

            {/* Reservation. Die Nummer steht zwar auch im Kopfbereich und in
                der Karte nebenan — dort aber ohne Anlass. Hier bekommt der
                Anruf einen Grund, sonst wäre es nur eine Wiederholung.

                Die Fläche ist bewusst nur leicht gold getönt: Ein ganzes Feld
                in Gold drückte den Rest des Abschnitts weg. Kräftig bleibt
                allein der Knopf — also genau das, was angeklickt werden soll. */}
            <div className="rounded-sm border border-primary/25 bg-primary/[0.07] p-6 sm:p-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary-text">
                Reservation
              </p>
              <p className="mt-2 font-display text-2xl font-semibold leading-tight">
                Rufen Sie an — wir halten Ihren Tisch frei.
              </p>

              <a
                href={telHref(contact.phoneHref)}
                className="btn btn-primary mt-5"
              >
                <Icon name="phone" size={20} />
                <span className="tnum">{contact.phone}</span>
              </a>

              <p className="mt-4 text-sm text-muted-foreground">
                Am Wochenende und ab sechs Personen empfehlen wir eine
                Reservation. Sagen Sie uns, wann Sie kommen — der Rest ist
                unsere Sache.
              </p>
            </div>
          </div>

          {/* Kontakt & Anfahrt */}
          <div
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="card flex flex-col border p-6 sm:p-8 lg:col-span-7"
          >
            <h3 className="flex items-center gap-2.5 font-display text-2xl">
              <Icon name="pin" size={24} className="text-primary" />
              Adresse &amp; Kontakt
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <address className="not-italic">
                <p className="font-bold">{site.name}</p>
                <p className="mt-1 text-muted-foreground">
                  {address.street}
                  <br />
                  <span className="tnum">{address.zip}</span> {address.city}
                  <br />
                  {address.region}
                </p>
                {address.hint && (
                  <p className="mt-3 text-sm text-muted-foreground">{address.hint}</p>
                )}
              </address>

              <div className="flex flex-col items-start gap-3">
                <a
                  href={telHref(contact.phoneHref)}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <Icon name="phone" size={20} />
                  <span className="tnum">{contact.phone}</span>
                </a>

                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-foreground underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-primary"
                  >
                    <Icon name="mail" size={20} className="text-primary" />
                    {contact.email}
                  </a>
                )}
              </div>
            </div>

            {/* Karte: fertiges Bild aus Kartenkacheln ohne Beschriftung,
                erzeugt von scripts/build-map.mjs. Bewusst keine eingebettete
                Live-Karte — die würde bei jedem Aufruf von fremden Servern
                nachladen, Cookies setzen und Ladezeit kosten. So bleibt die
                Seite frei von externen Requests, und die Datei ist mit rund
                35 KB sofort da.

                Bewusst nur ein Bild, kein Link und keine Beschriftung darauf:
                Die Adresse steht vollständig im Textblock darüber, der Aufruf
                zu Google Maps darunter. */}
            <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-sm border border-border sm:aspect-[16/7]">
              <Image
                src={assetPath("/images/karte.webp")}
                alt="Kartenausschnitt der Liestaler Altstadt. Der Standort ist mit einem goldenen Punkt markiert."
                fill
                sizes="(min-width: 1024px) 640px, 92vw"
                loading="eager"
                className="object-cover"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-foreground underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-primary-text"
              >
                <Icon name="pin" size={20} className="text-primary" />
                In Google Maps öffnen
                <Icon name="external" size={16} />
              </a>

              {/* Die ODbL verlangt die Nennung von OpenStreetMap. Die Karte ist
                  aus den Rohdaten selbst gezeichnet (scripts/build-map.mjs),
                  ein Kachel-Anbieter ist nicht zu nennen. */}
              <p className="text-xs text-muted-foreground">
                Kartendaten ©{" "}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors duration-200 hover:text-primary-text"
                >
                  OpenStreetMap
                </a>
                -Mitwirkende
              </p>
            </div>

            <dl className="mt-7 grid gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-2">
              {content.infos.map((info) => (
                <div key={info.label}>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-primary-text">
                    {info.label}
                  </dt>
                  <dd className="mt-1 font-medium">{info.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
