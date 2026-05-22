export async function loader() {
  const body = `# Postcode to Parenthood

> Helping UK residents navigate the IVF postcode lottery by postcode, mapping local NHS fertility guidance to health board policies.

This project is informational only and is not medical, legal, or financial advice. Always confirm details with your health board, clinic, and the provider of any grant or scheme.

## Pages

- [Home](https://postcodetoparenthood.org.uk/): Postcode search to find your local NHS fertility guidance.
- [Map](https://postcodetoparenthood.org.uk/map): Interactive map showing regional variation in NHS fertility funding across the UK.
- [Health Boards Index](https://postcodetoparenthood.org.uk/boards): All health boards with policy year badges.
- [Health Board Policy Pages](https://postcodetoparenthood.org.uk/sitemap.xml): Individual pages for each health board detailing cycles offered, age limits, BMI requirements, wait times, and notes.
- [Search](https://postcodetoparenthood.org.uk/search): Postcode lookup to identify your local health board.
- [About](https://postcodetoparenthood.org.uk/about): Our story, methodology, limitations, and contact information.
- [What Next: Eligible](https://postcodetoparenthood.org.uk/what-next/eligible): Guidance for patients who may be eligible for NHS-funded treatment.
- [What Next: Exploring Options](https://postcodetoparenthood.org.uk/what-next/exploring-options): Support for patients who may not be eligible or are unsure.
- [Updates](https://postcodetoparenthood.org.uk/updates): News and updates about NHS fertility policy changes.
- [Full Data Export](https://postcodetoparenthood.org.uk/llms-full.txt): Complete structured data export for LLM consumption.

## Key Concepts

- **Health Board**: NHS organisations responsible for planning and funding healthcare services in a region, including fertility treatment. Includes ICBs (England), Health Boards (Scotland), Local Health Boards (Wales), and Health and Social Care Trusts (Northern Ireland).
- **Postcode Lookup**: Maps a UK postcode to the relevant health board using postcodes.io.
- **Policy Details**: Each health board page shows funded cycles, age limits, BMI criteria, waiting times, and additional notes.
- **Local Policies**: Health board eligibility criteria, policy limits, and treatment availability.

## Data Confidence Status Flags

Each health board entry carries a data confidence status indicating how reliable the displayed information is:

- **Confirmed**: Policy data has been verified against the original ICB policy document. Source URL and policy date are available.
- **Inherited**: Board was formed through an NHS merger (e.g. April 2026 ICB mergers). Policy data is inherited from predecessor ICBs and may change as the new board establishes its own policy.
- **Under Review**: Policy data is being actively reviewed or updated. Information may be outdated.
- **Unconfirmed**: Default status. Policy data has not yet been verified against source documents.

## Methodology

We compile NHS fertility funding policies from publicly available ICB policy documents, FOI responses, and direct communication with health boards. Each board's entry includes the number of funded IVF cycles, age limits, BMI requirements, waiting times, and additional eligibility criteria. Data is structured, stored in a database, and served as individual board pages with plain English summaries. We prioritise transparency: when data is uncertain or inherited from predecessor organisations, this is clearly flagged. We do not determine eligibility — we present the published criteria and direct users to verify with their GP.

## Data Sources

- Health board policy information is maintained in a database and updated periodically.
- Geographic boundaries are sourced from ONS/ODS data.
- Postcode resolution uses the postcodes.io API.
- Policy documents sourced from individual ICB websites where available.
- April 2026 ICB merger information from NHS England organisational change announcements.`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
