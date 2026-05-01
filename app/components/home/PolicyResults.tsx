import { Loader2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PolicyTabs } from './PolicyTabs';
import { IcbDocuments } from './IcbDocuments';
import type { PolicyPanelState } from './PostcodeSearch';

interface PolicyResultsProps {
  panel: PolicyPanelState;
}

export function PolicyResults({ panel }: PolicyResultsProps) {
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
