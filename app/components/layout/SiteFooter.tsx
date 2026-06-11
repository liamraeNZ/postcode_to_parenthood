import { Link, useRouteLoaderData } from "react-router";
import { TrustDisclaimer } from "@/components/shared/TrustDisclaimer";

const NAV_LINKS = [
  { to: "/search", label: "Check postcode" },
  { to: "/map", label: "Funding map" },
  { to: "/boards", label: "Health boards" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
  { to: "/sources", label: "Sources" },
  { to: "/contact", label: "Contact" },
  { to: "/", label: "Home" },
] as const;

const LEGAL_LINKS = [
  { to: "/policies", label: "Policies" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
] as const;

function formatLastUpdated(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function SiteFooter() {
  const rootData = useRouteLoaderData("root") as { lastUpdated: string | null } | undefined;
  return (
    <footer className="mt-auto bg-brand-dark text-base">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 font-mono text-sm font-medium tracking-tight text-white">
                P2P
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight text-white">
                Postcode to Parenthood
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Independent summaries of published NHS fertility funding policies
              across the UK, so you can see what your local pathway may include
              before you speak to your clinic or GP.
            </p>
          </div>

          {/* Navigation column */}
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-end md:gap-12">
            <nav aria-label="Footer">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Explore
              </p>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Trust disclaimer */}
        <div className="mt-10">
          <TrustDisclaimer className="max-w-2xl text-white/60" />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {rootData?.lastUpdated && (
              <p className="text-xs text-white/60">
                ICB policy data last updated: {formatLastUpdated(rootData.lastUpdated)}
              </p>
            )}
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} Postcode to Parenthood. Not affiliated
              with the NHS.
            </p>
          </div>
          <nav aria-label="Legal" className="flex items-center gap-4">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                document.cookie =
                  "p2p-consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.reload();
              }}
              className="text-xs text-white/70 transition-colors hover:text-white"
            >
              Cookie preferences
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
