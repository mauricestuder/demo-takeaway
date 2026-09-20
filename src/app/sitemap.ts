import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";
// Beim statischen Export einmal beim Build erzeugen.
export const dynamic = "force-static";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const base = site.seo.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/impressum`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
