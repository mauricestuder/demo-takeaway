import { LogoMark } from "./LogoMark";

interface LogoProps {
  /** Blendet die kleine Zeile unter dem Namen ein. */
  withTagline?: boolean;
  /** "sm" für die Kopfzeile, "xl" für die Markentafel im Hero. */
  size?: "sm" | "xl";
  /** Auf dunklem Grund werden Name und Zusatzzeile hell gesetzt. */
  onDark?: boolean;
  className?: string;
}

/**
 * Wortmarke: Bildmarke im Kasten, daneben der Name. Rein per CSS gesetzt und dadurch in jeder Grösse gestochen scharf —
 * später problemlos gegen ein echtes Logo (SVG) austauschbar.
 *
 * Kopfzeile und Hero zeigen dieselbe Marke, nur in zwei Grössen. Deshalb
 * liegen die Grössen hier zusammen und nicht verstreut in den Komponenten.
 */
export function Logo({
  withTagline = false,
  size = "sm",
  onDark = false,
  className = "",
}: LogoProps) {
  const isXl = size === "xl";

  return (
    <span className={`flex items-center ${isXl ? "gap-4 sm:gap-5" : "gap-2.5"} ${className}`}>
      <LogoMark
        className={`shrink-0 ${isXl ? "h-16 w-16 sm:h-20 sm:w-20" : "h-10 w-10"}`}
      />

      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight ${
            isXl ? "text-4xl sm:text-5xl" : "text-xl"
          } ${onDark ? "text-background" : "text-foreground"}`}
        >
          Sesam
        </span>
        {withTagline && (
          <span
            className={`font-bold uppercase ${
              isXl
                ? "mt-2.5 text-[0.6875rem] tracking-[0.2em] sm:mt-3 sm:text-xs sm:tracking-[0.26em]"
                : "mt-1.5 text-[0.6875rem] tracking-[0.16em]"
            } ${onDark ? "text-accent-on-dark" : "text-accent-text"}`}
          >
            Kebab &amp; Take Away
          </span>
        )}
      </span>
    </span>
  );
}
