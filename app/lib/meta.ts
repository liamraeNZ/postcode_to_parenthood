import type { MetaDescriptor } from "react-router";

const BASE_URL = "https://postcodetoparenthood.org.uk";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Standard meta descriptors shared by all public routes.
 * Provides: canonical URL, hreflang tags, OG image with dimensions, site_name, locale.
 * Each route only needs to add its unique title, description, og:title, og:description, og:type, og:url, and twitter tags.
 */
export function standardMeta(canonicalUrl: string): MetaDescriptor[] {
  return [
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { tagName: "link", rel: "alternate", hrefLang: "en-GB", href: canonicalUrl },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "Postcode to Parenthood" },
    { property: "og:locale", content: "en_GB" },
    { name: "twitter:image", content: OG_IMAGE },
  ];
}
