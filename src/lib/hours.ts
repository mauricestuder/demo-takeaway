import type { OpeningHours, TimeSlot, WeekdayKey } from "./types";

const WEEKDAY_ORDER: WeekdayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

const EN_SHORT_TO_KEY: Record<string, WeekdayKey> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

export interface LocalMoment {
  /** Wochentag in der Zeitzone des Restaurants. */
  dayKey: WeekdayKey;
  /** Minuten seit Mitternacht in der Zeitzone des Restaurants. */
  minutes: number;
}

/** Aktueller Zeitpunkt in der Zeitzone des Restaurants — unabhängig vom Gerät des Gastes. */
export function localMoment(timezone: string, now: Date = new Date()): LocalMoment {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const dayKey = EN_SHORT_TO_KEY[get("weekday")] ?? "mon";
  // "24" kommt in manchen Umgebungen für Mitternacht zurück.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  return { dayKey, minutes: hour * 60 + minute };
}

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

/** Endet der Slot nach Mitternacht, wird die Endzeit auf den Folgetag gerechnet. */
function slotRange(slot: TimeSlot): { start: number; end: number } {
  const start = toMinutes(slot.open);
  let end = toMinutes(slot.close);
  if (end <= start) end += 24 * 60;
  return { start, end };
}

function dayIndex(key: WeekdayKey): number {
  return WEEKDAY_ORDER.indexOf(key);
}

function shiftDay(key: WeekdayKey, offset: number): WeekdayKey {
  const index = (dayIndex(key) + offset + 7 * 10) % 7;
  return WEEKDAY_ORDER[index];
}

export function formatTime(time: string): string {
  return time;
}

export function formatSlots(slots: TimeSlot[]): string {
  if (slots.length === 0) return "Geschlossen";
  return slots.map((slot) => `${slot.open} – ${slot.close}`).join(" · ");
}

export type OpeningState = "open" | "closing-soon" | "opening-soon" | "closed";

export interface OpeningStatus {
  state: OpeningState;
  /** Kurzlabel für das Badge, z. B. "Jetzt geöffnet". */
  label: string;
  /** Ergänzung, z. B. "bis 22:00" oder "öffnet Montag, 11:00". */
  detail: string;
  todayKey: WeekdayKey;
}

/**
 * Berechnet, ob gerade geöffnet ist. Slots über Mitternacht hinaus werden
 * berücksichtigt, ebenso ein am Vortag begonnener Slot.
 */
export function getOpeningStatus(
  hours: OpeningHours,
  now: Date = new Date(),
): OpeningStatus {
  const { dayKey, minutes } = localMoment(hours.timezone, now);
  const byKey = new Map(hours.days.map((day) => [day.key, day]));

  // Läuft ein Slot, der gestern begonnen hat und über Mitternacht geht?
  for (const offset of [-1, 0] as const) {
    const key = shiftDay(dayKey, offset);
    const day = byKey.get(key);
    if (!day || day.closed) continue;

    // Bei offset -1 liegt "jetzt" um 24 h später im Zeitstrahl des Vortags.
    const reference = minutes + (offset === -1 ? 24 * 60 : 0);

    for (const slot of day.slots) {
      const { start, end } = slotRange(slot);
      if (reference >= start && reference < end) {
        const remaining = end - reference;
        return {
          state: remaining <= 30 ? "closing-soon" : "open",
          label: remaining <= 30 ? "Schliesst bald" : "Jetzt geöffnet",
          detail: `bis ${slot.close}`,
          todayKey: dayKey,
        };
      }
    }
  }

  // Nichts offen — nächste Öffnung innerhalb der kommenden sieben Tage suchen.
  for (let offset = 0; offset < 8; offset += 1) {
    const key = shiftDay(dayKey, offset);
    const day = byKey.get(key);
    if (!day || day.closed) continue;

    for (const slot of day.slots) {
      const start = toMinutes(slot.open);
      if (offset === 0 && start <= minutes) continue;

      if (offset === 0) {
        const untilOpen = start - minutes;
        return {
          state: untilOpen <= 60 ? "opening-soon" : "closed",
          label: untilOpen <= 60 ? "Öffnet bald" : "Geschlossen",
          detail: `ab ${slot.open}`,
          todayKey: dayKey,
        };
      }

      return {
        state: "closed",
        label: "Geschlossen",
        detail:
          offset === 1
            ? `morgen ab ${slot.open}`
            : `${day.label} ab ${slot.open}`,
        todayKey: dayKey,
      };
    }
  }

  return {
    state: "closed",
    label: "Geschlossen",
    detail: "Öffnungszeiten auf Anfrage",
    todayKey: dayKey,
  };
}

/** Öffnungszeiten im Format für schema.org (`openingHours`). */
export function toSchemaOpeningHours(hours: OpeningHours): string[] {
  const schemaDay: Record<WeekdayKey, string> = {
    mon: "Mo",
    tue: "Tu",
    wed: "We",
    thu: "Th",
    fri: "Fr",
    sat: "Sa",
    sun: "Su",
  };

  return hours.days.flatMap((day) =>
    day.closed
      ? []
      : day.slots.map((slot) => `${schemaDay[day.key]} ${slot.open}-${slot.close}`),
  );
}
