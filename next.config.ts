import type { NextConfig } from "next";

/**
 * Für GitHub Pages wird die Seite als statische Dateien exportiert.
 *
 * Der Schalter hängt an einer Umgebungsvariablen, damit `npm run dev` und
 * `npm start` lokal unverändert weiterlaufen: Im Export-Modus unterstützt
 * Next.js weder `headers()` noch die Bildoptimierung, und die Seite liegt
 * unter einem Unterpfad (`/<repo>/`) statt an der Wurzel.
 */
const isPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Der Basispfad muss auch im Browser bekannt sein: next/image hängt ihn
  // bei `unoptimized` nicht selbst an die Bildpfade. Siehe src/lib/assets.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  compress: true,

  ...(isPagesBuild
    ? {
        output: "export" as const,
        // Ohne abschliessenden Schrägstrich liefert GitHub Pages
        // /impressum nicht aus.
        trailingSlash: true,
        basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        images: {
          // Der Optimierungs-Server fehlt beim statischen Export.
          unoptimized: true,
        },
      }
    : {
        images: {
          // Echte Fotos später einfach in /public/images ablegen — moderne
          // Formate werden dann automatisch ausgeliefert.
          formats: ["image/avif" as const, "image/webp" as const],
          deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                {
                  key: "Permissions-Policy",
                  value:
                    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
