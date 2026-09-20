import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";

export const alt = "Firestone – Steakhouse & Grill in Liestal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Beim statischen Export (GitHub Pages) muss das Bild einmal beim Build
// erzeugt werden — ohne diese Angabe bricht `next build` ab.
export const dynamic = "force-static";

/**
 * Vorschaubild für WhatsApp, Instagram und Google.
 *
 * Wird beim Build automatisch erzeugt und passt sich an die Inhalte aus
 * content/site.json an — es muss also nie manuell nachgezeichnet werden.
 * Farben und Aufbau folgen denselben Tokens wie die Seite (globals.css):
 * Creme und Gold auf fast schwarzem Grund.
 *
 * Hinweis für spätere Änderungen: Satori (der Renderer hinter next/og)
 * verlangt bei mehreren Kindelementen ein explizites `display`. Textzeilen
 * werden deshalb als ein einziger String zusammengesetzt.
 */
export default async function OpengraphImage() {
  const site = await getSite();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(900px 520px at 85% 0%, #2a1a12 0%, #151210 55%, #100e0c 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 0,
              border: "3px solid #d4af5a",
              background: "#1a1613",
              color: "#d4af5a",
              fontSize: 46,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            F
          </div>
          <div
            style={{
              color: "#f1e8d8",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 8,
            }}
          >
            FIRESTONE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#d4af5a",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 8,
              marginBottom: 22,
            }}
          >
            {`${site.locality.toUpperCase()} · ${site.address.region.toUpperCase()}`}
          </div>
          <div
            style={{
              color: "#f1e8d8",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: 0,
              maxWidth: 940,
            }}
          >
            {`${site.tagline} — über Holzkohle gegrillt.`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#b3a48f",
            fontSize: 26,
          }}
        >
          <div style={{ width: 56, height: 2, background: "#d4af5a" }} />
          <span>
            {`${site.address.street}, ${site.address.zip} ${site.address.city}`}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
