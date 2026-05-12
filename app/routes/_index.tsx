import type { Route } from "./+types/_index";
import { Form, redirect, useActionData } from "react-router";
import { Link } from "react-router";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { motion } from "motion/react";
import { FileText, Map, MapPin, ShieldCheck } from "lucide-react";
import { PostcodeSearch } from "@/components/home/PostcodeSearch";
import { MiniRouteModule } from "@/components/home/MiniRouteModule";

export function meta({}: Route.MetaArgs) {
  const title = "Pathway to Parenthood | Unlock Your NHS IVF Funding";
  const description =
    "Don't let your postcode dictate your future. Get an instant breakdown of NHS fertility funding eligibility, cycle availability, and local ICB policy.";
  const canonicalUrl = "https://pathwaytoparenthood.uk";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    {
      property: "og:image",
      content: "https://pathwaytoparenthood.uk/og-image.png",
    },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=600",
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const postcode = (formData.get("postcode") as string | null)?.trim() ?? "";

  if (!postcode) {
    return { error: "Please enter a postcode" };
  }

  const db = context.cloudflare.env.DB;

  const admin = await lookupPostcodeAdminLookup(postcode, {
    requestId: crypto.randomUUID(),
  });

  if (!admin) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const resolved = await resolveBoardFromPostcode(db, {
    country: admin.country,
    icb: admin.icb,
    ccg_id: admin.ccg_id,
    ccg: admin.ccg,
    nhs_ha: admin.nhs_ha,
    primary_care_trust: admin.primary_care_trust,
  });

  if (!resolved) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const documentFolder = await resolveDocumentFolder(db, resolved.boardId);

  if (!documentFolder) {
    return {
      error:
        "We couldn't find a health board for that postcode. Please check and try again.",
    };
  }

  const slug = toSlug(documentFolder);
  return redirect(`/board/${slug}?gpPostcode=${encodeURIComponent(postcode)}`);
}

const features = [
  {
    icon: MapPin,
    title: "Your postcode, your policy",
    description: "Enter your postcode and instantly see which NHS fertility funding rules apply to you; and the ICB policy behind them.",
    href: "/search",
    available: true,
  },
  {
    icon: Map,
    title: "See the full funding map",
    description: "Visualise how IVF access varies across the UK. Understand where policy boundaries fall and what that means for you.",
    href: "/map",
    available: true,
  },
  {
    icon: FileText,
    title: "Read the policy, plainly",
    description: "Age limits, cycle availability, eligibility criteria summarised in plain English so you know exactly where you stand.",
    href: "/policies",
    available: true,
  },
];

export default function LandingPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex-1 flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-4 text-deep-slate">
                Unlock your local NHS
                <br />
                <span className="text-route-teal-dark">fertility funding.</span>
              </h1>
              <p className="text-base md:text-lg text-deep-slate leading-relaxed mb-6 max-w-xl">
                Don't let your postcode dictate your future. Get an instant, clear breakdown of the IVF eligibility rules in your area.
              </p>

              {/* Trust microcopy */}
              <div className="flex items-center gap-2 mb-6 text-sm text-deep-slate/70">
                <ShieldCheck className="w-4 h-4 text-route-teal" />
                <span>Updated for 2026. Based on current ICB policy documents.</span>
              </div>

              <MiniRouteModule className="mb-6 lg:hidden" />

              {/* Search + Map row */}
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-0 max-w-lg">
                  <PostcodeSearch />
                </div>
              </div>
            </motion.div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-end"
            >
              <img
                src="/assets/hand-hold.webp"
                alt="A supportive moment between two people on their fertility journey"
                className="rounded-xl shadow-xl w-96 h-[28rem] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-heading text-xl md:text-2xl font-bold text-deep-slate mb-2 tracking-tight">
            Three ways to understand your funding
          </h2>
          <p className="text-sm text-deep-slate/70 mb-6">Each path leads to the same answer — what your local NHS policy means for you.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const content = (
                <div
                  key={feature.title}
                  className={`relative p-5 rounded-lg border transition-all ${
                    feature.available
                      ? "bg-white border-warm-sand-dark hover:border-route-teal hover:shadow-md cursor-pointer"
                      : "bg-warm-sand/50 border-warm-sand-dark opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-sage-light flex items-center justify-center">
                      <Icon className="w-4 h-4 text-route-teal-dark" />
                    </div>
                    {!feature.available && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-deep-slate/50 bg-warm-sand-dark px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-deep-slate text-sm mb-1">{feature.title}</h3>
                  <p className="text-sm text-deep-slate/80 leading-relaxed">{feature.description}</p>
                </div>
              );

              if (feature.available) {
                return (
                  <Link key={feature.title} to={feature.href} className="block">
                    {content}
                  </Link>
                );
              }
              return <div key={feature.title}>{content}</div>;
            })}
          </div>
        </motion.div>
      </div>

      {/* No-JS fallback form for postcode search */}
      <noscript>
        <div className="container mx-auto px-4 py-6 max-w-md">
          <Form method="post" action="/">
            <label
              htmlFor="postcode-noscript"
              className="block text-sm font-medium text-deep-slate mb-2"
            >
              Enter your postcode to find your health board's fertility policy
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="postcode-noscript"
                name="postcode"
                placeholder="e.g. SW1A 1AA"
                required
                className="flex-1 px-4 py-3 border-2 border-warm-sand-dark rounded-lg text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sage-dark text-white font-bold rounded-lg"
              >
                Find My Funding
              </button>
            </div>
          </Form>
        </div>
      </noscript>

      {actionData?.error && (
        <div className="container mx-auto px-4 pb-6">
          <div className="max-w-md p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {actionData.error}
          </div>
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Pathway to Parenthood",
            url: "https://pathwaytoparenthood.uk",
            description:
              "A clearer route through NHS IVF funding. Check local eligibility guidance and health board policies by postcode.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://pathwaytoparenthood.uk/search?postcode={postcode}",
              },
              "query-input": "required name=postcode",
            },
          }),
        }}
      />
    </section>
  );
}
