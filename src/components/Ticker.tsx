"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface TickerProps {
  items: string[];
}

function Row({ items }: TickerProps) {
  return (
    <div className="flex shrink-0 items-center gap-7 pr-7">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-7">
          <span className="font-display text-base font-medium uppercase tracking-[0.2em] text-primary-text sm:text-lg">
            {item}
          </span>
          <span className="h-1 w-1 shrink-0 rotate-45 bg-primary/60" />
        </span>
      ))}
    </div>
  );
}

/**
 * Angebots-Laufband direkt unter dem Hero.
 *
 * Zwei identische Reihen, verschoben um 50 %: eine nahtlose Schleife aus einer
 * einzigen transform-Animation, die im Compositor läuft.
 *
 * Bewegung, die von selbst startet und länger als fünf Sekunden dauert, braucht
 * eine Möglichkeit zum Anhalten (WCAG 2.2.2). Das Band hält deshalb bei
 * Mauszeiger und Tastaturfokus an und lässt sich zusätzlich über eine
 * Schaltfläche dauerhaft stoppen. Bei `prefers-reduced-motion` steht es von
 * Anfang an still (siehe globals.css).
 *
 * Die Begriffe selbst sind für Screenreader ausgeblendet — sie kommen in der
 * Speisekarte als echte Überschriften vor. Die Schaltfläche steht bewusst
 * ausserhalb des ausgeblendeten Bereichs, sonst wäre sie nicht bedienbar.
 */
export function Ticker({ items }: TickerProps) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Bei reduzierter Bewegung steht das Band ohnehin still — dann ist eine
  // Stopp-Schaltfläche sinnlos und wird nicht angeboten.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className="group relative flex border-y border-border bg-surface-warm">
      <div aria-hidden="true" className="flex select-none overflow-hidden py-3.5">
        <div
          className="animate-ticker flex w-max"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          <Row items={items} />
          <Row items={items} />
        </div>
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? "Laufband fortsetzen" : "Laufband anhalten"}
          className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-sm text-primary-text/70 transition-colors duration-200 hover:bg-primary/15 hover:text-primary-text focus-visible:bg-primary/15 focus-visible:text-primary-text"
        >
          <Icon name={paused ? "play" : "pause"} size={18} filled />
        </button>
      )}
    </div>
  );
}
