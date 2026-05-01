import type { Route } from "./+types/_index";
import { Form, redirect, useActionData } from "react-router";
import { Link } from "react-router";
import { lookupPostcodeAdminLookup } from "../../worker/services/postcodesIo";
import { resolveIcbIdFromPostcodesIo, resolveDocumentFolder } from "../../worker/services/icbPolicy";
import { toSlug } from "@/lib/slug";
import { motion } from "motion/react";
import { MapPin, FileText, Map, Search } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  const title = "NHS IVF Funding Eligibility | FertilityFund UK";
  const description =
    "Check your NHS-funded IVF eligibility by postcode. Find your ICB's fertility policy, cycles offered, age limits, and criteria across England.";
  const canonicalUrl = "https://fertilityfund.co.uk";

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
      content: "https://fertilityfund.co.uk/og-image.png",
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
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  const resolved = await resolveIcbIdFromPostcodesIo(db, {
    icb: admin.icb,
    ccg_id: admin.ccg_id,
    ccg: admin.ccg,
  });

  if (!resolved) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  const documentFolder = await resolveDocumentFolder(db, resolved.icbId);

  if (!documentFolder) {
    return {
      error:
        "We couldn't find an ICB for that postcode. Please check and try again.",
    };
  }

  const slug = toSlug(documentFolder);
  return redirect(`/icb/${slug}?gpPostcode=${encodeURIComponent(postcode)}`);
}

const features = [
  {
    icon: MapPin,
    title: "Search by postcode",
    description: "Find your ICB's fertility policy based on your GP practice location.",
    href: "/search",
    available: true,
  },
  {
    icon: FileText,
    title: "ICB policies & criteria",
    description: "Browse eligibility criteria, age limits, and cycles offered by each ICB.",
    href: "/policies",
    available: false,
  },
  {
    icon: Map,
    title: "Policy map",
    description: "See how NHS fertility funding varies across England at a glance.",
    href: "/map",
    available: true,
  },
  {
    icon: Search,
    title: "Search for funding",
    description: "Explore NHS and charitable funding options available to you.",
    href: "/funding",
    available: false,
  },
];

export default function LandingPage() {
  const actionData = useActionData<typeof action>();

  return (
    <section className="flex-1 flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-deep-slate">
                NHS-funded fertility care isn't the same everywhere.
              </h1>
              <p className="text-base md:text-lg text-deep-slate/80 leading-relaxed mb-6 max-w-lg">
                Where you live affects whether you qualify for support; a "postcode lottery" that leaves many people confused. We help you understand what you're entitled to.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sage-dark hover:bg-sage-hover text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  Check your eligibility
                </Link>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-warm-sand-dark hover:border-sage-green text-deep-slate font-bold rounded-xl shadow-sm transition-all"
                >
                  <Map className="w-4 h-4" />
                  View the map
                </Link>
              </div>
            </motion.div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src="/assets/hand-hold.webp"
                alt="Two people holding hands in support"
                className="rounded-2xl shadow-xl max-h-[520px] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>



      {/* Features grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="font-heading text-xl md:text-2xl font-bold text-deep-slate mb-6">
            What we offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const content = (
                <div
                  key={feature.title}
                  className={`relative p-5 rounded-xl border transition-all ${
                    feature.available
                      ? "bg-white border-warm-sand-dark hover:border-sage-green hover:shadow-md cursor-pointer"
                      : "bg-warm-sand/50 border-warm-sand-dark opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-sage-light flex items-center justify-center">
                      <Icon className="w-4 h-4 text-sage-dark" />
                    </div>
                    {!feature.available && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-deep-slate/50 bg-warm-sand-dark px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-deep-slate text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-deep-slate/70 leading-relaxed">{feature.description}</p>
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
              Enter your postcode to find your ICB fertility policy
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="postcode-noscript"
                name="postcode"
                placeholder="e.g. SW1A 1AA"
                required
                className="flex-1 px-4 py-3 border-2 border-warm-sand-dark rounded-xl text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sage-dark text-white font-bold rounded-xl"
              >
                Find your policy
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
            name: "FertilityFund UK",
            url: "https://fertilityfund.co.uk",
            description:
              "Check your NHS-funded IVF eligibility by postcode. Find your ICB's fertility policy across England.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://fertilityfund.co.uk/search?postcode={postcode}",
              },
              "query-input": "required name=postcode",
            },
          }),
        }}
      />
    </section>
  );
}
