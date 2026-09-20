import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Angaben zum Betreiber.",
  robots: { index: false, follow: true },
};

export default async function ImpressumPage() {
  const document = await getLegal("impressum");
  return <LegalPage document={document} />;
}
