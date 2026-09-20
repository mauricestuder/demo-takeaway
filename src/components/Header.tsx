"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { OpenStatus } from "./OpenStatus";
import { telHref } from "@/lib/format";
import type { OpeningHours, SiteConfig } from "@/lib/types";

const NAV = [
  { label: "Speisekarte", href: "#speisekarte" },
  { label: "Warum Firestone", href: "#highlights" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Besuch", href: "#besuch" },
];

interface HeaderProps {
  site: SiteConfig;
  hours: OpeningHours;
  /**
   * Liegt hinter dem Kopfbereich ein Foto? Nur dann darf die Kopfzeile im
   * ungescrollten Zustand hell schreiben. Ohne Foto faellt der Hero auf einen
   * hellen Verlauf zurueck — weisse Schrift waere dort unsichtbar.
   */
  heroHasPhoto?: boolean;
}

export function Header({ site, hours, heroHasPhoto = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Die Seite ist durchgehend dunkel, die Schrift bleibt also immer Creme.
  // Ueber dem Foto bekommt sie nur einen Schatten, damit sie auf hellen
  // Bildstellen (Rauch) nicht absaeuft.
  const aufFoto = heroHasPhoto && !scrolled && !menuOpen;
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Statt eines Scroll-Listeners beobachtet ein unsichtbarer Marker den
  // Seitenanfang. Das erspart Arbeit bei jedem einzelnen Scroll-Frame.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Bei offenem Menü: Seite fixieren, Rest der Seite stilllegen, Escape schliesst.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Ohne das bleibt der Inhalt hinter dem Menü per Tab erreichbar: Der Fokus
    // wandert dann in unsichtbare Elemente. `inert` nimmt sie gleichzeitig aus
    // dem Screenreader-Baum.
    const backdrop = [
      document.getElementById("hauptinhalt"),
      document.querySelector("footer"),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);

    backdrop.forEach((node) => node.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      backdrop.forEach((node) => node.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-1 w-full" />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-border bg-background/95 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
        style={{ height: "var(--header-height)" }}
      >
        <div className="container-page flex h-full items-center justify-between gap-4">
          {/* Führt zum Seitenanfang. Der Hover-Zustand ist nicht Zierde:
              Ohne ihn sieht die Wortmarke nicht anklickbar aus. */}
          <a
            href="#top"
            className="flex min-h-11 items-center rounded-sm opacity-100 transition-opacity duration-200 hover:opacity-70"
            aria-label={`${site.name} — zum Seitenanfang`}
          >
            <Logo onDark={aufFoto} />
          </a>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-sm px-3.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors duration-200 hover:text-primary ${
                      aufFoto ? "[text-shadow:0_1px_8px_rgba(16,14,12,0.7)]" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <OpenStatus hours={hours} compact onPhoto={aufFoto} className="hidden sm:inline-flex" />

            <a
              href={telHref(site.contact.phoneHref)}
              className="btn btn-primary hidden !min-h-11 !px-5 !text-[0.9375rem] sm:inline-flex"
            >
              <Icon name="phone" size={18} />
              Reservieren
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-12 w-12 cursor-pointer place-items-center rounded-sm border border-border bg-card text-foreground transition-colors duration-200 hover:border-primary hover:text-primary lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Menü schliessen" : "Menü öffnen"}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Abdunklung hinter dem Menü. Sie zeigt, dass die Seite weiterläuft,
          und schliesst das Menü bei Tipp daneben. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobiles Menü: fährt von rechts ein und nimmt nur einen Teil der
          Breite ein. Vorher deckte es die ganze Seite ab — für fünf Einträge
          zu viel, und der Bezug zur Seite ging verloren.

          Bewusst nicht `hidden`, sondern dauerhaft im Baum und nur
          verschoben: Ein ausgeblendetes Element kann nicht animiert
          einfahren. `inert` hält es solange aus Fokus und Vorlesereihenfolge
          heraus. */}
      {/* Die Fläche ist der Seitengrund, leicht durchscheinend und
          weichgezeichnet: Ohne den Weichzeichner liegt die Schrift
          stellenweise direkt auf den Kanten des Fotos. */}
      <div
        id="mobile-nav"
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={`fixed inset-y-0 right-0 z-40 w-[min(17.5rem,72vw)] border-l border-primary/30 bg-[rgba(16,14,12,0.88)] backdrop-blur-xl shadow-[-18px_0_50px_-24px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="flex h-full flex-col justify-between overflow-y-auto px-6 pb-10"
          style={{ paddingTop: "calc(var(--header-height) + 1.5rem)" }}
        >
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col">
              {NAV.map((item, index) => (
                <li key={item.href} className="border-b border-foreground/15">
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-xl font-semibold text-foreground"
                  >
                    {item.label}
                    <span className="tnum text-sm font-semibold tracking-[0.1em] text-primary-text">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            {/* `onPhoto` macht die Pille deckend. Ohne das steht das dunkle
                Grün des offenen Zustands auf 10 % Grünfläche — auf dieser
                dunklen Fläche wäre davon nichts mehr zu lesen. */}
            <OpenStatus hours={hours} compact onPhoto className="self-start" />
            <a
              href={telHref(site.contact.phoneHref)}
              className="btn btn-primary w-full"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="phone" size={20} />
              <span className="tnum">{site.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
