"use client";

import { useEffect } from "react";

/**
 * Blendet alle Elemente mit `data-reveal` ein — einmalig beim Laden, nicht
 * beim Scrollen.
 *
 * Vorher hing das an einem IntersectionObserver: Jeder Block wurde erst
 * eingeblendet, wenn er in den Sichtbereich kam. Beim Scrollen sah man
 * dadurch fortlaufend Inhalte auftauchen — was sich anfühlt, als würde die
 * Seite noch laden, obwohl längst alles da ist.
 *
 * Jetzt ist beim ersten Bild bereits die ganze Seite aufgebaut. Was im
 * ersten Bildschirm steht, fährt weiterhin gestaffelt ein (die Verzögerungen
 * stecken in `--reveal-delay`); alles darunter wird gleichzeitig sichtbar
 * gesetzt, ausserhalb des Sichtfelds, wo es niemand als Animation wahrnimmt.
 *
 * Der Preis dafür: Der Einblend-Effekt beim Scrollen entfällt vollständig.
 * Das ist Absicht — er war genau das, was als Nachladen gelesen wurde.
 */
export function ScrollReveal() {
  useEffect(() => {
    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      element.setAttribute("data-reveal", "visible");
    }
  }, []);

  return null;
}
