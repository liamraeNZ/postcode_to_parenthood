import React, { Suspense } from "react";
import type { Route } from "./+types/board.$slug";
import { Link, useSearchParams } from "react-router";
import { findIcbBySlug } from "../lib/slug";
import { formatIcbName } from "@/lib/utils";
import { getCycleColorClasses } from "@/utils/cycleColors";
import { CheckCircle2, XCircle, AlertCircle, Info, ArrowLeft, MapPin, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";

const LocalMiniMap = React.lazy(() =>
  import("@/components/map/LocalMiniMap").then((mod) => ({ default: mod.LocalMiniMap }))
);

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

export function formatCountryName(country: string): string {
  const map: Record<string, string> = {
    ENGLAND: "England",
    SCOTLAND: "Scotland",
    WALES: "Wales",
    NORTHERN_IRELAND: "Northern Ireland",
  };
  return map[country] ?? country;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const { slug } = params;

  // Fetch all health boards with document_folder_name (small set ~70 rows)
  const { results: boards } = await db
    .prepare(
      "SELECT id, name, document_folder_name, country FROM health_boards WHERE document_folder_name IS NOT NULL AND status = 'active'"
    )
    .bind()
    .all<{ id: string; name: string; document_folder_name: string; country: string }>();

  const matched = findIcbBySlug(boards, slug) as
    | { id: string; name: string; document_folder_name: string; country: string }
    | undefined;
  if (!matched) {
    throw new Response("Health board not found", { status: 404 });
  }

  // Detect national policy pages (multiple boards share the same document_folder_name)
  const boardsWithSameFolder = boards.filter(
    (b) => b.document_folder_name === matched.document_folder_name
  );
  const isNationalPolicy = boardsWithSameFolder.length > 1;

  // Fetch policies for this board
  const { results: policies } = await db
    .prepare(
      `SELECT p.*, t.name as treatment_type_name
       FROM board_policies p
       JOIN treatment_types t ON t.id = p.treatment_type_id
       WHERE p.board_id = ?1
         AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
       ORDER BY p.effective_from DESC`
    )
    .bind(matched.id)
    .all<Policy>();

  return {
    icb: { id: matched.id, name: matched.name, document_folder_name: matched.document_folder_name, country: matched.country },
    policies,
    isNationalPolicy,
    slug,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "Health Board Not Found | Postcode to Parenthood" },
      { name: "description", content: "The requested health board policy page could not be found." },
    ];
  }

  const { icb, policies, slug, isNationalPolicy } = data;
  const displayName = isNationalPolicy ? formatCountryName(icb.country) : formatIcbName(icb.name);
  const countryName = formatCountryName(icb.country);
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  const cycles = ivfPolicy?.cycles_offered ?? 0;
  const maxAge = ivfPolicy?.max_age ?? 0;

  const title = `${displayName} IVF Funding Guidance | ${countryName} | Postcode to Parenthood`;
  const description =
    cycles > 0
      ? `${displayName} in ${countryName} offers ${cycles} NHS-funded IVF cycle${cycles !== 1 ? "s" : ""} for eligible patients up to age ${maxAge}. Check full eligibility criteria including BMI, IUI requirements, and more.`
      : `${displayName} in ${countryName} NHS fertility funding policy. Check eligibility criteria including age limits, BMI requirements, and treatment options.`;
  const canonicalUrl = `https://postcodetoparenthood.org.uk/board/${slug}`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: "https://postcodetoparenthood.org.uk/og-image.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "Postcode to Parenthood" },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://postcodetoparenthood.org.uk/og-image.png" },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export default function IcbPolicyPage({ loaderData }: Route.ComponentProps) {
  const { icb, policies, slug, isNationalPolicy } = loaderData;
  const countryName = formatCountryName(icb.country);
  const [searchParams] = useSearchParams();
  const gpPostcode = searchParams.get("gpPostcode");
  const boardNameParam = searchParams.get("boardName");
  const displayName = (isNationalPolicy && boardNameParam) ? formatIcbName(boardNameParam) : formatIcbName(icb.name);

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title={displayName}
        description={`${countryName}. NHS-funded fertility treatment guidance and eligibility criteria.`}
        breadcrumbCurrent={displayName}
        compact
      />
      <div className="container mx-auto max-w-3xl px-4 pt-6 pb-8 md:pt-8 md:pb-12">
        {/* Postcode search context banner */}
        {gpPostcode && (
          <div className="mb-5 rounded-2xl border border-tint/30 bg-tint-light/40 px-5 py-3.5 md:mb-6">
            <p className="font-sans text-sm text-ink">
              Based on your {isNationalPolicy ? "postcode" : "GP's postcode"}{" "}
              <span className="font-semibold">{gpPostcode.toUpperCase()}</span>, this is the local pathway we
              found: <span className="font-semibold">{displayName}</span>
            </p>
          </div>
        )}

        {/* National policy notice */}
        {isNationalPolicy && (
          <div className="mb-4 px-4 py-3 bg-surface border border-tint/20 rounded-2xl">
            <p className="font-sans text-sm text-ink/80 font-medium">
              <Info className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-brand" aria-hidden="true" />
              A national <span className="font-semibold">{countryName}</span> policy currently applies to all health boards.
            </p>
          </div>
        )}

        {/* Policy details */}
        {policies.length > 0 ? (
          <Tabs defaultValue={policies[0].treatment_type_id}>
            <TabsList className="w-full bg-white border border-tint/20 rounded-2xl p-1 mb-5">
              {policies.map((policy) => (
                <TabsTrigger
                  key={policy.treatment_type_id}
                  value={policy.treatment_type_id}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink/50 data-active:bg-brand data-active:text-white data-active:shadow-sm transition-all"
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
          <div className="p-6 bg-surface rounded-2xl text-center">
            <p className="font-sans text-ink/60 font-light">
              No current policy information is available for this health board.
            </p>
          </div>
        )}

        {/* Local mini-map showing GP location relative to nearby board boundaries */}
        {gpPostcode && (
          <div className="mt-8 md:mt-10">
          <Suspense fallback={null}>
            <LocalMiniMap
              gpPostcode={gpPostcode}
              currentBoardId={icb.id}
              currentBoardName={displayName}
            />
          </Suspense>
          </div>
        )}

        {/* Internal navigation links */}
        <nav aria-label="Related pages" className="mt-10 md:mt-12 pt-6 border-t border-tint/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/policy/${slug}`}
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-semibold text-sm rounded-full hover:bg-brand-light transition-colors"
            >
              <FileText className="w-4 h-4" />
              View source documents
            </Link>
            <Link
              to="/search"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-surface text-ink font-medium text-sm rounded-full hover:bg-surface-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Check another postcode
            </Link>
            <Link
              to="/map"
              className="btn-press inline-flex items-center gap-2 px-5 py-2.5 bg-surface text-ink font-medium text-sm rounded-full hover:bg-surface-dark transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Explore the funding map
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
    <article className="bg-white rounded-2xl border border-tint/20 overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-tint/15">
        <h2 className="font-heading text-ink text-lg font-semibold">
          {policy.treatment_type_name}
        </h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {/* Cycles Offered */}
          <div className={`rounded-xl border overflow-hidden ${cc.bg} border-tint/15`}>
            <div className={`px-3 py-1.5 ${cc.bg} border-b border-tint/15`}>
              <span className={`font-mono text-[10px] uppercase font-semibold tracking-wide ${cc.label}`}>Funded Cycles</span>
            </div>
            <div className="px-3 py-2.5 bg-white">
              <div className={`text-lg font-bold leading-tight ${cc.text}`}>
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
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Age Range</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-lg font-bold text-ink leading-tight">
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
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">BMI Range</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-lg font-bold text-ink leading-tight">{bmiLabel}</div>
            </div>
          </div>

          {/* IUI Rounds */}
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">IUI Rounds Required</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-lg font-bold text-ink leading-tight">
                {policy.iui_rounds_required > 0 ? policy.iui_rounds_required : "None"}
              </div>
            </div>
          </div>

          {/* Smoking */}
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Smoking</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                {policy.smoking_restricted ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">Non-smoker required</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">No restriction</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Endometriosis */}
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Endometriosis</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                {policy.endometriosis_priority_access ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">Priority access</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-ink/40 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">Standard</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Living Children Rule */}
          <div className="rounded-xl border border-tint/15 overflow-hidden col-span-2">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Living Children Rule</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-sm font-semibold text-ink leading-snug">
                {policy.living_children_rule || "Not specified"}
              </div>
            </div>
          </div>
        </div>

        {/* Additional notes */}
        {policy.additional_notes && (
          <div className="mt-4 rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Additional Notes</span>
              </div>
            </div>
            <div className="px-4 py-3 font-sans text-sm text-ink/75 leading-relaxed font-light">
              {policy.additional_notes}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function buildStructuredData(
  icb: { name: string; document_folder_name: string },
  policies: Policy[],
  slug: string
) {
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  const canonicalUrl = `https://postcodetoparenthood.org.uk/board/${slug}`;
  const displayName = formatIcbName(icb.name);

  // Build FAQ entries from policy data
  const faqEntries: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> = [];

  if (ivfPolicy) {
    faqEntries.push({
      "@type": "Question",
      name: `How many NHS-funded IVF cycles does ${displayName} offer?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          ivfPolicy.cycles_offered > 0
            ? `${displayName} offers ${ivfPolicy.cycles_offered} NHS-funded IVF cycle${ivfPolicy.cycles_offered !== 1 ? "s" : ""} to eligible patients.`
            : `${displayName} does not currently fund NHS IVF cycles.`,
      },
    });

    faqEntries.push({
      "@type": "Question",
      name: `What is the age limit for NHS IVF at ${displayName}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          ivfPolicy.max_age > 0
            ? `Patients must be under ${ivfPolicy.max_age} years old to be eligible for NHS-funded IVF at ${displayName}.`
            : `Age limit information is not currently specified for ${displayName}.`,
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
        name: `What are the BMI requirements for NHS IVF at ${displayName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${bmiText} for NHS-funded IVF eligibility at ${displayName}.`,
        },
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${displayName} IVF Funding Guidance`,
    url: canonicalUrl,
    mainEntity: faqEntries,
  };
}
