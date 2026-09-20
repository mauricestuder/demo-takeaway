import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Informationen zum Umgang mit personenbezogenen Daten.",
  robots: { index: false, follow: true },
};

export default async function DatenschutzPage() {
  const document = await getLegal("datenschutz");
  return <LegalPage document={document} />;
}
