import { About } from "@/components/About";
import { DemoNotice } from "@/components/DemoNotice";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { JsonLd } from "@/components/JsonLd";
import { MenuSection } from "@/components/MenuSection";
import { Ticker } from "@/components/Ticker";
import { Visit } from "@/components/Visit";
import { getContent } from "@/lib/content";

/**
 * Reihenfolge nach dem Hero-Centric-Muster:
 * Hero (dominant, eine primäre Aktion) → Angebotsstreifen → Speisekarte als
 * Hauptinhalt → Gründe → Über uns → Besuch.
 */
export default async function HomePage() {
  const { site, pages, menu, hours } = await getContent();

  return (
    <>
      <JsonLd site={site} hours={hours} menu={menu} />

      <Hero hero={pages.hero} site={site} hours={hours} />

      <Ticker items={pages.valueStrip} />

      {site.demoMode && <DemoNotice text={site.demoNotice} />}

      <MenuSection content={pages.menuSection} menu={menu} />

      <Highlights content={pages.highlights} />

      <About content={pages.about} />

      <Visit content={pages.visit} site={site} hours={hours} />
    </>
  );
}
