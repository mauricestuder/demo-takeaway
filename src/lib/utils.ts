import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Klassen zusammenführen — der Standard-Helfer von shadcn/ui.
 *
 * `clsx` löst bedingte Klassen auf, `twMerge` entfernt anschliessend
 * Tailwind-Konflikte: Bei `cn("px-4", "px-8")` bleibt nur `px-8` übrig.
 * Genau das macht die `className`-Prop an shadcn-Komponenten überschreibbar.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
