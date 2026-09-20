import Link from "next/link";
import { Icon } from "./Icon";
import type { LegalDocument } from "@/lib/legal";

/**
 * Gemeinsames Gerüst für Impressum und Datenschutz.
 *
 * Bewusst schmal gesetzt (max-w-3xl) — Rechtstexte werden gelesen, nicht
 * überflogen, und lange Zeilen ermüden schnell.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article
      className="section"
      style={{ paddingTop: "calc(var(--header-height) + 3rem)" }}
    >
      <div className="container-page max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-text transition-colors duration-200 hover:text-primary-hover"
        >
          <Icon name="arrowRight" size={16} className="rotate-180" />
          Zurück zur Startseite
        </Link>

        <h1 className="mt-6 text-[clamp(2rem,7vw,3rem)]">{document.title}</h1>
        <p className="lead mt-4 max-w-none">{document.intro}</p>

        <div className="rule my-10" />

        <div className="flex flex-col gap-10">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
