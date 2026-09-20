"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const STORAGE_KEY = "sesam:demo-notice-dismissed";

/**
 * Hinweis, dass dies eine Beispielseite mit erfundenem Betrieb ist.
 *
 * Wird über `demoMode` in content/site.json gesteuert und verschwindet
 * vollständig, sobald dort `false` gesetzt ist.
 */
export function DemoNotice({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Erst nach der Hydration einblenden, damit kein Flackern entsteht.
    setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="container-page py-4">
      <div className="flex items-start gap-3 rounded-xl border-2 border-border bg-card px-4 py-3">
        <Icon name="sparkle" size={20} className="mt-0.5 shrink-0 text-accent" />
        <p className="flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {text}
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
          className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          aria-label="Hinweis ausblenden"
        >
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>
  );
}
