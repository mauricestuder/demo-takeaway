import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  Clock,
  Envelope,
  Fire,
  HandHeart,
  Leaf,
  List,
  MapPin,
  Pause,
  Phone,
  Play,
  Sparkle,
  Star,
  Train,
  X,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Icon-Set der Seite.
 *
 * Bewusst eine einzige Familie (Phosphor) mit einheitlicher Strichstärke und
 * Rundung — gemischte Icon-Stile sind einer der häufigsten Gründe, warum eine
 * Seite unfertig wirkt. Importiert wird aus dem `/ssr`-Pfad, damit die Icons
 * serverseitig gerendert werden und kein Client-JavaScript nötig ist.
 */
const ICONS = {
  flame: Fire,
  leaf: Leaf,
  clock: Clock,
  train: Train,
  hand: HandHeart,
  sparkle: Sparkle,
  phone: Phone,
  pin: MapPin,
  mail: Envelope,
  arrowRight: ArrowRight,
  star: Star,
  menu: List,
  close: X,
  pause: Pause,
  play: Play,
  check: Check,
  external: ArrowSquareOut,
} satisfies Record<string, typeof Fire>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  /** Kantenlänge in px. Einheitliche Stufen: 16 / 20 / 24 / 32. */
  size?: number;
  /** Gefüllt statt als Kontur zeichnen (z. B. für Sterne). */
  filled?: boolean;
  className?: string;
}

export function Icon({ name, size = 24, filled = false, className }: IconProps) {
  const Component = ICONS[name];

  return (
    <Component
      size={size}
      weight={filled ? "fill" : "regular"}
      className={className}
      // Icons sind hier immer dekorativ: Sie stehen entweder neben sichtbarem
      // Text oder das umgebende Element trägt ein aria-label.
      aria-hidden="true"
      focusable={false}
    />
  );
}
