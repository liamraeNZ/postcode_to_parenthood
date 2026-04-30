import type { ReactNode } from 'react';
import { useState } from 'react';
import { TrustBar } from '../components/layout/TrustBar';
import { Hero } from '../components/home/Hero';
import { PolicyResults } from '../components/home/PolicyResults';
import type { PolicyPanelState } from '../components/home/PostcodeSearch';
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
    icon: <Sparkles className="w-4 h-4 text-sage-dark" />,
    text: 'Postcode → ICB lookup with a clear summary of key IVF eligibility criteria.'
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-sage-dark" />,
    text: 'Policy summaries compiled from publicly available ICB documents (always confirm with your ICB/GP).'
  }
];

export function HomePage() {
  const [policyPanel, setPolicyPanel] = useState<PolicyPanelState | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <>
      <main className="flex-1 container mx-auto px-3 sm:px-4 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-12 gap-4 md:gap-8 lg:gap-12">
          <Hero onPolicyPanelChange={setPolicyPanel} onSearchStarted={() => setHasSearched(true)} hasResults={!!(policyPanel && (policyPanel.policiesResponse || policyPanel.isLoading || policyPanel.error))} hasSearched={hasSearched} />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto pr-1">
                {policyPanel && (policyPanel.policiesResponse || policyPanel.isLoading || policyPanel.error) ? (
                  <PolicyResults panel={policyPanel} />
                ) : (
                  <img
                    src="/assets/hand-hold.webp"
                    alt="Two people holding hands in a supportive gesture"
                    className="rounded-2xl object-cover w-full max-h-[500px] shadow-lg"
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <TrustBar />
    </>
  );
}
