export async function loader() {
  const body = `# FertilityFund UK

> Helping UK residents find NHS IVF funding eligibility by postcode, mapping to local health board policies, and surfacing alternative funding routes like grants, financing, and refund schemes.

This project is informational only and is not medical, legal, or financial advice. Always confirm details with your health board, clinic, and the provider of any grant or scheme.

## Pages

- [Home](https://fertilityfund.uk/): Postcode search to find your health board and its fertility funding policy.
- [Map](https://fertilityfund.uk/map): Interactive map showing regional variation in NHS fertility funding across the UK.
- [Health Board Policy Pages](https://fertilityfund.uk/sitemap.xml): Individual pages for each health board detailing cycles offered, age limits, BMI requirements, wait times, and notes.
- [Search](https://fertilityfund.uk/search): Postcode lookup to identify your local health board.

## Key Concepts

- **Health Board**: NHS organisations responsible for planning and funding healthcare services in a region, including fertility treatment. Includes ICBs (England), Health Boards (Scotland), Local Health Boards (Wales), and Health and Social Care Trusts (Northern Ireland).
- **Postcode Lookup**: Maps a UK postcode to the relevant health board using postcodes.io.
- **Policy Details**: Each health board page shows funded cycles, age limits, BMI criteria, waiting times, and additional notes.
- **Alternative Funding**: Grants, loans, refund/guarantee programmes beyond NHS eligibility.

## Data Sources

- Health board policy information is maintained in a database and updated periodically.
- Geographic boundaries are sourced from ONS/ODS data.
- Postcode resolution uses the postcodes.io API.`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
