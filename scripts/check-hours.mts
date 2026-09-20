/**
 * Kleiner Selbsttest für die Öffnungszeiten-Logik.
 *
 *   npm run check:hours
 *
 * Prüft die kniffligen Fälle: Mittagspause, Slots über Mitternacht, Ruhetage
 * und die Umrechnung in die Zeitzone des Restaurants.
 */
import { getOpeningStatus } from "../src/lib/hours.ts";
import type { OpeningHours } from "../src/lib/types.ts";

const hours: OpeningHours = {
  timezone: "Europe/Zurich",
  days: [
    {
      key: "mon",
      label: "Montag",
      shortLabel: "Mo",
      closed: false,
      slots: [
        { open: "11:00", close: "14:00" },
        { open: "17:00", close: "22:00" },
      ],
    },
    { key: "tue", label: "Dienstag", shortLabel: "Di", closed: true, slots: [] },
    {
      key: "wed",
      label: "Mittwoch",
      shortLabel: "Mi",
      closed: false,
      slots: [{ open: "11:00", close: "22:00" }],
    },
    {
      key: "thu",
      label: "Donnerstag",
      shortLabel: "Do",
      closed: false,
      slots: [{ open: "11:00", close: "22:00" }],
    },
    {
      key: "fri",
      label: "Freitag",
      shortLabel: "Fr",
      closed: false,
      slots: [{ open: "18:00", close: "02:00" }],
    },
    {
      key: "sat",
      label: "Samstag",
      shortLabel: "Sa",
      closed: false,
      slots: [{ open: "18:00", close: "02:00" }],
    },
    { key: "sun", label: "Sonntag", shortLabel: "So", closed: true, slots: [] },
  ],
};

/** [Zeitpunkt in UTC, erwarteter Zustand, Beschreibung] */
const cases: [string, string, string][] = [
  ["2026-08-17T10:00:00Z", "open", "Mo 12:00 – erster Slot offen"],
  ["2026-08-17T13:00:00Z", "closed", "Mo 15:00 – Mittagspause"],
  ["2026-08-17T19:40:00Z", "closing-soon", "Mo 21:40 – schliesst in 20 Minuten"],
  ["2026-08-17T08:30:00Z", "opening-soon", "Mo 10:30 – öffnet in 30 Minuten"],
  ["2026-08-18T12:00:00Z", "closed", "Di 14:00 – Ruhetag"],
  ["2026-08-21T22:30:00Z", "open", "Sa 00:30 – Slot vom Freitag über Mitternacht"],
  ["2026-08-22T18:00:00Z", "open", "Sa 20:00 – Abendbetrieb"],
  ["2026-08-16T12:00:00Z", "closed", "So 14:00 – geschlossen, öffnet Montag"],
];

let failures = 0;

for (const [iso, expected, label] of cases) {
  const status = getOpeningStatus(hours, new Date(iso));
  const local = new Intl.DateTimeFormat("de-CH", {
    timeZone: hours.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

  const ok = status.state === expected;
  if (!ok) failures += 1;

  console.log(
    `${ok ? "OK  " : "FAIL"} ${local}  → ${status.state.padEnd(13)} „${status.label} ${status.detail}“   (${label})`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} Abweichung(en).`);
  process.exit(1);
}

console.log("\nAlle Fälle wie erwartet.");
