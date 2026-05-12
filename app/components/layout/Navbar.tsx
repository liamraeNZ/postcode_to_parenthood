import { Link, useLocation } from 'react-router';
import { Route } from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
  shortLabel: string;
  matchPaths: string[];
}

const NAV_LINKS: NavLink[] = [
  { to: "/search", label: "Check Postcode", shortLabel: "Postcode", matchPaths: ["/search"] },
  { to: "/policies", label: "Local Policies", shortLabel: "Policies", matchPaths: ["/policies", "/policy/"] },
  { to: "/map", label: "Funding Map", shortLabel: "Map", matchPaths: ["/map"] },
];

export function Navbar() {
  const { pathname } = useLocation();

  function isActive(matchPaths: string[]): boolean {
    return matchPaths.some((path) =>
      path.endsWith("/") ? pathname.startsWith(path) : pathname === path
    );
  }

  return (
    <nav className="border-b border-warm-sand-dark bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Pathway to Parenthood home"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2"
        >
          <div className="w-9 h-9 bg-deep-slate rounded-lg flex items-center justify-center text-white">
            <Route className="w-5 h-5 text-route-teal" aria-hidden="true" />
          </div>
          <span className="hidden sm:inline text-xl font-bold tracking-tight text-deep-slate">
            Pathway to Parenthood
          </span>
          <span className="sm:hidden text-base font-bold tracking-tight text-sage-btn">
            P2P
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.matchPaths);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`text-sm md:text-base font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center px-2 sm:px-0 sm:min-h-0 sm:min-w-0 sm:inline-flex ${
                  active
                    ? "text-sage-btn border-b-2 border-sage-btn"
                    : "text-deep-slate hover:text-sage-btn"
                }`}
              >
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
