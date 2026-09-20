const priceFormatter = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Preis in Schweizer Schreibweise, z. B. 12.50. `null` ergibt "auf Anfrage". */
export function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "auf Anfrage";
  return priceFormatter.format(value);
}

/** Telefonnummer für tel:-Links bereinigen. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
