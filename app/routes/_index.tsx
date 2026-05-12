import type { Route } from "./+types/_index";
import { Form, redirect, useActionData } from "react-router";
import { Link } from "react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveBoardFromPostcode, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Calendar,
  FileText,
  Map,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PostcodeSearch } from "@/components/home/PostcodeSearch";

export function meta({}: Route.MetaArgs) {
  const title = "Pathway to Parenthood | Unlock Your IVF Funding";
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
    description:
      "See which NHS fertility funding rules apply to you, including the ICB policy documents behind them.",
    href: "/search",
    available: true,
  },
  {
    icon: Map,
    title: "The funding map",
    description:
      "Explore how IVF access varies across the UK and where policy boundaries fall on the ground.",
    href: "/map",
    available: true,
  },
  {
    icon: FileText,
    title: "Policy in plain English",
    description:
      "Age limits, cycles, and eligibility criteria summarised clearly so you know what to verify next.",
    href: "/boards",
    available: true,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Share your postcode",
    body: "We use your GP catchment to identify the health board whose published policy may apply.",
  },
  {
    step: "02",
    title: "Review your pathway",
    body: "See funded cycles, age ranges, and key criteria side by side, written for patients rather than commissioners.",
  },
  {
    step: "03",
    title: "Confirm with your team",
    body: "Use linked source documents and speak to your GP or clinic to confirm what you might be eligible for.",
  },
];

export default function LandingPage() {
  const actionData = useActionData<typeof action>();
  const [gpListContent, setGpListContent] = useState<ReactNode | null>(null);

  return (
    <section className="flex flex-1 flex-col">
      {/* Hero */}
      <div className="relative mesh-hero overflow-hidden">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blush-deep/35 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-sage-light/70 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-cream/80 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 container mx-auto px-4 pb-16 pt-12 md:pb-20 md:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-warm-sand-dark/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-route-teal-dark shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                NHS fertility funding
              </p>
              <h1 className="font-heading text-[2rem] font-semibold leading-[1.12] tracking-tight text-deep-slate sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                Unlock your local <span className="bg-gradient-to-r from-route-teal-dark via-moss to-route-teal-dark bg-clip-text text-transparent">IVF pathway.</span>
              </h1>
              <div className="mt-5 max-w-xl space-y-2 text-base leading-relaxed text-deep-slate/80 md:text-lg">
                <p className="font-semibold text-deep-slate">Funding rules change by area. <span className="bg-gradient-to-r from-route-teal-dark via-moss to-route-teal-dark bg-clip-text text-transparent">Sometimes by the mile.</span></p>
                <p>We turn complex local policies into clear, readable overviews, <br /> so you can navigate your IVF journey with confidence.</p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-3 text-sm text-deep-slate/75">
                <li className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 shadow-sm ring-1 ring-warm-sand-dark/40 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-route-teal" aria-hidden />
                  Updated for 2026
                </li>
                <li className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 shadow-sm ring-1 ring-warm-sand-dark/40 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 shrink-0 text-moss" aria-hidden />
                  Real health-board policies
                </li>
                <li className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 shadow-sm ring-1 ring-warm-sand-dark/40 backdrop-blur-sm">
                  <FileText className="h-4 w-4 shrink-0 text-rose-accent" aria-hidden />
                  Patient-first summaries
                </li>
              </ul>

              <div className="mt-10 max-w-xl space-y-4">
                <p className="text-sm font-medium text-deep-slate">
                  Begin with your home or GP postcode
                </p>
                <PostcodeSearch onGpListChange={setGpListContent} />
              </div>


            </motion.div>

            <div className="hidden lg:flex lg:justify-end lg:pt-4">
              <AnimatePresence mode="wait">
                {gpListContent ? (
                  <motion.div
                    key="gp-list"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.32 }}
                    className="w-full max-w-md"
                  >
                    {gpListContent}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hero-image"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden rounded-2xl ring-1 ring-warm-sand-dark/35 shadow-md"
                  >
                    <img
                      src="/assets/hand-hold.webp"
                      alt="A supportive moment between two people on their fertility journey"
                      className="block h-[28rem] w-96 max-w-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="section-muted border-y border-warm-sand-dark/45">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-deep-slate md:text-3xl">
              How Pathway to Parenthood works
            </h2>
            <p className="mt-3 text-base text-deep-slate/75">
              Three steps from postcode to eligibility, without drowning in policies.
            </p>
          </div>
          <ol className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6 md:items-start">
            {howItWorks.map((item) => (
              <li key={item.step}>
                <div className="flex flex-col rounded-2xl border border-warm-sand-dark/55 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="font-heading text-sm font-semibold text-rose-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-deep-slate">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-deep-slate/78">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-deep-slate md:text-3xl">
            Three ways to explore funding
          </h2>
          <p className="mt-3 max-w-2xl text-base text-deep-slate/75">
            Pick the route that fits. Each one connects back to the same trusted policy summaries.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const cardInner = (
                <>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-light to-white shadow-inner ring-1 ring-warm-sand-dark/35">
                    <Icon className="h-5 w-5 text-route-teal-dark" aria-hidden />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-deep-slate">{feature.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-deep-slate/78">{feature.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-route-teal-dark">
                    Open
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </>
              );

              if (feature.available) {
                return (
                  <Link
                    key={feature.title}
                    to={feature.href}
                    className="group flex flex-col rounded-2xl border border-warm-sand-dark/60 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-route-teal/35 hover:shadow-lg"
                  >
                    {cardInner}
                  </Link>
                );
              }
              return (
                <div
                  key={feature.title}
                  className="flex flex-col rounded-2xl border border-warm-sand-dark/40 bg-warm-bg/80 p-7 opacity-75"
                >
                  {cardInner}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Closing CTA */}
      <div className="cta-band border-t border-warm-sand-dark/50">
        <div className="container mx-auto flex flex-col items-start gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-xl">
            <h2 className="font-heading text-xl font-semibold text-deep-slate md:text-2xl">
              Prefer to explore visually?
            </h2>
            <p className="mt-2 text-base text-deep-slate/75">
              Open the interactive map to compare regions and jump into a health board when you are ready.
            </p>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full bg-deep-slate px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-deep-slate/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route-teal focus-visible:ring-offset-2"
          >
            View the funding map
            <Map className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* No-JS fallback */}
      <noscript>
        <div className="container mx-auto max-w-md px-4 py-8">
          <Form method="post" action="/">
            <label htmlFor="postcode-noscript" className="mb-2 block text-sm font-medium text-deep-slate">
              Enter your postcode to find your health board&apos;s fertility policy
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="postcode-noscript"
                name="postcode"
                placeholder="e.g. SW1A 1AA"
                required
                className="flex-1 rounded-xl border-2 border-warm-sand-dark px-4 py-3 text-base"
              />
              <button
                type="submit"
                className="rounded-xl bg-sage-dark px-6 py-3 font-bold text-white"
              >
                Find My Funding
              </button>
            </div>
          </Form>
        </div>
      </noscript>

      {actionData?.error ? (
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionData.error}
          </div>
        </div>
      ) : null}

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
                urlTemplate: "https://pathwaytoparenthood.uk/search?postcode={postcode}",
              },
              "query-input": "required name=postcode",
            },
          }),
        }}
      />
    </section>
  );
}
