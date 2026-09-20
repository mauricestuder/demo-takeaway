/**
 * Datenmodell der gesamten Website.
 *
 * Diese Typen sind die einzige Quelle der Wahrheit. Aktuell werden sie aus den
 * JSON-Dateien in /content geladen (siehe `src/lib/content.ts`). Sobald das
 * Admin-Panel dazukommt, liefert dieselbe API die Daten aus der Datenbank —
 * die Komponenten müssen dafür nicht angefasst werden.
 */

/* ------------------------------------------------------------------ */
/* Gemeinsame Bausteine                                                */
/* ------------------------------------------------------------------ */

/**
 * Ein Bild. Solange `src` leer ist, rendert die Website einen gestalteten
 * Platzhalter im richtigen Seitenverhältnis — dadurch entsteht beim späteren
 * Einsetzen echter Fotos kein Layout-Sprung.
 */
export interface ImageRef {
  /** Pfad ab /public, z. B. "/images/doener-teller.jpg". Leer = Platzhalter. */
  src: string;
  /** Bildbeschreibung für Screenreader und SEO. Immer ausfüllen. */
  alt: string;
  /** Kurzer Text, der im Platzhalter angezeigt wird (nur solange src leer ist). */
  placeholderLabel?: string;
}

export interface LinkRef {
  label: string;
  href: string;
  /** Öffnet den Link in einem neuen Tab. */
  external?: boolean;
}

/* ------------------------------------------------------------------ */
/* Stammdaten                                                          */
/* ------------------------------------------------------------------ */

export interface Address {
  street: string;
  zip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  /** Frei formulierter Hinweis, z. B. "2 Gehminuten vom Bahnhof". */
  hint?: string;
  /** Für die Karten-Verlinkung; leer lassen, dann wird die Adresse gesucht. */
  mapsQuery?: string;
  geo?: { lat: number; lng: number } | null;
}

export interface Contact {
  phone: string;
  /** Telefonnummer in internationalem Format für tel:-Links, z. B. "+41615551234". */
  phoneHref: string;
  email: string;
  whatsapp?: string;
}

export interface SocialLink {
  platform: "instagram" | "facebook" | "tiktok" | "google";
  label: string;
  href: string;
}

export interface Seo {
  /** Absolute Basis-URL der Live-Seite, z. B. "https://firestone-liestal.ch". */
  siteUrl: string;
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogImageAlt: string;
}

/** Harte Fakten zum Lokal, im Besuch-Bereich und im Hero verwendet. */
export interface SiteFacts {
  seating: string;
  takeaway: string;
  accessibility: string;
  payment: string;
  parking: string;
  station: string;
}

export interface SiteConfig {
  /** Restaurantname, erscheint überall auf der Seite. */
  name: string;
  /** Firmenname laut Handelsregister, nur im Impressum verwendet. */
  legalName?: string;
  /** Kurzer Zusatz, z. B. "Kebab & Take Away". */
  tagline: string;
  /** Ort für lokale Suche, z. B. "Liestal". */
  locality: string;
  /** Preisniveau für Google (z. B. "CHF" oder "$$"). */
  priceRange: string;
  /** Küchenrichtung für strukturierte Daten. */
  cuisine: string[];
  address: Address;
  contact: Contact;
  social: SocialLink[];
  seo: Seo;
  facts: SiteFacts;
  /**
   * Blendet den Demo-Hinweis oben auf der Seite ein. Auf `false` setzen,
   * sobald alle Platzhalter durch echte Inhalte ersetzt sind.
   */
  demoMode: boolean;
  demoNotice: string;
}

/* ------------------------------------------------------------------ */
/* Öffnungszeiten                                                      */
/* ------------------------------------------------------------------ */

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeSlot {
  /** "HH:MM" im 24-Stunden-Format. */
  open: string;
  /** "HH:MM". Werte über 24:00 hinaus (z. B. "01:30") gelten als Folgetag. */
  close: string;
}

export interface OpeningDay {
  key: WeekdayKey;
  label: string;
  shortLabel: string;
  closed: boolean;
  /** Mehrere Einträge ergeben z. B. eine Mittagspause. */
  slots: TimeSlot[];
}

export interface OpeningHours {
  /** IANA-Zeitzone. Für die Schweiz "Europe/Zurich". */
  timezone: string;
  days: OpeningDay[];
  /** Hinweis unter der Tabelle, z. B. zu Feiertagen. */
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Speisekarte                                                         */
/* ------------------------------------------------------------------ */

export type ItemBadge =
  | "vegetarisch"
  | "vegan"
  | "scharf"
  | "neu"
  | "beliebt"
  | "hausgemacht";

export interface MenuVariant {
  label: string;
  price: number | null;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Preis in der konfigurierten Währung. `null` zeigt "auf Anfrage". */
  price: number | null;
  /** Optionale Grössen/Varianten. Ist die Liste gefüllt, gilt `price` als "ab"-Preis. */
  variants?: MenuVariant[];
  badges?: ItemBadge[];
  image?: ImageRef | null;
  /**
   * "surcharge" kennzeichnet Zeilen, die kein Gericht sind, sondern ein
   * Aufpreis (z. B. "Jede weitere Zutat"). Sie stehen als kleine Fussnote
   * unter der Kategorie statt als gleichwertiger Eintrag im Raster.
   */
  kind?: "dish" | "surcharge";
  /** Wird in der Highlight-Sektion auf der Startseite hervorgehoben. */
  featured?: boolean;
  /** Auf `false` setzen, um den Artikel temporär auszublenden. */
  available: boolean;
  /** Zusatzstoffe/Allergene als Freitext. */
  allergens?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface Menu {
  /** Währungscode, z. B. "CHF". */
  currency: string;
  /**
   * Deutlich sichtbarer Hinweis über der Karte, solange die Preise noch nicht
   * bestätigt sind. Leeren String setzen, um ihn auszublenden.
   */
  priceNotice?: string;
  /** Hinweis unter der Karte, z. B. zu Allergenen. */
  note?: string;
  categories: MenuCategory[];
}

/* ------------------------------------------------------------------ */
/* Bewertungen                                                         */
/* ------------------------------------------------------------------ */

/**
 * Bewusst als Zusammenfassung modelliert statt als erfundene Einzelzitate:
 * Es werden nur die aggregierte Bewertung mit Quellenangabe und wiederkehrende
 * Themen gezeigt. Echte, freigegebene Zitate können später in `quotes`.
 */
export interface RatingSummary {
  value: number;
  max: number;
  count: number;
  /** Woher die Bewertung stammt, z. B. "Google". Wird sichtbar genannt. */
  source: string;
  sourceUrl: string;
}

export interface ReviewTheme {
  id: string;
  icon: IconName;
  label: string;
  text: string;
  /**
   * Kurzfassung fuer schmale Bildschirme. Auf dem Handy steht eine Karte
   * ueber die volle Breite; die ausformulierte Fassung laeuft dort ueber
   * rund zehn Zeilen. Fehlt das Feld, wird ueberall `text` gezeigt.
   */
  textShort?: string;
}

export interface ReviewQuote {
  id: string;
  quote: string;
  author: string;
  meta?: string;
  rating: number;
}

export interface ReviewsContent {
  eyebrow: string;
  title: string;
  intro?: string;
  rating: RatingSummary | null;
  themes: ReviewTheme[];
  /** Leer lassen, bis echte, freigegebene Zitate vorliegen. */
  quotes: ReviewQuote[];
  quotesPlaceholder?: string;
}

/* ------------------------------------------------------------------ */
/* Redaktionelle Texte                                                 */
/* ------------------------------------------------------------------ */

export interface HeroContent {
  eyebrow: string;
  /** Wird als eine Zeile pro Array-Eintrag gross gesetzt. */
  titleLines: string[];
  subtitle: string;
  primaryCta: LinkRef;
  secondaryCta: LinkRef;
  /** Kurze Vertrauensanker unter den Buttons. */
  facts: string[];
  image: ImageRef;
}

/** Icons stammen aus `src/components/Icon.tsx` (Phosphor). */
export type IconName = "flame" | "leaf" | "clock" | "train" | "hand" | "sparkle" | "pin";

/**
 * Farbrolle einer Karte. Die drei Werte entsprechen den Akzentfarben der
 * Palette; ohne Angabe bleibt es beim Rot.
 */
export type AccentTone = "primary" | "accent" | "success";

export interface Highlight {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  /**
   * Kurzfassung fuer schmale Bildschirme. Auf dem Handy steht eine Karte
   * ueber die volle Breite; die ausformulierte Fassung laeuft dort ueber
   * rund zehn Zeilen. Fehlt das Feld, wird ueberall `text` gezeigt.
   */
  textShort?: string;

  /** Kurze Kennzahl, erscheint als farbige Pille unter dem Text. */
  fact?: string;
  tone?: AccentTone;
}

export interface HighlightsContent {
  eyebrow: string;
  title: string;
  items: Highlight[];
}

export interface MenuSectionContent {
  /** Optional: Die Speisekarte trägt bewusst keinen — die Überschrift genügt. */
  eyebrow?: string;
  title: string;
  intro: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** Kleine Kennzahlen neben dem Text. */
  stats: { value: string; label: string }[];
  image: ImageRef;
}

export interface VisitContent {
  eyebrow: string;
  title: string;
  intro: string;
  /** Zusätzliche Hinweise, z. B. Parkplätze, Zahlungsmittel. */
  infos: { label: string; value: string }[];
}

export interface FooterContent {
  note: string;
  legalLinks: LinkRef[];
}

export interface PagesContent {
  hero: HeroContent;
  /** Kurze Schlagworte für das Laufband direkt unter dem Hero. */
  valueStrip: string[];
  highlights: HighlightsContent;
  menuSection: MenuSectionContent;
  about: AboutContent;
  visit: VisitContent;
  footer: FooterContent;
}

/* ------------------------------------------------------------------ */
/* Gesamtinhalt                                                        */
/* ------------------------------------------------------------------ */

export interface SiteContent {
  site: SiteConfig;
  pages: PagesContent;
  menu: Menu;
  hours: OpeningHours;
  reviews: ReviewsContent;
}
