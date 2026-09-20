import Image from "next/image";
import { assetPath } from "@/lib/assets";
import type { ImageRef } from "@/lib/types";

interface SmartImageProps {
  image?: ImageRef | null;
  /**
   * CSS-Seitenverhältnis, z. B. "4 / 3". Verhindert Layout-Sprünge.
   * `null` überlässt das Verhältnis den Klassen (für responsive Varianten).
   */
  ratio?: string | null;
  /** Wird an next/image durchgereicht. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Fällt zurück, wenn im Bild kein `placeholderLabel` gesetzt ist. */
  fallbackLabel?: string;
}

/**
 * Bild mit gestaltetem Platzhalter.
 *
 * Solange in den Content-Dateien kein `src` hinterlegt ist, wird ein zum
 * Design passender Platzhalter im exakt gleichen Seitenverhältnis gezeichnet.
 * Sobald ein Pfad eingetragen ist, erscheint automatisch das echte Foto —
 * ohne Änderung am Layout und ohne Layout Shift.
 */
export function SmartImage({
  image,
  ratio = "4 / 3",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className = "",
  fallbackLabel = "Bild folgt",
}: SmartImageProps) {
  const hasImage = Boolean(image?.src);

  return (
    <div
      className={`relative overflow-hidden bg-muted ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {hasImage ? (
        <Image
          src={assetPath(image!.src)}
          alt={image!.alt}
          fill
          sizes={sizes}
          priority={priority}
          // Ohne das setzt next/image loading="lazy" und holt das Bild erst,
          // wenn es fast im Bild ist — dann sieht man es aufploppen.
          // `priority` bringt sein eigenes Laden mit, deshalb nur sonst.
          loading={priority ? undefined : "eager"}
          className="object-cover"
        />
      ) : (
        <Placeholder label={image?.placeholderLabel ?? fallbackLabel} />
      )}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center bg-surface-warm"
      role="img"
      aria-label={`Platzhalterbild: ${label}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(220,38,38,0.07) 0 2px, transparent 2px 12px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/55"
          aria-hidden="true"
        >
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="m3.5 17 4.8-4.4a2 2 0 0 1 2.7 0l3.2 3 2-1.8a2 2 0 0 1 2.7 0l1.6 1.5" />
        </svg>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
