export async function loader() {
  const body = `# Postcode to Parenthood

> Helping UK residents navigate the IVF postcode lottery by postcode, mapping local NHS fertility guidance to health board policies.

This project is informational only and is not medical, legal, or financial advice. Always confirm details with your health board, clinic, and the provider of any grant or scheme.

## Pages

- [Home](https://postcodetoparenthood.org.uk/): Postcode search to find your local NHS fertility guidance.
- [Map](https://postcodetoparenthood.org.uk/map): Interactive map showing regional variation in NHS fertility funding across the UK.
- [Health Board Policy Pages](https://postcodetoparenthood.org.uk/sitemap.xml): Individual pages for each health board detailing cycles offered, age limits, BMI requirements, wait times, and notes.
- [Search](https://postcodetoparenthood.org.uk/search): Postcode lookup to identify your local health board.

## Key Concepts

- **Health Board**: NHS organisations responsible for planning and funding healthcare services in a region, including fertility treatment. Includes ICBs (England), Health Boards (Scotland), Local Health Boards (Wales), and Health and Social Care Trusts (Northern Ireland).
- **Postcode Lookup**: Maps a UK postcode to the relevant health board using postcodes.io.
- **Policy Details**: Each health board page shows funded cycles, age limits, BMI criteria, waiting times, and additional notes.
- **Local Policies**: Health board eligibility criteria, policy limits, and treatment availability.

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
