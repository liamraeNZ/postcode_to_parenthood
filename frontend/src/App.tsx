import { Navbar } from './components/layout/Navbar';
import { TrustBar } from './components/layout/TrustBar';
import { Hero } from './components/home/Hero';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sparkles, BarChart3, Users } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-soft-bg font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          <Hero />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* Matching Grants Card */}
            <Card className="p-6 border border-gray-200 shadow-md rounded-xl bg-white">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                <span>Matching Grants (2)</span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-emerald-700 bg-emerald-50 border-emerald-100">
                  New Matches
                </Badge>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-100 transition-colors">LF</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">The Lister Grant 2026</div>
                    <div className="text-xs text-gray-500 underline decoration-gray-300">Eligibility: Low Income, BMI &lt; 30</div>
                  </div>
                  <div className="text-emerald-solid font-black">£5,000</div>
                </div>

                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-100 transition-colors">AF</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Access Fertility Refund</div>
                    <div className="text-xs text-gray-500">100% Refund Guarantee</div>
                  </div>
                  <div className="text-gray-400 font-medium text-xs">Private</div>
                </div>
              </div>
              <Button className="w-full mt-6 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 shadow-none">
                View All 42 Resources
              </Button>
            </Card>

            {/* Quick Stats / Info Card */}
            <Card className="p-6 border border-gray-200 shadow-md rounded-xl bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 -z-0" />
              <div className="relative z-10">
                <h3 className="font-bold text-gray-800 mb-4">Why FertilityFund?</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="bg-emerald-100 p-1.5 rounded-md mt-0.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">AI-powered eligibility matching against 40+ private trusts and regional NHS policies.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="bg-emerald-100 p-1.5 rounded-md mt-0.5">
                      <BarChart3 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">Real-time cost comparison between UK clinics and European "Refund Guarantee" schemes.</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <TrustBar />
    </div>
  );
}
