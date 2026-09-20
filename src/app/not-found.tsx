import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "Seite nicht gefunden",
};

export default function NotFound() {
  return (
    <section
      className="relative flex min-h-[70vh] items-center"
      style={{ paddingTop: "var(--header-height)" }}
    >
      <div className="container-page text-center">
        <p className="tnum font-display text-[clamp(4rem,18vw,9rem)] font-bold leading-none text-secondary/45">
          404
        </p>
        <h1 className="-mt-4 text-[clamp(1.75rem,6vw,2.75rem)]">
          Diese Seite gibt es nicht
        </h1>
        <p className="lead mx-auto mt-4">
          Vielleicht wurde sie verschoben oder die Adresse enthält einen Tippfehler.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Zur Startseite
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
}
