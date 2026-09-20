import type { ItemBadge } from "@/lib/types";

/**
 * Kennzeichnung an einem Gericht.
 *
 * Jede Kennzeichnung trägt ihren Text sichtbar — die Farbe ist nur eine
 * Verstärkung, nie der alleinige Träger der Information. Alle Kombinationen
 * liegen über 4.5:1 auf ihrem eigenen Hintergrund.
 */
const STYLES: Record<ItemBadge, string> = {
  vegetarisch: "border-success/35 bg-success/10 text-success",
  vegan: "border-success/35 bg-success/10 text-success",
  scharf: "border-primary/35 bg-primary/10 text-primary-text",
  neu: "border-accent/40 bg-accent/10 text-accent-text",
  beliebt: "border-accent/40 bg-accent/10 text-accent-text",
  hausgemacht: "border-border bg-muted text-muted-foreground",
};

const LABELS: Record<ItemBadge, string> = {
  vegetarisch: "Vegetarisch",
  vegan: "Vegan",
  scharf: "Scharf",
  neu: "Neu",
  beliebt: "Beliebt",
  hausgemacht: "Hausspezialität",
};

export function MenuBadge({ badge }: { badge: ItemBadge }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] ${STYLES[badge]}`}
    >
      {LABELS[badge]}
    </span>
  );
}
