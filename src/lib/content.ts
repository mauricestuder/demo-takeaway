import menuData from "@content/menu.json";
import hoursData from "@content/hours.json";
import pagesData from "@content/pages.json";
import siteData from "@content/site.json";
import reviewsData from "@content/reviews.json";

import type {
  Menu,
  OpeningHours,
  PagesContent,
  SiteConfig,
  ReviewsContent,
  SiteContent,
} from "./types";

/**
 * Zentrale Content-API.
 *
 * Alle Komponenten holen ihre Inhalte ausschliesslich über diese Funktionen.
 * Heute lesen sie die JSON-Dateien aus /content. Wenn später das Admin-Panel
 * dazukommt, wird nur der Inhalt dieser Datei gegen Datenbankabfragen getauscht
 * — die Signaturen bleiben identisch, deshalb sind alle Getter bereits async.
 */

export async function getSite(): Promise<SiteConfig> {
  return siteData as unknown as SiteConfig;
}

export async function getPages(): Promise<PagesContent> {
  return pagesData as unknown as PagesContent;
}

export async function getMenu(): Promise<Menu> {
  const menu = menuData as unknown as Menu;
  // Nicht verfügbare Artikel und leere Kategorien werden nie ausgeliefert.
  return {
    ...menu,
    categories: menu.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.available),
      }))
      .filter((category) => category.items.length > 0),
  };
}

export async function getHours(): Promise<OpeningHours> {
  return hoursData as unknown as OpeningHours;
}

export async function getReviews(): Promise<ReviewsContent> {
  return reviewsData as unknown as ReviewsContent;
}

export async function getContent(): Promise<SiteContent> {
  const [site, pages, menu, hours, reviews] = await Promise.all([
    getSite(),
    getPages(),
    getMenu(),
    getHours(),
    getReviews(),
  ]);

  return { site, pages, menu, hours, reviews };
}

/** Alle als `featured` markierten Gerichte über sämtliche Kategorien hinweg. */
export function getFeaturedItems(menu: Menu, limit = 4) {
  return menu.categories
    .flatMap((category) =>
      category.items
        .filter((item) => item.featured)
        .map((item) => ({ ...item, categoryName: category.name })),
    )
    .slice(0, limit);
}
