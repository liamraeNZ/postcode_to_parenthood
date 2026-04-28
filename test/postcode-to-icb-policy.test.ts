import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";
import goldenPolicies from "../scripts/output/extracted-policies.json";

/**
 * End-to-end tests for the postcode → ICB → policy matching flow.
 *
 * Each test case picks a real postcode within an ICB's area, then verifies:
 *   1. /api/gp-icb?postcode=... resolves to the expected ICB code
 *   2. /api/icb-policy?icbCode=... returns policy values matching the golden
 *      file (documents/extracted-policies.json) generated from ICB PDFs
 *   3. /api/icb-documents?icbCode=... resolves the correct document folder
 *
 * These tests hit the live postcodes.io API so they require network access.
 *
 * The golden file is the source of truth for policy values. If an ICB updates
 * their policy, re-run scripts/extractPolicies.ts to regenerate the golden
 * file — the tests will then pass with the new values. If the postcode routing
 * breaks, the test fails because you'd get a different ICB's data.
 */

interface IcbTestCase {
  name: string;
  postcode: string;
  expectedIcbCode: string;
  goldenFolderName: string;
}

const ICB_TEST_CASES: IcbTestCase[] = [
  { name: "Bath and North East Somerset, Swindon and Wiltshire", postcode: "BA1 1SU", expectedIcbCode: "QOX", goldenFolderName: "Bath and North East Somerset, Swindon and Wiltshire" },
  { name: "Birmingham and Solihull", postcode: "B1 1BB", expectedIcbCode: "QHL", goldenFolderName: "Birmingham and Solihull" },
  { name: "Black Country", postcode: "WV1 1SH", expectedIcbCode: "QUA", goldenFolderName: "Black Country" },
  { name: "Bristol, North Somerset and South Gloucestershire", postcode: "BS1 1HT", expectedIcbCode: "QUY", goldenFolderName: "Bristol, North Somerset and South Gloucestershire" },
  { name: "Cornwall and the Isles of Scilly", postcode: "TR1 1EP", expectedIcbCode: "QT6", goldenFolderName: "Cornwall and the Isles of Scilly" },
  { name: "Coventry and Warwickshire", postcode: "CV1 1FE", expectedIcbCode: "QWU", goldenFolderName: "Coventry and Warwickshire" },
  { name: "Derby and Derbyshire", postcode: "DE22 1GP", expectedIcbCode: "QJ2", goldenFolderName: "Derby and Derbyshire" },
  { name: "Devon", postcode: "EX1 1EE", expectedIcbCode: "QJK", goldenFolderName: "Devon" },
  { name: "Dorset", postcode: "DT1 1JJ", expectedIcbCode: "QVV", goldenFolderName: "Dorset" },
  { name: "Gloucestershire", postcode: "GL1 1DG", expectedIcbCode: "QR1", goldenFolderName: "Gloucestershire" },
  { name: "Herefordshire and Worcestershire", postcode: "WR1 2ET", expectedIcbCode: "QGH", goldenFolderName: "Herefordshire and Worcestershire" },
  { name: "Hertfordshire and West Essex", postcode: "AL1 3QQ", expectedIcbCode: "QM7", goldenFolderName: "Hertfordshire and West Essex" },
  { name: "Kent and Medway", postcode: "ME1 1PD", expectedIcbCode: "QKS", goldenFolderName: "Kent and Medway" },
  { name: "Lancashire and South Cumbria", postcode: "LA1 1AY", expectedIcbCode: "QE1", goldenFolderName: "Lancashire and South Cumbria" },
  { name: "Lincolnshire", postcode: "LN1 1YL", expectedIcbCode: "QJM", goldenFolderName: "Lincolnshire" },
  { name: "North East and North Cumbria", postcode: "NE1 4ST", expectedIcbCode: "QHM", goldenFolderName: "North East and North Cumbria" },
  { name: "North East London", postcode: "E1 6AN", expectedIcbCode: "QMF", goldenFolderName: "North East London" },
  { name: "Northamptonshire", postcode: "NN1 1ED", expectedIcbCode: "QPM", goldenFolderName: "Northamptonshire" },
  { name: "Nottingham and Nottinghamshire", postcode: "NG1 1GF", expectedIcbCode: "QT1", goldenFolderName: "Nottingham and Nottinghamshire" },
  { name: "Shropshire, Telford and Wrekin", postcode: "SY1 1NB", expectedIcbCode: "QOC", goldenFolderName: "Shropshire, Telford and Wrekin" },
  { name: "Somerset", postcode: "TA1 1RN", expectedIcbCode: "QSL", goldenFolderName: "Somerset" },
  { name: "South East London", postcode: "SE1 7EH", expectedIcbCode: "QKK", goldenFolderName: "South East London" },
  { name: "South West London", postcode: "SW19 1AA", expectedIcbCode: "QWE", goldenFolderName: "South West London" },
  { name: "South Yorkshire", postcode: "S1 2BJ", expectedIcbCode: "QF7", goldenFolderName: "South Yorkshire" },
  { name: "Staffordshire and Stoke-on-Trent", postcode: "ST4 2DE", expectedIcbCode: "QNC", goldenFolderName: "Staffordshire and Stoke-on-Trent" },
  { name: "West Yorkshire", postcode: "LS1 1UR", expectedIcbCode: "QWO", goldenFolderName: "West Yorkshire" },
  // --- Sub-ICB test cases ---
  { name: "Cambridgeshire and Peterborough (sub-ICB 06H)", postcode: "CB2 1TN", expectedIcbCode: "06H", goldenFolderName: "Cambridgeshire and Peterborough" },
  { name: "Norfolk and Waveney (sub-ICB 06L)", postcode: "NR1 3JU", expectedIcbCode: "06L", goldenFolderName: "Norfolk and Waveney" },
  { name: "Suffolk and North East Essex (sub-ICB 07K)", postcode: "IP1 1DH", expectedIcbCode: "07K", goldenFolderName: "Suffolk and North East Essex" },
  { name: "North Central London (sub-ICB 07P)", postcode: "N1 9GU", expectedIcbCode: "07P", goldenFolderName: "North Central London" },
  { name: "North West London (sub-ICB 08Y)", postcode: "W2 1NY", expectedIcbCode: "08Y", goldenFolderName: "North West London" },
  { name: "Sussex (sub-ICB 09D)", postcode: "BN1 1EE", expectedIcbCode: "09D", goldenFolderName: "Sussex" },
  { name: "Surrey Heartlands (sub-ICB 92A)", postcode: "GU1 4PU", expectedIcbCode: "92A", goldenFolderName: "Surrey Heartlands" },
  { name: "Mid and South Essex (sub-ICB 99E)", postcode: "SS1 1AB", expectedIcbCode: "99E", goldenFolderName: "Mid and South Essex" },
];

// Build a lookup from folder name to golden policy data
const goldenByFolder = new Map(
  (goldenPolicies as Array<{ icb_folder_name: string; policies: Array<Record<string, unknown>> }>)
    .map((entry) => [entry.icb_folder_name, entry] as const)
);

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("Postcode → ICB → Policy end-to-end matching", () => {
  describe.each(ICB_TEST_CASES)("$name ($postcode)", (tc) => {
    it("resolves postcode to the expected ICB via /api/gp-icb", async () => {
      const res = await SELF.fetch(
        `https://test.local/api/gp-icb?postcode=${encodeURIComponent(tc.postcode)}`
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        icbCode: string;
        matched_on: string;
      };

      expect(body.icbCode).toBe(tc.expectedIcbCode);
      expect(body.matched_on).toBeTruthy();
    });

    it("returns policy values matching the golden file via /api/icb-policy", async () => {
      const golden = goldenByFolder.get(tc.goldenFolderName);
      expect(golden, `No golden data found for folder "${tc.goldenFolderName}"`).toBeDefined();

      const res = await SELF.fetch(
        `https://test.local/api/icb-policy?icbCode=${encodeURIComponent(tc.expectedIcbCode)}`
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        icb_name: string;
        policies: Array<{
          treatment_type_id: string;
          cycles_offered: number;
          max_age: number;
          bmi_min: number | null;
          bmi_max: number | null;
          iui_rounds_required: number;
        }>;
      };

      expect(body.icb_name).toBeTruthy();
      expect(body.policies.length).toBeGreaterThan(0);

      // Compare each treatment type present in the golden file
      for (const goldenPolicy of golden!.policies) {
        const treatmentId = (goldenPolicy.treatment_type as string).toLowerCase();
        const actual = body.policies.find((p) => p.treatment_type_id === treatmentId);

        expect(
          actual,
          `Expected treatment "${treatmentId}" for ${tc.name} but not found in API response`
        ).toBeDefined();

        expect(actual!.cycles_offered, `cycles_offered mismatch for ${treatmentId}`).toBe(
          goldenPolicy.cycles_offered ?? 0
        );
        expect(actual!.max_age, `max_age mismatch for ${treatmentId}`).toBe(
          goldenPolicy.max_age ?? 0
        );

        if (goldenPolicy.iui_rounds_required != null) {
          expect(actual!.iui_rounds_required, `iui_rounds_required mismatch for ${treatmentId}`).toBe(
            goldenPolicy.iui_rounds_required
          );
        }
      }
    });

    it("resolves the correct document folder via /api/icb-documents", async () => {
      const res = await SELF.fetch(
        `https://test.local/api/icb-documents?icbCode=${encodeURIComponent(tc.expectedIcbCode)}`
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        icbCode: string;
        folder: string;
        documents: unknown[];
      };

      expect(body.folder).toBe(tc.goldenFolderName);
    });
  });
});
