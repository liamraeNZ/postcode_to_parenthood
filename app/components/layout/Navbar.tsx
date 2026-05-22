import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

interface NavLink {
  to: string;
  label: string;
  matchPaths: string[];
}

const NAV_LINKS: NavLink[] = [
  { to: "/", label: "Home", matchPaths: ["/"] },
  { to: "/map", label: "Funding map", matchPaths: ["/map"] },
  { to: "/boards", label: "Health boards", matchPaths: ["/boards", "/board/"] },
  { to: "/about", label: "About", matchPaths: ["/about"] },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(matchPaths: string[]): boolean {
    return matchPaths.some((path) =>
      path.endsWith("/") && path !== "/"
        ? pathname.startsWith(path)
        : pathname === path
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-tint/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-8 max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Postcode to Parenthood home"
          className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-surface font-mono text-sm font-medium">
            P2P
          </div>
          <span className="hidden font-heading text-lg font-semibold tracking-tight text-ink sm:inline">
            Postcode to Parenthood
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.matchPaths);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`nav-link relative px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-brand"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/search"
            aria-current={pathname === "/search" ? "page" : undefined}
            className="ml-3 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-surface shadow-sm transition-all hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 btn-press"
          >
            Check eligibility
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2"
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <div className="flex h-5 w-6 flex-col items-center justify-center">
            <span
              className={`block h-0.5 w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                mobileOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-ink transition-all duration-300 ease-out mt-1.5 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-ink transition-all duration-300 ease-out mt-1.5 ${
                mobileOpen ? "-translate-y-[10px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-tint/20 bg-surface/95 backdrop-blur-md px-4 pb-6 pt-4">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.matchPaths);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={`border-t border-tint/10 px-2 py-3 text-base font-medium transition-colors first:border-t-0 ${
                    active
                      ? "text-brand"
                      : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/search"
              aria-current={pathname === "/search" ? "page" : undefined}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-base font-semibold text-surface shadow-sm transition-all hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2 btn-press"
            >
              Check eligibility
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
