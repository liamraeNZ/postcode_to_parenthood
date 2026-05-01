import { Link } from 'react-router';

export function Navbar() {
  return (
    <nav className="border-b border-warm-sand-dark bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-sage-btn rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
            F
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-deep-slate">
            FertilityFund <span className="text-sage-btn">UK</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Home
          </Link>
          <Link
            to="/search"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Search by Postcode
          </Link>
          <Link
            to="/map"
            className="text-sm md:text-base font-medium text-deep-slate hover:text-sage-btn transition-colors"
          >
            Map
          </Link>
        </div>
      </div>
    </nav>
  );
}
