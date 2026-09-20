"use client";

import { useEffect, useState } from "react";
import { formatSlots, localMoment } from "@/lib/hours";
import type { OpeningHours, WeekdayKey } from "@/lib/types";

/**
 * Öffnungszeiten-Tabelle. Der heutige Tag wird nach der Hydration hervorgehoben
 * — bewusst erst im Browser, damit die Seite statisch gecacht werden kann und
 * trotzdem immer den richtigen Tag zeigt.
 *
 * "Heute" wird zusätzlich als Text ausgegeben, damit die Markierung nicht
 * allein von der Farbe abhängt.
 */
export function OpeningHoursTable({ hours }: { hours: OpeningHours }) {
  const [today, setToday] = useState<WeekdayKey | null>(null);

  useEffect(() => {
    const update = () => setToday(localMoment(hours.timezone).dayKey);
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [hours.timezone]);

  return (
    <div>
      <ul className="flex flex-col">
        {hours.days.map((day) => {
          const isToday = today === day.key;
          return (
            <li
              key={day.key}
              className={`flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors duration-300 ${
                isToday ? "bg-primary/[0.08]" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className={isToday ? "font-bold" : "font-medium"}>
                  {day.label}
                </span>
                {isToday && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-on-primary">
                    Heute
                  </span>
                )}
              </span>

              <span
                className={`tnum text-right ${
                  day.closed
                    ? "text-muted-foreground"
                    : isToday
                      ? "font-bold"
                      : "text-muted-foreground"
                }`}
              >
                {day.closed ? "Geschlossen" : formatSlots(day.slots)}
              </span>
            </li>
          );
        })}
      </ul>

      {hours.note && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          {hours.note}
        </p>
      )}
    </div>
  );
}
