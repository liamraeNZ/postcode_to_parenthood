import { Link } from 'react-router';
import { Route } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-warm-sand-dark bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Pathways to Parenthood home"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-deep-slate rounded-lg flex items-center justify-center text-white">
            <Route className="w-4 h-4 md:w-5 md:h-5 text-route-teal" aria-hidden="true" />
          </div>
          <span className="text-base md:text-xl font-bold tracking-tight text-deep-slate">
            Pathways <span className="hidden sm:inline">to Parenthood</span>{" "}
            <span className="text-sage-btn">P2P</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            to="/search"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Check Postcode
          </Link>
          <Link
            to="/policies"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Local Policies
          </Link>
          <Link
            to="/map"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Funding Map
          </Link>
        </div>
      </div>
    </nav>
  );
}
