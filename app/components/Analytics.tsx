/**
 * Plausible Analytics — privacy-first, cookie-free analytics.
 * Loads the lightweight script from plausible.io.
 * No cookies are set, no personal data is collected.
 */
export function Analytics() {
  return (
    <script
      defer
      data-domain="postcodetoparenthood.org.uk"
      src="https://plausible.io/js/script.js"
    />
  );
}
