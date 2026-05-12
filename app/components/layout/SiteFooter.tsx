import { Link } from "react-router";
import { HeartHandshake } from "lucide-react";
import { TrustDisclaimer } from "@/components/shared/TrustDisclaimer";

const FOOTER_LINKS = [
  { to: "/search", label: "Check postcode" },
  { to: "/map", label: "Funding map" },
  { to: "/boards", label: "Health boards" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-warm-sand-dark/70 bg-paper/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-deep-slate">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sage-light to-blush/80 text-route-teal-dark shadow-sm">
                <HeartHandshake className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight">
                Pathway to Parenthood
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-deep-slate/75">
              Independent summaries of published NHS fertility funding policies across the UK, so you can see what your local pathway may include before you speak to your clinic or GP.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:justify-end md:gap-12">
            <nav aria-label="Footer">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-deep-slate/50">
                Explore
              </p>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm font-medium text-deep-slate/85 transition-colors hover:text-route-teal-dark"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/"
                    className="text-sm font-medium text-deep-slate/85 transition-colors hover:text-route-teal-dark"
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-warm-sand-dark/60 pt-8">
          <TrustDisclaimer className="max-w-2xl mb-4" />
          <p className="text-xs text-deep-slate/50">
            © {new Date().getFullYear()} Pathway to Parenthood. Not affiliated with the NHS.
          </p>
        </div>
      </div>
    </footer>
  );
}
