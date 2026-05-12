import { Link, useLocation } from "react-router";
import { Route } from "lucide-react";

interface NavLink {
  to: string;
  label: string;
  shortLabel: string;
  matchPaths: string[];
}

const NAV_LINKS: NavLink[] = [
  { to: "/map", label: "Funding map", shortLabel: "Map", matchPaths: ["/map"] },
  { to: "/boards", label: "Health boards", shortLabel: "Boards", matchPaths: ["/boards", "/board/"] },
];

export function Navbar() {
  const { pathname } = useLocation();

  function isActive(matchPaths: string[]): boolean {
    return matchPaths.some((path) =>
      path.endsWith("/") ? pathname.startsWith(path) : pathname === path
    );
  }

  const homeActive = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-warm-sand-dark/60 bg-white/88 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-4 md:px-8">
        <Link
          to="/"
          aria-label="Pathway to Parenthood home"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage-light via-white to-blush/90 shadow-sm ring-1 ring-warm-sand-dark/40 transition group-hover:shadow-md">
            <Route className="h-[1.15rem] w-[1.15rem] text-route-teal-dark" aria-hidden />
          </div>
          <span className="hidden min-w-0 truncate font-heading text-[1.05rem] font-semibold tracking-tight text-deep-slate sm:inline md:text-lg">
            Pathway to Parenthood
          </span>
          <span className="truncate font-heading text-base font-semibold tracking-tight text-route-teal-dark sm:hidden">
            P2P
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            aria-current={homeActive ? "page" : undefined}
            className={`hidden rounded-full px-3 py-2 text-sm font-medium transition-colors md:inline-flex ${
              homeActive
                ? "bg-sage-light/90 text-route-teal-dark"
                : "text-deep-slate/80 hover:bg-sage-light/50 hover:text-deep-slate"
            }`}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.matchPaths);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 ${
                  active
                    ? "bg-sage-light/90 text-route-teal-dark"
                    : "text-deep-slate/85 hover:bg-sage-light/45 hover:text-deep-slate"
                }`}
              >
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <Link
            to="/search"
            aria-current={pathname === "/search" ? "page" : undefined}
            className="ml-0.5 inline-flex shrink-0 items-center rounded-full bg-route-teal px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-route-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2 sm:ml-1 sm:px-4"
          >
            <span className="hidden sm:inline">Check eligibility</span>
            <span className="sm:hidden">Check</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
