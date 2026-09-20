import legalData from "@content/legal.json";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  intro: string;
  sections: LegalSection[];
}

interface LegalContent {
  impressum: LegalDocument;
  datenschutz: LegalDocument;
}

export async function getLegal(
  key: keyof LegalContent,
): Promise<LegalDocument> {
  return (legalData as unknown as LegalContent)[key];
}
