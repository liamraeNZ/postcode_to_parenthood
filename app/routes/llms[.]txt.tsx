export async function loader() {
  const body = `# FertilityFund UK

> Helping UK residents find NHS IVF funding eligibility by postcode, mapping to local Integrated Care Board (ICB) policies, and surfacing alternative funding routes like grants, financing, and refund schemes.

This project is informational only and is not medical, legal, or financial advice. Always confirm details with your ICB, clinic, and the provider of any grant or scheme.

## Pages

- [Home](https://fertilityfund.co.uk/): Postcode search to find your ICB and its fertility funding policy.
- [Map](https://fertilityfund.co.uk/map): Interactive map showing regional variation in NHS fertility funding across England.
- [ICB Policy Pages](https://fertilityfund.co.uk/sitemap.xml): Individual pages for each ICB detailing cycles offered, age limits, BMI requirements, wait times, and notes.
- [Search](https://fertilityfund.co.uk/search): Postcode lookup to identify your local ICB.

## Key Concepts

- **ICB (Integrated Care Board)**: NHS organisations responsible for planning and funding healthcare services in a region, including fertility treatment.
- **Postcode Lookup**: Maps a UK postcode to the relevant ICB using postcodes.io.
- **Policy Details**: Each ICB page shows funded cycles, age limits, BMI criteria, waiting times, and additional notes.
- **Alternative Funding**: Grants, loans, refund/guarantee programmes beyond NHS eligibility.

## Data Sources

- ICB policy information is maintained in a database and updated periodically.
- Geographic boundaries are sourced from ONS/ODS data.
- Postcode resolution uses the postcodes.io API.`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
