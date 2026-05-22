import { Link } from "react-router";
import { MapPin } from "lucide-react";

/**
 * Awareness section explaining that NHS IVF funding varies by postcode.
 * Includes a CTA linking to the funding map.
 * Renders on every board page to encourage exploration.
 *
 * Requirements: FR-3.4
 */
export function PostcodeLotteryNote() {
  return (
    <section
      className="rounded-2xl border border-tint/20 bg-surface px-5 py-5 md:px-6 md:py-6"
      aria-labelledby="postcode-lottery-heading"
    >
      <h3
        id="postcode-lottery-heading"
        className="font-heading text-base font-semibold text-ink mb-2"
      >
        Funding varies by postcode
      </h3>
      <p className="font-sans text-sm leading-relaxed text-ink/75 mb-4">
        NHS IVF funding varies significantly across the UK. Depending on which
        health board your GP is registered with, you may be entitled to a
        different number of cycles — or different criteria may apply. If you
        haven't already, it's worth exploring the map to understand the full
        picture.
      </p>
      <Link
        to="/map"
        className="btn-press inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        See the funding map
      </Link>
    </section>
  );
}
