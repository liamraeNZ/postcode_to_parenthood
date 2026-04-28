import { useState } from 'react';
import type { ICBTreatmentPolicy } from '@/types';
import { getCycleColorClasses } from '@/utils/cycleColors';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight, Info } from 'lucide-react';

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
      <div className="flex gap-1 mb-4 overflow-x-auto" role="tablist" aria-label="Treatment type">
        {sorted.map((p) => (
          <button
            key={p.treatment_type_id}
            role="tab"
            aria-selected={p.treatment_type_id === activeId}
            onClick={() => setActiveId(p.treatment_type_id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              p.treatment_type_id === activeId
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.treatment_type_name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4" role="tabpanel">
        {(() => {
          const cc = getCycleColorClasses(active.cycles_offered);
          return (
            <div className={`p-3 rounded-lg ${cc.bg}`}>
              <div className={`text-[10px] uppercase font-bold opacity-70 mb-1 ${cc.label}`}>Cycles Offered</div>
              <div className={`text-2xl font-black leading-tight ${cc.text}`}>
                {active.cycles_offered > 0 ? (
                  <>{active.cycles_offered} Full <span className="text-sm font-normal">Cycles</span></>
                ) : active.cycles_offered === 0 ? (
                  'Not funded'
                ) : (
                  'Not specified'
                )}
              </div>
            </div>
          );
        })()}

        <div className="p-3 bg-sage rounded-lg">
          <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Age Range</div>
          <div className="text-2xl font-black text-sage-text leading-tight">
            {active.min_age != null && active.max_age > 0
              ? `${active.min_age} – ${active.max_age}`
              : active.max_age > 0
                ? `Up to ${active.max_age}`
                : active.min_age != null
                  ? `${active.min_age}+`
                  : 'Not specified'}
          </div>
        </div>

        <div className="p-3 bg-sage rounded-lg">
          <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">BMI Range</div>
          <div className="text-lg font-black text-sage-text leading-tight">{bmiLabel}</div>
        </div>

        {(active.treatment_type_id !== 'iui' || (active.iui_rounds_required != null && active.iui_rounds_required > 0)) && (
          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">
              Insemination Rounds Before Treatment
            </div>
            <div className="text-2xl font-black text-sage-text leading-tight">
              {active.iui_rounds_required > 0 ? active.iui_rounds_required : 'None'}
            </div>
          </div>
        )}

        {active.amh_min_pmol != null && (
          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">
              Min. Ovarian Reserve (AMH)
            </div>
            <div className="text-lg font-black text-sage-text leading-tight">
              {active.amh_min_pmol} <span className="text-xs font-normal">pmol/L</span>
            </div>
          </div>
        )}

        {active.fsh_max_iu != null && (
          <div className="p-3 bg-sage rounded-lg">
            <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">
              Max. FSH Level
            </div>
            <div className="text-lg font-black text-sage-text leading-tight">
              {active.fsh_max_iu} <span className="text-xs font-normal">IU/L</span>
            </div>
          </div>
        )}

        <div className="p-3 bg-sage rounded-lg">
          <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Smoking</div>
          <div className="flex items-center gap-1.5">
            {active.smoking_restricted ? (
              <>
                <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-sage-text">Must be non-smoker</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-sage-text">No restriction</span>
              </>
            )}
          </div>
        </div>

        <div className="p-3 bg-sage rounded-lg">
          <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">
            Endometriosis Priority
          </div>
          <div className="flex items-center gap-1.5">
            {active.endometriosis_priority_access ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-sage-text">Priority access</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-sage-text">Standard pathway</span>
              </>
            )}
          </div>
        </div>

        <div className="p-3 bg-sage rounded-lg col-span-2">
          <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Parental Status</div>
          <div className="text-sm font-bold text-sage-text leading-tight">
            {active.living_children_rule || 'Not specified'}
          </div>
        </div>
      </div>

      {active.additional_notes && (
        <AdditionalNotesAccordion notes={active.additional_notes} />
      )}
    </div>
  );
}


function AdditionalNotesAccordion({ notes }: { notes: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-sage hover:bg-emerald-50 transition-colors text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          {expanded
            ? <ChevronDown className="w-4 h-4 text-emerald-700" />
            : <ChevronRight className="w-4 h-4 text-emerald-700" />
          }
          <Info className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-sm text-sage-text">Additional Policy Notes</span>
        </span>
      </button>

      {expanded && (
        <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed bg-white">
          {notes}
        </div>
      )}
    </div>
  );
}
