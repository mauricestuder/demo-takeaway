import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
// Beim statischen Export einmal beim Build erzeugen.
export const dynamic = "force-static";


/**
 * Die Testfassung auf GitHub Pages wird komplett für Suchmaschinen gesperrt.
 *
 * Das ist keine Vorsichtsmassnahme aus Prinzip: Auf der Seite stehen der echte
 * Name, die echte Adresse und die echte Telefonnummer eines bestehenden
 * Betriebs — bei noch unbestätigten Preisen und Öffnungszeiten. Eine
 * indexierte Testkopie würde den echten Auftritt konkurrenzieren und Gäste in
 * die Irre führen.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  const base = site.seo.siteUrl.replace(/\/$/, "");

  if (process.env.GITHUB_PAGES === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
