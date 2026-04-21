import type { ReactNode } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TrustBar } from './components/layout/TrustBar';
import { Hero } from './components/home/Hero';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sparkles, BarChart3 } from 'lucide-react';

type MatchingResource = {
  initials: string;
  initialsClassName: string;
  name: string;
  subtitle: string;
  subtitleClassName?: string;
  rightLabel: string;
  rightLabelClassName: string;
};

type WhyFeature = {
  icon: ReactNode;
  text: string;
};

const whyFeatures: WhyFeature[] = [
  {
    icon: <Sparkles className="w-4 h-4 text-emerald-700" />,
    text: 'AI-powered eligibility matching against 40+ private trusts and regional NHS policies.'
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-emerald-700" />,
    text: 'Real-time cost comparison between UK clinics and European "Refund Guarantee" schemes.'
  }
];

function WhyFertilityFundCard() {
  return (
    <Card className="p-6 border border-gray-200 shadow-md rounded-xl bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 -z-0" />
      <div className="relative z-10">
        <h3 className="font-bold text-gray-800 mb-4">Why FertilityFund?</h3>
        <div className="space-y-4">
          {whyFeatures.map((feature, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="bg-emerald-100 p-1.5 rounded-md mt-0.5">{feature.icon}</div>
              <p className="text-xs text-gray-600 leading-snug">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-soft-bg font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          <Hero />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <WhyFertilityFundCard />
          </section>
        </div>
      </main>

      <TrustBar />
    </div>
  );
}
