import { Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-solid rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-sage-text">
            FertilityFund <span className="text-emerald-solid">UK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-emerald-solid transition-colors">Funding Map</a>
          <a href="#" className="hover:text-emerald-solid transition-colors">Grant Database</a>
          <a href="#" className="hover:text-emerald-solid transition-colors">Refund Schemes</a>
          <a href="#" className="hover:text-emerald-solid transition-colors">Eligibility Quiz</a>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-sage-btn hover:bg-sage-text text-white rounded-full px-5 py-2 text-sm font-semibold shadow-sm">
            Get Funded
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
