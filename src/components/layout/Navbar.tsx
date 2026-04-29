import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const scrollToLookup = () => {
    const target = document.getElementById('postcode-search');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="border-b border-warm-sand-dark bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage-btn rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-deep-slate">
            FertilityFund <span className="text-sage-btn">UK</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={scrollToLookup} className="bg-sage-dark hover:bg-sage-hover text-white rounded-full px-5 h-11 text-sm font-semibold shadow-sm">
            Check ICB policy
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden min-w-11 min-h-11">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
