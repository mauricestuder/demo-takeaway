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
    <footer className="relative border-t border-border bg-surface-warm">
      <div className="container-page py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo withTagline />
            <p className="mt-5 leading-relaxed text-muted-foreground">{content.note}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary-text">
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
              <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary-text">
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

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="tnum">
              © {year} {site.legalName ?? site.name}
            </p>
            <p>
              {site.address.city}, {site.address.region}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
