import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { assetPath } from "@/lib/assets";
import { getHours, getPages, getSite } from "@/lib/content";

/**
 * Schriftpaar: Playfair Display für Überschriften, Inter für Fliesstext. Beide
 * werden von next/font beim Build heruntergeladen und selbst ausgeliefert —
 * kein externer Font-Request zur Laufzeit, das spart Ladezeit und Cookie-Fragen.
 *
 * Playfair hat sehr dünne Haarstriche und verwäscht unter rund 16 px. Die
 * Seite setzt sie deshalb nur für Überschriften und Gerichtnamen ab 17 px;
 * alles Kleine läuft in Inter.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-family",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-family",
});

const isPreviewDeployment = process.env.GITHUB_PAGES === "true";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const { seo } = site;

  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      default: seo.title,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: site.name,
    authors: [{ name: site.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "de_CH",
      url: seo.siteUrl,
      siteName: site.name,
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    // Auf der Testfassung (GitHub Pages) zusätzlich zur robots.txt ein
    // noindex im Kopf der Seite: Die Seite trägt echte Betriebsdaten bei
    // unbestätigten Preisen und darf nicht im Index landen.
    robots: isPreviewDeployment
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
    icons: {
      // assetPath, weil Next.js den Basispfad bei Metadaten-Icons nicht
      // selbst voranstellt — siehe src/lib/assets.ts.
      //
      // SVG zuerst: skaliert verlustfrei. Das PNG daneben für Browser und
      // Vorschaudienste, die kein SVG-Favicon lesen. Für iOS eine eigene
      // randvolle Bitmap — dort wird SVG nicht unterstützt und das System
      // schneidet die Ecken selbst zu (erzeugt von scripts/build-icons.mjs).
      icon: [
        { url: assetPath("/icon.svg"), type: "image/svg+xml" },
        { url: assetPath("/icon-32.png"), type: "image/png", sizes: "32x32" },
      ],
      apple: assetPath("/apple-icon.png"),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#100e0c",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, hours, pages] = await Promise.all([getSite(), getHours(), getPages()]);

  return (
    <html lang="de-CH" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Ohne JavaScript bleiben alle Inhalte sichtbar. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-on-primary"
        >
          Zum Inhalt springen
        </a>

        <Header site={site} hours={hours} heroHasPhoto={!!pages.hero.image?.src} />

        <main id="hauptinhalt">{children}</main>

        <Footer content={pages.footer} site={site} />
        <ScrollReveal />
      </body>
    </html>
  );
}
