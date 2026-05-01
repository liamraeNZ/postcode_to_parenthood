import { useState } from 'react';
import type { ICBTreatmentPolicy } from '@/types';
import { getCycleColorClasses } from '@/utils/cycleColors';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface PolicyTabsProps {
  policies: ICBTreatmentPolicy[];
}

const TAB_ORDER = ['ivf', 'icsi', 'iui', 'di', 'fet'];

export function PolicyTabs({ policies }: PolicyTabsProps) {
  const sorted = [...policies].sort(
    (a, b) => (TAB_ORDER.indexOf(a.treatment_type_id) ?? 99) - (TAB_ORDER.indexOf(b.treatment_type_id) ?? 99)
  );
  const [activeId, setActiveId] = useState(sorted[0]?.treatment_type_id ?? 'ivf');
  const active = sorted.find((p) => p.treatment_type_id === activeId) ?? sorted[0];

  if (!active) return null;

  const bmiLabel =
    active.bmi_min != null || active.bmi_max != null
      ? `${active.bmi_min ?? '–'} to ${active.bmi_max ?? '–'}`
      : 'Not specified';

  return (
    <div>
      <div className="flex gap-1 mb-3 overflow-x-auto" role="tablist" aria-label="Treatment type">
        {sorted.map((p) => (
          <button
            key={p.treatment_type_id}
            role="tab"
            aria-selected={p.treatment_type_id === activeId}
            onClick={() => setActiveId(p.treatment_type_id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-green focus-visible:ring-offset-1 ${
              p.treatment_type_id === activeId
                ? 'bg-sage-dark text-white'
                : 'bg-warm-sand text-deep-slate/70 hover:bg-warm-sand-dark'
            }`}
          >
            {p.treatment_type_name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2" role="tabpanel">
        {(() => {
          const cc = getCycleColorClasses(active.cycles_offered);
          return (
            <div className={`p-2.5 rounded-lg ${cc.bg}`}>
              <div className={`text-[9px] uppercase font-bold opacity-70 mb-0.5 ${cc.label}`}>Cycles Offered</div>
              <div className={`text-base font-black leading-tight ${cc.text}`}>
                {active.cycles_offered > 0 ? (
                  <>{active.cycles_offered} Full</>
                ) : active.cycles_offered === 0 ? (
                  'Not funded'
                ) : (
                  'Not specified'
                )}
              </div>
            </div>
          );
        })()}

        <div className="p-2.5 bg-sage-light rounded-lg">
          <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">Age Range</div>
          <div className="text-base font-black text-deep-slate leading-tight">
            {active.min_age != null && active.max_age > 0
              ? `${active.min_age} – ${active.max_age}`
              : active.max_age > 0
                ? `Up to ${active.max_age}`
                : active.min_age != null
                  ? `${active.min_age}+`
                  : 'Not specified'}
          </div>
        </div>

        <div className="p-2.5 bg-sage-light rounded-lg">
          <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">BMI Range</div>
          <div className="text-base font-black text-deep-slate leading-tight">{bmiLabel}</div>
        </div>

        {(active.treatment_type_id !== 'iui' || (active.iui_rounds_required != null && active.iui_rounds_required > 0)) && (
          <div className="p-2.5 bg-sage-light rounded-lg">
            <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">
              Insemination Rounds
            </div>
            <div className="text-base font-black text-deep-slate leading-tight">
              {active.iui_rounds_required > 0 ? active.iui_rounds_required : 'None'}
            </div>
          </div>
        )}

        {active.amh_min_pmol != null && (
          <div className="p-2.5 bg-sage-light rounded-lg">
            <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">
              Min. AMH
            </div>
            <div className="text-base font-black text-deep-slate leading-tight">
              {active.amh_min_pmol} <span className="text-[10px] font-normal">pmol/L</span>
            </div>
          </div>
        )}

        {active.fsh_max_iu != null && (
          <div className="p-2.5 bg-sage-light rounded-lg">
            <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">
              Max. FSH
            </div>
            <div className="text-base font-black text-deep-slate leading-tight">
              {active.fsh_max_iu} <span className="text-[10px] font-normal">IU/L</span>
            </div>
          </div>
        )}

        <div className="p-2.5 bg-sage-light rounded-lg">
          <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">Smoking</div>
          <div className="flex items-center gap-1">
            {active.smoking_restricted ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-deep-slate">Non-smoker required</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-deep-slate">No restriction</span>
              </>
            )}
          </div>
        </div>

        <div className="p-2.5 bg-sage-light rounded-lg">
          <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">
            Endometriosis
          </div>
          <div className="flex items-center gap-1">
            {active.endometriosis_priority_access ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-deep-slate">Priority access</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-deep-slate/40 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-deep-slate">Standard</span>
              </>
            )}
          </div>
        </div>

        <div className="p-2.5 bg-sage-light rounded-lg col-span-2">
          <div className="text-[9px] uppercase font-bold text-deep-slate opacity-70 mb-0.5">Parental Status</div>
          <div className="text-xs font-bold text-deep-slate leading-snug">
            {active.living_children_rule || 'Not specified'}
          </div>
        </div>
      </div>

      {active.additional_notes && (
        <div className="mt-3 rounded-lg border border-warm-sand-dark overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-sage-light">
            <Info className="w-3.5 h-3.5 text-sage-dark" />
            <span className="font-semibold text-xs text-deep-slate">Additional Policy Notes</span>
          </div>
          <div className="px-3 py-2 text-xs text-deep-slate/80 leading-relaxed bg-cream">
            {active.additional_notes}
          </div>
        </div>
      )}
    </div>
  );
}
