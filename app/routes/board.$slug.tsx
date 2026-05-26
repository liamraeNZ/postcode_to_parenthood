import React, { Suspense } from "react";
import type { Route } from "./+types/board.$slug";
import { Link, useSearchParams } from "react-router";
import { findIcbBySlug } from "../lib/slug";
import { formatIcbName } from "@/lib/utils";
import { getCycleColorClasses } from "@/utils/cycleColors";
import { CheckCircle2, XCircle, AlertCircle, Info, ArrowLeft, MapPin, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { standardMeta } from "@/lib/meta";
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary";
import type { BoardMeta } from "@/types";
import { StatusBadge } from "@/components/board/StatusBadge";
import { InheritedBanner } from "@/components/board/InheritedBanner";
import { PlainEnglishSummary } from "@/components/board/PlainEnglishSummary";
import { TransparencyNote } from "@/components/board/TransparencyNote";
import { StaleDataWarning } from "@/components/board/StaleDataWarning";
import { PostcodeLotteryNote } from "@/components/board/PostcodeLotteryNote";
import { WhatNextSection } from "@/components/board/WhatNextSection";
import { BoroughList } from "@/components/board/BoroughList";
import { generatePlainEnglishSummary } from "@/lib/generateSummary";
import { VirtualGpNote } from "@/components/shared/VirtualGpNote";

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

/**
 * Parse boroughs JSON for inclusion in meta description.
 * Returns a truncated comma-separated string (max ~5 areas) or null if empty.
 * Only uses top-level boroughs (not neighbourhoods) for the meta description.
 */
function parseBoroughsForMeta(boroughs: string | null): string | null {
  if (!boroughs) return null;
  try {
    const parsed = JSON.parse(boroughs);

    let valid: string[];
    // New object format: { boroughs: [...], neighbourhoods: [...] }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      if (!Array.isArray(parsed.boroughs)) return null;
      valid = parsed.boroughs.filter((item: unknown): item is string => typeof item === "string" && (item as string).length > 0);
    } else if (Array.isArray(parsed)) {
      // Legacy flat array format
      valid = parsed.filter((item: unknown): item is string => typeof item === "string" && (item as string).length > 0);
    } else {
      return null;
    }

    if (valid.length === 0) return null;
    // Limit to first 5 to keep meta description reasonable length
    const shown = valid.slice(0, 5);
    const suffix = valid.length > 5 ? ` and ${valid.length - 5} more areas` : "";
    return shown.join(", ") + suffix;
  } catch {
    return null;
  }
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const { slug } = params;

  // Fetch all health boards with document_folder_name (small set ~70 rows)
  const { results: boards } = await db
    .prepare(
      `SELECT id, name, document_folder_name, country,
              data_confidence, policy_date, last_verified,
              predecessor_icb, source_url, policy_pdf_r2_key,
              boroughs, summary_override
       FROM health_boards
       WHERE document_folder_name IS NOT NULL AND status = 'active'`
    )
    .bind()
    .all<{
      id: string;
      name: string;
      document_folder_name: string;
      country: string;
      data_confidence: BoardMeta['data_confidence'];
      policy_date: string | null;
      last_verified: string | null;
      predecessor_icb: string | null;
      source_url: string | null;
      policy_pdf_r2_key: string | null;
      boroughs: string | null;
      summary_override: string | null;
    }>();

  const matched = findIcbBySlug(boards, slug) as
    | {
        id: string;
        name: string;
        document_folder_name: string;
        country: string;
        data_confidence: BoardMeta['data_confidence'];
        policy_date: string | null;
        last_verified: string | null;
        predecessor_icb: string | null;
        source_url: string | null;
        policy_pdf_r2_key: string | null;
        boroughs: string | null;
        summary_override: string | null;
      }
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
  let { results: policies } = await db
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

  // Policy fallback: if no direct policies, check sub-ICBs (predecessor boards)
  let policySource: string | null = null;

  if (policies.length === 0) {
    const { results: subIcbs } = await db
      .prepare(
        `SELECT id, name FROM health_boards WHERE parent_board_code = ?1 AND sub_board_code IS NOT NULL`
      )
      .bind(matched.id)
      .all<{ id: string; name: string }>();

    if (subIcbs.length > 0) {
      // Fetch policies for each sub-ICB and pick the most generous set
      let bestPolicies: Policy[] = [];
      let bestCycles = -1;
      let bestEffectiveFrom = '';
      let bestSubIcbName = '';

      for (const subIcb of subIcbs) {
        const { results: subPolicies } = await db
          .prepare(
            `SELECT p.*, t.name as treatment_type_name
             FROM board_policies p
             JOIN treatment_types t ON t.id = p.treatment_type_id
             WHERE p.board_id = ?1
               AND (p.effective_to IS NULL OR p.effective_to >= date('now'))
             ORDER BY p.effective_from DESC`
          )
          .bind(subIcb.id)
          .all<Policy>();

        if (subPolicies.length === 0) continue;

        // Find the IVF policy to compare cycles_offered
        const ivfPolicy = subPolicies.find((p) => p.treatment_type_id === 'ivf');
        const cycles = ivfPolicy?.cycles_offered ?? 0;
        const effectiveFrom = ivfPolicy?.effective_from ?? '';

        // Pick the set with highest cycles_offered; tiebreak by most recent effective_from
        if (
          cycles > bestCycles ||
          (cycles === bestCycles && effectiveFrom > bestEffectiveFrom)
        ) {
          bestPolicies = subPolicies;
          bestCycles = cycles;
          bestEffectiveFrom = effectiveFrom;
          bestSubIcbName = subIcb.name;
        }
      }

      if (bestPolicies.length > 0) {
        policies = bestPolicies;
        policySource = bestSubIcbName;
      }
    }
  }

  // Build boardMeta from the matched board's enrichment columns
  const boardMeta: BoardMeta = {
    data_confidence: matched.data_confidence,
    policy_date: matched.policy_date,
    last_verified: matched.last_verified,
    predecessor_icb: matched.predecessor_icb,
    source_url: matched.source_url,
    policy_pdf_r2_key: matched.policy_pdf_r2_key,
    boroughs: matched.boroughs,
    summary_override: matched.summary_override,
  };

  return {
    icb: { id: matched.id, name: matched.name, document_folder_name: matched.document_folder_name, country: matched.country },
    policies,
    policySource,
    boardMeta,
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

  const { icb, policies, slug, isNationalPolicy, boardMeta } = data;
  const displayName = isNationalPolicy ? formatCountryName(icb.country) : formatIcbName(icb.name);
  const countryName = formatCountryName(icb.country);
  const ivfPolicy = policies.find((p: Policy) => p.treatment_type_id === "ivf");
  const cycles = ivfPolicy?.cycles_offered ?? 0;
  const maxAge = ivfPolicy?.max_age ?? 0;

  // Parse boroughs for SEO — include area names in meta description
  const boroughList = parseBoroughsForMeta(boardMeta?.boroughs ?? null);
  const areasSuffix = boroughList ? ` Covers ${boroughList}.` : "";

  const title = `${displayName} IVF Funding Guidance | ${countryName} | Postcode to Parenthood`;
  const description =
    cycles > 0
      ? `${displayName} in ${countryName} offers ${cycles} NHS-funded IVF cycle${cycles !== 1 ? "s" : ""} for eligible patients up to age ${maxAge}. Check full eligibility criteria including BMI, IUI requirements, and more.${areasSuffix}`
      : `${displayName} in ${countryName} NHS fertility funding policy. Check eligibility criteria including age limits, BMI requirements, and treatment options.${areasSuffix}`;
  const canonicalUrl = `https://postcodetoparenthood.org.uk/board/${slug}`;

  return [
    { title },
    { name: "description", content: description },
    ...standardMeta(canonicalUrl),
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonicalUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export default function IcbPolicyPage({ loaderData }: Route.ComponentProps) {
  const { icb, policies, slug, isNationalPolicy, boardMeta = {} as BoardMeta } = loaderData;
  const countryName = formatCountryName(icb.country);
  const [searchParams] = useSearchParams();
  const gpPostcode = searchParams.get("gpPostcode");
  const boardNameParam = searchParams.get("boardName");
  const displayName = (isNationalPolicy && boardNameParam) ? formatIcbName(boardNameParam) : formatIcbName(icb.name);

  const showBadge = boardMeta?.data_confidence && boardMeta.data_confidence !== 'unconfirmed';
  const showInheritedBanner = boardMeta?.data_confidence === 'inherited';
  const isViaVirtualGp = searchParams.get("via") === "virtual";

  return (
    <section className="flex flex-1 flex-col">
      <PageHeader
        title={displayName}
        description={`${countryName}. NHS-funded fertility treatment guidance and eligibility criteria.`}
        breadcrumbCurrent={displayName}
        compact
        actions={showBadge ? <StatusBadge dataConfidence={boardMeta.data_confidence} /> : undefined}
      >
        <BoroughList
          boroughs={boardMeta.boroughs}
          dataConfidence={boardMeta.data_confidence}
        />
      </PageHeader>
      <div className="container mx-auto max-w-3xl px-4 pt-4 pb-8 md:pt-5 md:pb-12">
        {/* Inherited policy caveat banner */}
        {showInheritedBanner && boardMeta.predecessor_icb && (
          <div className="mb-5 md:mb-6">
            <InheritedBanner predecessorIcb={boardMeta.predecessor_icb} />
          </div>
        )}
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

        {/* Virtual GP note — shown when user arrived via a virtual GP practice */}
        {isViaVirtualGp && (
          <div className="mb-5 md:mb-6">
            <VirtualGpNote />
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

        {/* Plain English summary — above policy cards */}
        {policies.length > 0 && (
          <div className="mb-5 md:mb-6">
            <PlainEnglishSummary
              boardMeta={boardMeta}
              icbName={displayName}
              policy={policies.find((p) => p.treatment_type_id === "ivf") ?? policies[0]}
            />
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

        {/* Transparency note — below policy cards */}
        <div className="mt-6 space-y-3">
          <TransparencyNote
            icbName={displayName}
            policyDate={boardMeta.policy_date}
            sourceUrl={boardMeta.source_url}
            lastVerified={boardMeta.last_verified}
          />
          {/* Stale data warning — below transparency note */}
          {boardMeta.last_verified && (
            <StaleDataWarning
              lastVerified={boardMeta.last_verified}
              icbName={displayName}
            />
          )}
        </div>

        {/* Postcode lottery awareness note */}
        <div className="mt-6 md:mt-8">
          <PostcodeLotteryNote />
        </div>

        {/* What next? — soft-path guidance buttons */}
        <div className="mt-5 md:mt-6">
          <WhatNextSection boardSlug={slug} />
        </div>



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

      {/* JSON-LD Structured Data - BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://postcodetoparenthood.org.uk",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: isNationalPolicy ? formatCountryName(icb.country) : displayName,
              },
            ],
          }),
        }}
      />
      {/* JSON-LD Structured Data - FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(icb, policies, slug)),
        }}
      />
      {/* JSON-LD Structured Data - Dataset schema (GEO-optimized for LLM extraction) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildGeoDatasetSchema(icb, policies, slug, boardMeta)),
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
              <span className={`font-mono text-[10px] uppercase font-semibold tracking-wide ${cc.label}`}>NHS-funded cycles</span>
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
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">BMI requirement</span>
            </div>
            <div className="px-3 py-2.5">
              <div className="text-lg font-bold text-ink leading-tight">{bmiLabel}</div>
            </div>
          </div>

          {/* IUI Rounds */}
          <div className="rounded-xl border border-tint/15 overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-tint/15">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">IUI cycles required before IVF</span>
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
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wide text-brand">Children from previous relationships</span>
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

/**
 * Build a Dataset JSON-LD schema optimized for Generative Engine Optimization (GEO).
 * Uses schema.org/Dataset with variableMeasured to expose structured eligibility
 * criteria as key-value pairs that LLMs (ChatGPT, Claude, Perplexity) can extract and cite.
 */
export function buildGeoDatasetSchema(
  icb: { name: string; document_folder_name: string },
  policies: Policy[],
  slug: string,
  boardMeta: BoardMeta
) {
  const canonicalUrl = `https://postcodetoparenthood.org.uk/board/${slug}`;
  const displayName = formatIcbName(icb.name);

  // Build description from summary_override or generated summary
  let description = `NHS fertility funding eligibility criteria for ${displayName}, including IVF cycles offered, age limits, BMI thresholds, and treatment requirements.`;
  const ivfPolicy = policies.find((p) => p.treatment_type_id === "ivf");
  if (boardMeta.summary_override) {
    description = boardMeta.summary_override;
  } else if (ivfPolicy) {
    description = generatePlainEnglishSummary(displayName, ivfPolicy);
  }

  // Build variableMeasured array from policy data
  const variableMeasured: Array<Record<string, unknown>> = [];

  for (const policy of policies) {
    const prefix = policies.length > 1 ? `${policy.treatment_type_name}: ` : "";

    variableMeasured.push({
      "@type": "PropertyValue",
      name: `${prefix}Funded Cycles`,
      value: policy.cycles_offered > 0 ? policy.cycles_offered : 0,
      unitText: "NHS-funded cycles",
      description: policy.cycles_offered > 0
        ? `${displayName} offers ${policy.cycles_offered} NHS-funded ${policy.treatment_type_name} cycle${policy.cycles_offered !== 1 ? "s" : ""}.`
        : `${displayName} does not currently fund ${policy.treatment_type_name}.`,
    });

    if (policy.max_age > 0) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: `${prefix}Maximum Age`,
        value: policy.max_age,
        unitText: "years",
        ...(policy.min_age != null && { minValue: policy.min_age }),
        description: policy.min_age != null
          ? `Eligible patients must be aged ${policy.min_age}–${policy.max_age}.`
          : `Eligible patients must be under ${policy.max_age} years old.`,
      });
    }

    if (policy.bmi_min != null || policy.bmi_max != null) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: `${prefix}BMI Threshold`,
        ...(policy.bmi_min != null && { minValue: policy.bmi_min }),
        ...(policy.bmi_max != null && { maxValue: policy.bmi_max }),
        unitText: "kg/m²",
        description:
          policy.bmi_min != null && policy.bmi_max != null
            ? `BMI must be between ${policy.bmi_min} and ${policy.bmi_max}.`
            : policy.bmi_max != null
              ? `BMI must be ${policy.bmi_max} or below.`
              : `BMI must be at least ${policy.bmi_min}.`,
      });
    }

    if (policy.living_children_rule) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: `${prefix}Existing Children Policy`,
        value: policy.living_children_rule,
        description: `Children rule: ${policy.living_children_rule}.`,
      });
    }

    if (policy.iui_rounds_required > 0) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: `${prefix}IUI Rounds Required Before IVF`,
        value: policy.iui_rounds_required,
        unitText: "cycles",
        description: `${policy.iui_rounds_required} IUI cycle${policy.iui_rounds_required !== 1 ? "s" : ""} required before IVF referral (applies to same-sex couples and single women).`,
      });
    }

    if (policy.smoking_restricted) {
      variableMeasured.push({
        "@type": "PropertyValue",
        name: `${prefix}Smoking Restriction`,
        value: "Non-smoker required",
        description: "Both partners must be non-smokers at the time of referral.",
      });
    }
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${displayName} NHS Fertility Funding Eligibility Criteria`,
    url: canonicalUrl,
    description,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "Postcode to Parenthood",
      url: "https://postcodetoparenthood.org.uk",
    },
    keywords: [
      "NHS IVF funding",
      "fertility treatment eligibility",
      displayName,
      "IVF postcode lottery",
      "NHS fertility policy",
    ],
    variableMeasured,
  };

  // Bind dateModified to last_verified timestamp
  if (boardMeta.last_verified) {
    schema.dateModified = boardMeta.last_verified;
  }

  // Add spatial coverage — helps AI engines associate area names with this dataset
  if (boardMeta.boroughs) {
    try {
      const parsed = JSON.parse(boardMeta.boroughs);
      let allAreas: string[] = [];

      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        if (Array.isArray(parsed.boroughs)) {
          allAreas = allAreas.concat(parsed.boroughs.filter((a: unknown): a is string => typeof a === "string" && (a as string).length > 0));
        }
        if (Array.isArray(parsed.neighbourhoods)) {
          allAreas = allAreas.concat(parsed.neighbourhoods.filter((a: unknown): a is string => typeof a === "string" && (a as string).length > 0));
        }
      } else if (Array.isArray(parsed)) {
        allAreas = parsed.filter((a: unknown): a is string => typeof a === "string" && (a as string).length > 0);
      }

      if (allAreas.length > 0) {
        schema.spatialCoverage = allAreas.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        }));
      }
    } catch {
      // ignore parse errors
    }
  }

  return schema;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary resourceName="health board" backTo="/boards" backLabel="Browse all health boards" />;
}
