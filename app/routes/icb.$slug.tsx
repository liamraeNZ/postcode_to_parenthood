import type { Route } from "./+types/icb.$slug";
import { Link, useSearchParams } from "react-router";
import { findIcbBySlug } from "../lib/slug";
import { getCycleColorClasses } from "@/utils/cycleColors";
import { CheckCircle2, XCircle, AlertCircle, Info, ArrowLeft, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface Policy {
  treatment_type_id: string;
  treatment_type_name: string;
  cycles_offered: number;
  min_age: number | null;
  max_age: number;
  bmi_min: number | null;
  bmi_max: number | null;
  amh_min_pmol: number | null;
  fsh_max_iu: number | null;
  iui_rounds_required: number;
  endometriosis_priority_access: boolean;
  smoking_restricted: boolean;
  living_children_rule: string | null;
  additional_notes: string | null;
  updated_at: string;
  effective_from: string;
  effective_to: string | null;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const { slug } = params;

  // Fetch all ICBs with document_folder_name (small set ~40 rows)
  const { results: icbs } = await db
    .prepare(
      "SELECT id, name, document_folder_name FROM icbs WHERE document_folder_name IS NOT NULL AND status = 'active'"
    )
    .bind()
    .all<{ id: string; name: string; document_folder_name: string }>();

  const matched = findIcbBySlug(icbs, slug) as
    | { id: string; name: string; document_folder_name: string }
    | undefined;
  if (!matched) {
    throw new Response("ICB not found", { status: 404 });
  }

  // Fetch policies for this ICB
  const { results: policies } = await db
    .prepare(
      `SELECT p.*, t.name as treatment_type_name
       FROM icb_policies p
       JOIN treatment_types t ON t.id = p.treatment_type_id
       WHERE p.icb_id = ?1
         AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
       ORDER BY p.effective_from DESC`
    )
    .bind(matched.id)
    .all<Policy>();

  return {
    icb: { id: matched.id, name: matched.name, document_folder_name: matched.document_folder_name },
    policies,
    slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "ICB Not Found | FertilityFund UK" },
      { name: "description", content: "The requested ICB policy page could not be found." },
    ];
  }

  const { icb, policies, slug } = data;
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  const cycles = ivfPolicy?.cycles_offered ?? 0;
  const maxAge = ivfPolicy?.max_age ?? 0;

  const title = `${icb.name} IVF Funding Policy | FertilityFund UK`;
  const description =
    cycles > 0
      ? `${icb.name} offers ${cycles} NHS-funded IVF cycle${cycles !== 1 ? "s" : ""} for eligible patients up to age ${maxAge}. Check full eligibility criteria including BMI, IUI requirements, and more.`
      : `${icb.name} NHS fertility funding policy. Check eligibility criteria including age limits, BMI requirements, and treatment options.`;
  const canonicalUrl = `https://fertilityfund.uk/icb/${slug}`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: "https://fertilityfund.uk/og-image.png" },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export default function IcbPolicyPage({ loaderData }: Route.ComponentProps) {
  const { icb, policies, slug } = loaderData;
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  const [searchParams] = useSearchParams();
  const gpPostcode = searchParams.get("gpPostcode");

  return (
    <section className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
          <ol className="flex items-center gap-2 text-sm text-deep-slate/60">
            <li>
              <Link to="/" className="hover:text-sage-btn transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-deep-slate font-medium truncate">{icb.name}</li>
          </ol>
        </nav>

        {/* Postcode search context banner */}
        {gpPostcode && (
          <div className="mb-4 md:mb-6 px-4 py-3 bg-sage-light border border-sage-green/30 rounded-xl">
            <p className="text-sm text-deep-slate">
              Based on your GP's postcode <span className="font-bold">{gpPostcode.toUpperCase()}</span>, your local ICB is: <span className="font-bold">{icb.name}</span>
            </p>
          </div>
        )}

        {/* Page heading */}
        <header className="mb-6 md:mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-deep-slate mb-2">
            {icb.name}
          </h1>
          <p className="text-sm md:text-base text-deep-slate/70">
            NHS-funded fertility treatment policy and eligibility criteria
          </p>
        </header>

        {/* Policy details */}
        {policies.length > 0 ? (
          <Tabs defaultValue={policies[0].treatment_type_id}>
            <TabsList className="w-full bg-white border border-warm-sand-dark rounded-xl p-1 mb-4">
              {policies.map((policy) => (
                <TabsTrigger
                  key={policy.treatment_type_id}
                  value={policy.treatment_type_id}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-deep-slate/50 data-active:bg-sage-btn data-active:text-white data-active:shadow-sm transition-all"
                >
                  {policy.treatment_type_name}
                </TabsTrigger>
              ))}
            </TabsList>
            {policies.map((policy) => (
              <TabsContent key={policy.treatment_type_id} value={policy.treatment_type_id}>
                <PolicyCard policy={policy} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="p-6 bg-warm-sand rounded-xl text-center">
            <p className="text-deep-slate/70">
              No current policy information is available for this ICB.
            </p>
          </div>
        )}

        {/* Internal navigation links */}
        <nav aria-label="Related pages" className="mt-8 md:mt-10 pt-6 border-t border-warm-sand-dark">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-light text-deep-slate font-medium text-sm rounded-xl hover:bg-sage-light/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Check your postcode
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-light text-deep-slate font-medium text-sm rounded-xl hover:bg-sage-light/80 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View all ICBs on map
            </Link>
          </div>
        </nav>
      </div>

      {/* JSON-LD Structured Data - FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(icb, policies, slug)),
        }}
      />
    </section>
  );
}

export function PolicyCard({ policy }: { policy: Policy; key?: string }) {
  const cc = getCycleColorClasses(policy.cycles_offered);

  const bmiLabel =
    policy.bmi_min != null || policy.bmi_max != null
      ? `${policy.bmi_min ?? "–"} to ${policy.bmi_max ?? "–"}`
      : "Not specified";

  return (
    <article className="bg-white rounded-xl border border-warm-sand-dark overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-warm-sand-dark">
        <h2 className="font-bold text-deep-slate text-base md:text-lg">
          {policy.treatment_type_name}
        </h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Cycles Offered */}
          <div className={`rounded-lg border overflow-hidden ${cc.bg} border-warm-sand-dark`}>
            <div className={`px-3 py-1.5 ${cc.bg} border-b border-warm-sand-dark`}>
              <span className={`text-[10px] uppercase font-bold opacity-70 ${cc.label}`}>Cycles Offered</span>
            </div>
            <div className="px-3 py-2 bg-white">
              <div className={`text-lg font-black leading-tight ${cc.text}`}>
                {policy.cycles_offered > 0 ? (
                  <>{policy.cycles_offered} Full</>
                ) : policy.cycles_offered === 0 ? (
                  "Not funded"
                ) : (
                  "Not specified"
                )}
              </div>
            </div>
          </div>

          {/* Max Age */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">Age Range</span>
            </div>
            <div className="px-3 py-2">
              <div className="text-lg font-black text-deep-slate leading-tight">
                {policy.min_age != null && policy.max_age > 0
                  ? `${policy.min_age} – ${policy.max_age}`
                  : policy.max_age > 0
                    ? `Up to ${policy.max_age}`
                    : policy.min_age != null
                      ? `${policy.min_age}+`
                      : "Not specified"}
              </div>
            </div>
          </div>

          {/* BMI */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">BMI Range</span>
            </div>
            <div className="px-3 py-2">
              <div className="text-lg font-black text-deep-slate leading-tight">{bmiLabel}</div>
            </div>
          </div>

          {/* IUI Rounds */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">IUI Rounds Required</span>
            </div>
            <div className="px-3 py-2">
              <div className="text-lg font-black text-deep-slate leading-tight">
                {policy.iui_rounds_required > 0 ? policy.iui_rounds_required : "None"}
              </div>
            </div>
          </div>

          {/* Smoking */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">Smoking</span>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-1.5">
                {policy.smoking_restricted ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-deep-slate">Non-smoker required</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-deep-slate">No restriction</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Endometriosis */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">Endometriosis</span>
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-1.5">
                {policy.endometriosis_priority_access ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-deep-slate">Priority access</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-deep-slate/40 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold text-deep-slate">Standard</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Living Children Rule */}
          <div className="rounded-lg border border-warm-sand-dark overflow-hidden col-span-2">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <span className="text-[10px] uppercase font-bold text-sage-dark">Living Children Rule</span>
            </div>
            <div className="px-3 py-2">
              <div className="text-sm font-bold text-deep-slate leading-snug">
                {policy.living_children_rule || "Not specified"}
              </div>
            </div>
          </div>
        </div>

        {/* Additional notes */}
        {policy.additional_notes && (
          <div className="mt-4 rounded-lg border border-warm-sand-dark overflow-hidden">
            <div className="px-3 py-1.5 bg-sage-light border-b border-warm-sand-dark">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-sage-dark" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-sage-dark">Additional Notes</span>
              </div>
            </div>
            <div className="px-3 py-2 text-sm text-deep-slate/80 leading-relaxed">
              {policy.additional_notes}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function buildStructuredData(
  icb: { name: string },
  policies: Policy[],
  slug: string
) {
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  const canonicalUrl = `https://fertilityfund.uk/icb/${slug}`;

  // Build FAQ entries from policy data
  const faqEntries: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> = [];

  if (ivfPolicy) {
    faqEntries.push({
      "@type": "Question",
      name: `How many NHS-funded IVF cycles does ${icb.name} offer?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          ivfPolicy.cycles_offered > 0
            ? `${icb.name} offers ${ivfPolicy.cycles_offered} NHS-funded IVF cycle${ivfPolicy.cycles_offered !== 1 ? "s" : ""} to eligible patients.`
            : `${icb.name} does not currently fund NHS IVF cycles.`,
      },
    });

    faqEntries.push({
      "@type": "Question",
      name: `What is the age limit for NHS IVF at ${icb.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          ivfPolicy.max_age > 0
            ? `Patients must be under ${ivfPolicy.max_age} years old to be eligible for NHS-funded IVF at ${icb.name}.`
            : `Age limit information is not currently specified for ${icb.name}.`,
      },
    });

    if (ivfPolicy.bmi_min != null || ivfPolicy.bmi_max != null) {
      const bmiText =
        ivfPolicy.bmi_min != null && ivfPolicy.bmi_max != null
          ? `BMI must be between ${ivfPolicy.bmi_min} and ${ivfPolicy.bmi_max}`
          : ivfPolicy.bmi_max != null
            ? `BMI must be ${ivfPolicy.bmi_max} or below`
            : `BMI must be at least ${ivfPolicy.bmi_min}`;

      faqEntries.push({
        "@type": "Question",
        name: `What are the BMI requirements for NHS IVF at ${icb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${bmiText} for NHS-funded IVF eligibility at ${icb.name}.`,
        },
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${icb.name} IVF Funding Policy`,
    url: canonicalUrl,
    mainEntity: faqEntries,
  };
}
