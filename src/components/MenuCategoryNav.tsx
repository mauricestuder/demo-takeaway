"use client";

import { useEffect, useRef, useState } from "react";

interface MenuCategoryNavProps {
  categories: { id: string; name: string }[];
}

/**
 * Klebende Kategorie-Leiste über der Speisekarte.
 *
 * Alle Kategorien bleiben im Dokument (gut für Suchmaschinen und für Gäste,
 * die einfach durchscrollen). Die Leiste markiert per IntersectionObserver
 * nur, wo man sich gerade befindet, und scrollt auf Klick zur Kategorie.
 *
 * Die Reiter tragen ihren vollen Text und brechen nie um — bei vielen
 * Kategorien wird stattdessen horizontal gescrollt.
 */
export function MenuCategoryNav({ categories }: MenuCategoryNavProps) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(`kategorie-${category.id}`))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Die oberste sichtbare Kategorie gewinnt.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActive(visible.target.id.replace("kategorie-", ""));
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  // Aktiven Reiter auf schmalen Bildschirmen in den sichtbaren Bereich holen.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const button = list.querySelector<HTMLElement>(`[data-category="${active}"]`);
    if (!button) return;

    const offset = button.offsetLeft - list.clientWidth / 2 + button.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [active]);

  // z-20 und nicht höher: Die Abdunklung hinter dem mobilen Menü liegt auf
  // z-30. Bei gleichem Wert gewinnt das spätere Element im Dokument — und
  // das ist diese Leiste, weil die Kopfzeile vor dem Inhalt steht. Sie blieb
  // dadurch als einzige Fläche hell stehen, während der Rest der Seite
  // abgedunkelt war. Wer den Wert erhöht, holt den Fehler zurück.
  return (
    <div
      className="sticky z-20 -mx-[var(--page-gutter)] border-y border-border bg-background/95 px-[var(--page-gutter)] py-3 backdrop-blur-md"
      style={{ top: "var(--header-height)" }}
    >
      <ul
        ref={listRef}
        className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const isActive = active === category.id;
          return (
            <li key={category.id} className="shrink-0">
              <a
                href={`#kategorie-${category.id}`}
                data-category={category.id}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-sm border px-4 font-semibold transition-colors duration-200 ${
                  isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
