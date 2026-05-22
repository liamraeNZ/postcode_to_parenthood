export async function loader() {
  const body = `# Postcode to Parenthood — Full Data Export

> This file will contain a complete structured data export of all health board policies for LLM consumption.

## Status

This endpoint is a placeholder. A full structured data export is planned for a future release.

## Planned Content

When complete, this file will include:

- All health board entries with their full policy details (cycles offered, age limits, BMI criteria, waiting times)
- Data confidence status for each entry (confirmed, inherited, under_review, unconfirmed)
- Predecessor ICB information for merged boards
- Policy dates and last verified dates
- Borough/area coverage lists
- Update history

## Current Data Access

In the meantime, structured data is available via:

- Individual board pages: https://postcodetoparenthood.org.uk/board/[slug]
- Sitemap for all board URLs: https://postcodetoparenthood.org.uk/sitemap.xml
- Summary information: https://postcodetoparenthood.org.uk/llms.txt

## Contact

For data access requests or questions about our methodology, please visit https://postcodetoparenthood.org.uk/about`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
