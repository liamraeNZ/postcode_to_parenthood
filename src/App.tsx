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
    text: 'Postcode → ICB lookup with a clear summary of key IVF eligibility criteria.'
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-emerald-700" />,
    text: 'Policy summaries compiled from publicly available ICB documents (always confirm with your ICB/GP).'
  }
];

function PolicyResultsAside({ panel }: { panel: PolicyPanelState }) {
  const policy = panel.policy;
  const bmiLabel =
    policy && (policy.bmi_min != null || policy.bmi_max != null)
      ? `${policy.bmi_min ?? '–'} to ${policy.bmi_max ?? '–'}`
      : 'Not specified';

  return (
    <div className="space-y-4">
      <Card className="border-none border-l-4 border-l-emerald-500 shadow-md overflow-hidden rounded-xl bg-white p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="min-w-0">
            <CardTitle className="text-gray-800 font-bold truncate">
              {panel.selectedGP ? panel.selectedGP.name : 'Eligibility Result'}
            </CardTitle>
            <div className="text-xs opacity-70 mt-1">
              {panel.postcode ? `Postcode ${panel.postcode.toUpperCase()}` : null}
              {panel.icbCode ? ` · ICB ${panel.icbCode}` : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {panel.isLoading ? (
              <Badge className="bg-emerald-light text-emerald-deep hover:bg-emerald-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading
                </span>
              </Badge>
            ) : policy ? (
              <Badge className="bg-emerald-light text-emerald-deep hover:bg-emerald-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                {policy.icb_name}
              </Badge>
            ) : null}
          </div>
        </div>

        {panel.error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-4">
            {panel.error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Cycles Offered</div>
            <div className="text-2xl font-black text-sage-text leading-tight">
              {policy ? (
                <>
                  {policy.cycles_offered} Full <span className="text-sm font-normal">Cycles</span>
                </>
              ) : (
                <span className="opacity-40">—</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Age Limit</div>
            <div className="text-2xl font-black text-sage-text leading-tight">
              {policy ? (
                <>Up to {policy.max_age}</>
              ) : (
                <span className="opacity-40">—</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">BMI</div>
            <div className="text-lg font-black text-sage-text leading-tight">
              {policy ? bmiLabel : <span className="opacity-40">—</span>}
            </div>
          </div>

          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Parental Status</div>
            <div className="text-sm font-bold text-sage-text leading-tight">
              {policy ? (policy.living_children_rule || 'Not specified') : <span className="opacity-40">—</span>}
            </div>
          </div>
        </div>

        {policy ? (
          <div className="mt-4 p-3 border border-dashed border-emerald-300 rounded-lg text-sm text-emerald-900 bg-emerald-50/30 space-y-1">
            <div>
              <strong>IUI rounds required:</strong> {policy.iui_rounds_required}
            </div>
            <div>
              <strong>Endometriosis priority:</strong> {policy.endometriosis_priority_access ? 'Yes' : 'No'}
            </div>
            <div className="opacity-75">Updated {new Date(policy.updated_at).toLocaleDateString()}</div>
          </div>
        ) : null}
      </Card>

      <IcbDocuments icbCode={panel.icbCode} />

      {policy ? (
        <div className="rounded-lg border border-gray-200 bg-white/60 p-4 text-xs text-gray-600 leading-relaxed">
          <div className="font-bold text-gray-800">Disclaimer on NHS funding data</div>
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

  return (
    <div className="min-h-screen bg-soft-bg font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-12">
          <Hero onPolicyPanelChange={setPolicyPanel} />
          
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto pr-1">
                {policyPanel && (policyPanel.policy || policyPanel.isLoading || policyPanel.error) ? (
                  <PolicyResultsAside panel={policyPanel} />
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>

      <TrustBar />
    </div>
  );
}
