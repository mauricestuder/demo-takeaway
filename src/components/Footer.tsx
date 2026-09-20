import Link from "next/link";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { telHref } from "@/lib/format";
import type { FooterContent, SiteConfig } from "@/lib/types";

interface FooterProps {
  content: FooterContent;
  site: SiteConfig;
}

export function Footer({ content, site }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t-2 border-border bg-surface-warm">
      <div className="container-page py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo withTagline />
            <p className="mt-5 leading-relaxed text-muted-foreground">{content.note}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent-text">
                Kontakt
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                <li>
                  <a
                    href={telHref(site.contact.phoneHref)}
                    className="tnum inline-flex min-h-11 items-center gap-2 font-bold transition-colors duration-200 hover:text-primary"
                  >
                    <Icon name="phone" size={18} className="text-primary" />
                    {site.contact.phone}
                  </a>
                </li>
                <li className="mt-2 text-muted-foreground">
                  {site.address.street}
                  <br />
                  <span className="tnum">{site.address.zip}</span> {site.address.city}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent-text">
                Seite
              </h2>
              <ul className="mt-4 flex flex-col">
                <li>
                  <a
                    href="#speisekarte"
                    className="inline-flex min-h-11 items-center font-medium transition-colors duration-200 hover:text-primary"
                  >
                    Speisekarte
                  </a>
                </li>
                <li>
                  <a
                    href="#besuch"
                    className="inline-flex min-h-11 items-center font-medium transition-colors duration-200 hover:text-primary"
                  >
                    Öffnungszeiten
                  </a>
                </li>
                {content.legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center font-medium transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t-2 border-border pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="tnum">
              © {year} {site.legalName ?? site.name}
            </p>
            <p>
              {site.address.city}, {site.address.region}
            </p>
          </div>

          {/* Pflichtangabe, keine Höflichkeit: Das Foto der Döner Box steht
              unter CC BY 2.0. Die Lizenz erlaubt auch die gewerbliche
              Nutzung, verlangt dafür aber Namen, Lizenz, Fundstelle und den
              Hinweis auf Bearbeitung — und zwar sichtbar auf der Seite, nicht
              nur in einer Datei im Repository. Alle übrigen Bilder stammen von
              Pexels und brauchen das nicht; fällt dieses eine Bild weg, kann
              der ganze Absatz mit.

              Die beiden Links führen nach aussen, laden aber nichts nach. Die
              Regel «keine Fremdanfragen zur Laufzeit» bleibt unberührt. */}
          <p className="mt-4 text-xs leading-relaxed">
            Foto «Döner Box»:{" "}
            <a
              href="https://www.flickr.com/photos/49814345@N04/54446966205"
              rel="noopener noreferrer"
              target="_blank"
              className="underline underline-offset-2 transition-colors duration-200 hover:text-primary"
            >
              Christian Frank
            </a>
            ,{" "}
            <a
              href="https://creativecommons.org/licenses/by/2.0/"
              rel="noopener noreferrer license"
              target="_blank"
              className="underline underline-offset-2 transition-colors duration-200 hover:text-primary"
            >
              CC BY 2.0
            </a>
            , bearbeitet (Ausschnitt und Farbe).
          </p>
        </div>
      </div>
    </footer>
  );
}
