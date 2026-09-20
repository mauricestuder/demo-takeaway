import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";

export const alt = "Sesam – Kebab & Take Away in Liestal";
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
 * warmes Rot auf hellem Grund, Gold als zweiter Akzent.
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
            "radial-gradient(900px 520px at 15% 0%, #fff7f5 0%, #fef2f2 55%, #fde4e4 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#dc2626",
              color: "#ffffff",
              fontSize: 46,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            S
          </div>
          <div
            style={{
              color: "#450a0a",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 6,
            }}
          >
            SESAM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#7c4a05",
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
              color: "#450a0a",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            {`${site.tagline} — frisch vom Drehspiess.`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#7c2d2d",
            fontSize: 26,
          }}
        >
          <div style={{ width: 56, height: 4, background: "#dc2626" }} />
          <span>
            {`${site.address.street}, ${site.address.zip} ${site.address.city}`}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
