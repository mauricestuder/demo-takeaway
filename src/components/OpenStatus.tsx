"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getOpeningStatus, type OpeningStatus } from "@/lib/hours";
import type { OpeningHours } from "@/lib/types";

interface OpenStatusProps {
  hours: OpeningHours;
  /** Kompakte Variante ohne Zusatztext (z. B. im Header). */
  compact?: boolean;
  /**
   * Auf einem Foto statt auf hellem Grund. Der durchscheinende Hintergrund
   * wird dann deckend: Bei 10 % Deckkraft kommt das Bild durch und das
   * dunkle Grün steht praktisch auf dem Foto — im Kopfbereich war die Pille
   * dadurch nicht mehr lesbar.
   */
  onPhoto?: boolean;
  className?: string;
}

/**
 * Zeigt live an, ob das Lokal gerade geöffnet ist.
 *
 * Die Berechnung läuft bewusst im Browser: So stimmt der Status auch dann,
 * wenn die Seite statisch ausgeliefert und zwischengespeichert wird. Bis zur
 * Hydration bleibt der Platz reserviert, damit nichts springt.
 *
 * Der Zustand wird nicht nur über die Farbe transportiert, sondern immer auch
 * über den Text — Farbe allein darf keine Information tragen.
 */
export function OpenStatus({
  hours,
  compact = false,
  onPhoto = false,
  className = "",
}: OpenStatusProps) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpeningStatus(hours));
    update();
    // Einmal pro Minute reicht völlig und kostet praktisch nichts.
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [hours]);

  const isOpen = status?.state === "open" || status?.state === "closing-soon";

  return (
    <span
      // cn() löst Konflikte auf: Ein von aussen gesetztes "hidden" schlägt
      // jetzt das eigene "inline-flex". Vorher entschied die Reihenfolge im
      // Stylesheet — und die Pille blieb auf schmalen Geräten sichtbar.
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-full border-2 px-3 py-1 text-[0.8125rem] font-bold",
        isOpen
          ? onPhoto
            ? "border-success/40 bg-card text-success-text"
            : "border-success/30 bg-success/10 text-success"
          : "border-border bg-card text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${
          isOpen ? "animate-pulse-dot bg-success" : "bg-muted-foreground"
        }`}
      />
      {status ? (
        <>
          <span>{status.label}</span>
          {!compact && (
            <span className="tnum font-normal text-muted-foreground">
              {status.detail}
            </span>
          )}
        </>
      ) : (
        // Platzhalter mit identischer Höhe, verhindert Layout-Sprung.
        <span className="text-muted-foreground">Öffnungszeiten</span>
      )}
    </span>
  );
}
