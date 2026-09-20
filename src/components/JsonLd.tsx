import { toSchemaOpeningHours } from "@/lib/hours";
import type { Menu, OpeningHours, SiteConfig } from "@/lib/types";

interface JsonLdProps {
  site: SiteConfig;
  hours: OpeningHours;
  menu: Menu;
}

/**
 * Strukturierte Daten für Google (schema.org/Restaurant).
 *
 * Damit erscheinen Adresse, Öffnungszeiten und Speisekarte in der lokalen
 * Suche.
 *
 * Bewusst ohne `aggregateRating`: Die auf der Seite gezeigte Bewertung stammt
 * von einer Plattform und wurde nicht hier erhoben. Ein Betrieb, der fremde
 * Bewertungen auf der eigenen Seite auszeichnet, riskiert eine Abstrafung —
 * die Zahl steht deshalb sichtbar im Bewertungsbereich, aber nicht im Markup.
 */
export function JsonLd({ site, hours, menu }: JsonLdProps) {
  const { address, contact, seo } = site;

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${seo.siteUrl}/#restaurant`,
    name: site.name,
    description: seo.description,
    url: seo.siteUrl,
    telephone: contact.phoneHref,
    email: contact.email,
    priceRange: site.priceRange,
    servesCuisine: site.cuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.zip,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    ...(address.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: address.geo.lat,
            longitude: address.geo.lng,
          },
        }
      : {}),
    openingHours: toSchemaOpeningHours(hours),
    sameAs: site.social.map((link) => link.href),
    hasMenu: {
      "@type": "Menu",
      name: "Speisekarte",
      hasMenuSection: menu.categories.map((category) => ({
        "@type": "MenuSection",
        name: category.name,
        // Aufpreise sind keine Gerichte. Ohne den Filter stünde "Jede
        // weitere Zutat" für 1.00 als eigenes Menü-Element in den
        // strukturierten Daten — und könnte bei Google als Gericht erscheinen.
        hasMenuItem: category.items
          .filter((item) => item.kind !== "surcharge")
          .map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            ...(item.price !== null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: item.price.toFixed(2),
                    priceCurrency: menu.currency,
                  },
                }
              : {}),
          })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Der Inhalt stammt ausschliesslich aus den eigenen Content-Dateien.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
