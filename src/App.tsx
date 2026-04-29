import type { ReactNode } from 'react';
import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TrustBar } from './components/layout/TrustBar';
import { Hero } from './components/home/Hero';
import { IcbDocuments } from './components/home/IcbDocuments';
import type { PolicyPanelState } from './components/home/PostcodeSearch';
import { Card, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Sparkles, BarChart3, Loader2 } from 'lucide-react';
import { PolicyTabs } from './components/home/PolicyTabs';

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

function PolicyResultsAside({ panel }: { panel: PolicyPanelState }) {
  const policiesResponse = panel.policiesResponse;

  return (
    <div className="space-y-4">
      <Card className="border-none border-l-4 border-l-sage-green shadow-md overflow-hidden rounded-xl bg-cream p-4">
        <div className="mb-3">
          <CardTitle className="text-deep-slate font-bold text-sm">
            {panel.selectedGP ? panel.selectedGP.name : 'Eligibility Result'}
          </CardTitle>
          {panel.isLoading ? (
            <Badge className="bg-sage-light text-deep-slate hover:bg-sage-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none mt-1">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading
              </span>
            </Badge>
          ) : policiesResponse ? (
            <p className="text-[0.7rem] font-medium text-deep-slate/70 mt-1 leading-snug">
              {policiesResponse.icb_name}
            </p>
          ) : null}
        </div>

        {panel.error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-4">
            {panel.error}
          </div>
        ) : null}

        {policiesResponse ? (
          <PolicyTabs policies={policiesResponse.policies} />
        ) : null}
      </Card>

      <IcbDocuments icbCode={panel.icbCode} />

      {policiesResponse ? (
        <div className="rounded-lg border border-warm-sand-dark bg-cream/60 p-4 text-xs text-deep-slate/70 leading-relaxed">
          <div className="font-bold text-deep-slate">Disclaimer on NHS funding data</div>
          <div className="mt-2 space-y-2">
            <p>
              We aim to keep the information accurate and current. The policy data is compiled from publicly available
              documents published by each Integrated Care Board (ICB).
            </p>
            <p>
              NHS IVF eligibility criteria can be updated with little notice, and some local exceptions may not be
              widely published. For the latest guidance on your circumstances, always confirm with your ICB or speak to
              your GP.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [policyPanel, setPolicyPanel] = useState<PolicyPanelState | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <div className="min-h-screen bg-warm-bg font-sans selection:bg-sage-light selection:text-deep-slate flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-12 gap-12">
          <Hero onPolicyPanelChange={setPolicyPanel} onSearchStarted={() => setHasSearched(true)} hasResults={!!(policyPanel && (policyPanel.policiesResponse || policyPanel.isLoading || policyPanel.error))} hasSearched={hasSearched} />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto pr-1">
                {policyPanel && (policyPanel.policiesResponse || policyPanel.isLoading || policyPanel.error) ? (
                  <PolicyResultsAside panel={policyPanel} />
                ) : (
                  <img
                    src="/assets/hand-hold.jpg"
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
    </div>
  );
}
