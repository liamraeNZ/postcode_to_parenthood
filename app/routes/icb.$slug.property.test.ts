import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { findIcbBySlug, toSlug } from "../lib/slug";

/**
 * Feature: seo-optimized-pages, Property 2: Invalid slug returns 404
 *
 * For any string that does not match the toSlug() output of any active ICB's
 * document_folder_name, requesting /icb/{that_string} should result in a 404 response.
 *
 * We test this by verifying that findIcbBySlug returns undefined for any random
 * string that doesn't match a known slug. In the loader, undefined triggers:
 *   throw new Response("ICB not found", { status: 404 })
 *
 * Validates: Requirements 3.8
 */
describe("Property 2: Invalid Slug Returns 404", () => {
  // Representative set of known ICBs from the database (from migration 0004)
  const knownIcbs = [
    { id: "QOX", document_folder_name: "Bath and North East Somerset, Swindon and Wiltshire" },
    { id: "QHL", document_folder_name: "Birmingham and Solihull" },
    { id: "QUA", document_folder_name: "Black Country" },
    { id: "QUY", document_folder_name: "Bristol, North Somerset and South Gloucestershire" },
    { id: "QT6", document_folder_name: "Cornwall and the Isles of Scilly" },
    { id: "QJ2", document_folder_name: "Derby and Derbyshire" },
    { id: "QJK", document_folder_name: "Devon" },
    { id: "QVV", document_folder_name: "Dorset" },
    { id: "QR1", document_folder_name: "Gloucestershire" },
    { id: "QRL", document_folder_name: "Hampshire and Isle of Wight" },
    { id: "QGH", document_folder_name: "Herefordshire and Worcestershire" },
    { id: "QM7", document_folder_name: "Hertfordshire and West Essex" },
    { id: "QKS", document_folder_name: "Kent and Medway" },
    { id: "QE1", document_folder_name: "Lancashire and South Cumbria" },
    { id: "QJM", document_folder_name: "Lincolnshire" },
    { id: "QHM", document_folder_name: "North East and North Cumbria" },
    { id: "QMF", document_folder_name: "North East London" },
    { id: "QPM", document_folder_name: "Northamptonshire" },
    { id: "QT1", document_folder_name: "Nottingham and Nottinghamshire" },
    { id: "QOC", document_folder_name: "Shropshire, Telford and Wrekin" },
    { id: "QSL", document_folder_name: "Somerset" },
    { id: "QKK", document_folder_name: "South East London" },
    { id: "QWE", document_folder_name: "South West London" },
    { id: "QF7", document_folder_name: "South Yorkshire" },
    { id: "QNC", document_folder_name: "Staffordshire and Stoke-on-Trent" },
    { id: "QWO", document_folder_name: "West Yorkshire" },
  ];

  // Pre-compute the set of valid slugs for filtering
  const validSlugs = new Set(knownIcbs.map((icb) => toSlug(icb.document_folder_name)));

  // Arbitrary that generates random strings guaranteed not to match any known slug.
  // Strategy: generate strings with characters/patterns that can't be valid slugs,
  // or filter out any accidental matches.
  const invalidSlugArb = fc
    .oneof(
      // Random alphanumeric strings with hyphens (slug-like but random)
      fc
        .array(
          fc.oneof(
            fc.constantFrom(...("abcdefghijklmnopqrstuvwxyz0123456789".split(""))),
            fc.constant("-")
          ),
          { minLength: 1, maxLength: 30 }
        )
        .map((chars) => chars.join("").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-"))
        .filter((s) => s.length > 0),
      // Strings with uppercase, special chars, spaces (clearly invalid slugs)
      fc.string({ minLength: 1, maxLength: 40 }),
      // Numeric-only strings
      fc
        .array(fc.constantFrom(...("0123456789".split(""))), { minLength: 1, maxLength: 10 })
        .map((chars) => chars.join("")),
      // Strings with underscores, dots, and other URL-unfriendly chars
      fc
        .array(
          fc.constantFrom(...("abc_def.ghi/jkl@mno!pqr#stu".split(""))),
          { minLength: 2, maxLength: 20 }
        )
        .map((chars) => chars.join(""))
    )
    .filter((s) => !validSlugs.has(s));

  it("findIcbBySlug returns undefined for any string not matching a known slug", () => {
    fc.assert(
      fc.property(invalidSlugArb, (randomSlug) => {
        const result = findIcbBySlug(knownIcbs, randomSlug);
        expect(result).toBeUndefined();
      }),
      { numRuns: 200 }
    );
  });

  it("the loader would throw 404 for invalid slugs (simulated loader logic)", () => {
    fc.assert(
      fc.property(invalidSlugArb, (randomSlug) => {
        const matched = findIcbBySlug(knownIcbs, randomSlug);

        // Simulate the loader's 404 logic
        if (!matched) {
          const response = new Response("ICB not found", { status: 404 });
          expect(response.status).toBe(404);
        } else {
          // This should never happen due to our filter, but if it does, fail
          expect.fail(`Slug "${randomSlug}" unexpectedly matched an ICB`);
        }
      }),
      { numRuns: 200 }
    );
  });

  it("empty string does not match any ICB", () => {
    const result = findIcbBySlug(knownIcbs, "");
    expect(result).toBeUndefined();
  });

  it("strings with only special characters do not match any ICB", () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.constantFrom(...("!@#$%^&*()+=[]{}|;:',.<>?/~`".split(""))), {
            minLength: 1,
            maxLength: 20,
          })
          .map((chars) => chars.join("")),
        (specialChars) => {
          const result = findIcbBySlug(knownIcbs, specialChars);
          expect(result).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

import { meta } from "./icb.$slug";

/**
 * Feature: seo-optimized-pages, Property 3: ICB page meta tags are complete
 *
 * For any active ICB with a non-null document_folder_name and at least one policy,
 * the meta output for its policy page should include:
 * - A title containing the ICB name and "IVF Funding Policy"
 * - A canonical URL matching /icb/{slug}
 * - Open Graph tags (og:title, og:description, og:url) containing ICB-specific content
 *
 * Validates: Requirements 3.2, 3.6, 3.7
 */
describe("Property 3: ICB Page Meta Tags Are Complete and ICB-Specific", () => {
  // Arbitrary for generating ICB names (realistic-looking names with words and commas)
  const icbNameArb = fc
    .array(
      fc.oneof(
        fc.constantFrom(
          "North",
          "South",
          "East",
          "West",
          "Central",
          "Greater",
          "Upper",
          "Lower",
          "New",
          "Old"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 2, maxLength: 5 }
    )
    .map((words) => words.join(" "));

  // Arbitrary for generating document_folder_name (may include commas)
  const documentFolderNameArb = fc
    .array(icbNameArb, { minLength: 1, maxLength: 3 })
    .map((parts) => parts.join(", "));

  // Arbitrary for generating a single policy
  const policyArb = fc.record({
    treatment_type_id: fc.constantFrom("ivf", "icsi", "iui", "fet"),
    treatment_type_name: fc.constantFrom("IVF", "ICSI", "IUI", "Frozen Embryo Transfer"),
    cycles_offered: fc.integer({ min: 0, max: 5 }),
    min_age: fc.option(fc.integer({ min: 18, max: 30 }), { nil: null }),
    max_age: fc.integer({ min: 35, max: 45 }),
    bmi_min: fc.option(fc.integer({ min: 18, max: 22 }), { nil: null }),
    bmi_max: fc.option(fc.integer({ min: 25, max: 40 }), { nil: null }),
    amh_min_pmol: fc.option(fc.double({ min: 1, max: 10 }), { nil: null }),
    fsh_max_iu: fc.option(fc.double({ min: 5, max: 20 }), { nil: null }),
    iui_rounds_required: fc.integer({ min: 0, max: 6 }),
    endometriosis_priority_access: fc.boolean(),
    smoking_restricted: fc.boolean(),
    living_children_rule: fc.option(
      fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      { nil: null }
    ),
    additional_notes: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: null }),
    updated_at: fc.integer({ min: 2023, max: 2025 }).chain((year) =>
      fc.integer({ min: 1, max: 12 }).chain((month) =>
        fc.integer({ min: 1, max: 28 }).map((day) =>
          `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000Z`
        )
      )
    ),
    effective_from: fc.constant("2024-01-01"),
    effective_to: fc.option(fc.constant("2025-12-31"), { nil: null }),
  });

  // Arbitrary for generating ICB data with at least one policy
  const icbDataArb = fc
    .tuple(
      fc.string({ minLength: 3, maxLength: 5 }).map((s) => s.toUpperCase().replace(/[^A-Z0-9]/g, "X")),
      icbNameArb,
      documentFolderNameArb,
      fc.array(policyArb, { minLength: 1, maxLength: 4 })
    )
    .map(([id, name, document_folder_name, policies]) => ({
      icb: { id, name, document_folder_name },
      policies,
      slug: toSlug(document_folder_name),
    }));

  it("meta output contains title with ICB name and 'IVF Funding Policy'", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const metaResult = meta({ data } as any);

        // Find the title entry
        const titleEntry = metaResult.find(
          (entry: any) => "title" in entry
        ) as { title: string } | undefined;

        expect(titleEntry).toBeDefined();
        expect(titleEntry!.title).toContain(data.icb.name);
        expect(titleEntry!.title).toContain("IVF Funding Policy");
      }),
      { numRuns: 100 }
    );
  });

  it("meta output contains canonical URL matching /icb/{slug}", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const metaResult = meta({ data } as any);

        // Find the canonical link entry
        const canonicalEntry = metaResult.find(
          (entry: any) => entry.tagName === "link" && entry.rel === "canonical"
        ) as { href: string } | undefined;

        expect(canonicalEntry).toBeDefined();
        expect(canonicalEntry!.href).toBe(`https://fertilityfund.uk/icb/${data.slug}`);
      }),
      { numRuns: 100 }
    );
  });

  it("meta output contains OG tags with ICB-specific content", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const metaResult = meta({ data } as any);

        // Find og:title
        const ogTitle = metaResult.find(
          (entry: any) => entry.property === "og:title"
        ) as { content: string } | undefined;
        expect(ogTitle).toBeDefined();
        expect(ogTitle!.content).toContain(data.icb.name);

        // Find og:description
        const ogDescription = metaResult.find(
          (entry: any) => entry.property === "og:description"
        ) as { content: string } | undefined;
        expect(ogDescription).toBeDefined();
        expect(ogDescription!.content).toContain(data.icb.name);

        // Find og:url
        const ogUrl = metaResult.find(
          (entry: any) => entry.property === "og:url"
        ) as { content: string } | undefined;
        expect(ogUrl).toBeDefined();
        expect(ogUrl!.content).toBe(`https://fertilityfund.uk/icb/${data.slug}`);
      }),
      { numRuns: 100 }
    );
  });

  it("all required meta tags are present in a single assertion", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const metaResult = meta({ data } as any);

        // Title with ICB name
        const titleEntry = metaResult.find((entry: any) => "title" in entry) as { title: string } | undefined;
        expect(titleEntry).toBeDefined();
        expect(titleEntry!.title).toContain(data.icb.name);
        expect(titleEntry!.title).toContain("IVF Funding Policy");

        // Canonical URL
        const canonicalEntry = metaResult.find(
          (entry: any) => entry.tagName === "link" && entry.rel === "canonical"
        ) as { href: string } | undefined;
        expect(canonicalEntry).toBeDefined();
        expect(canonicalEntry!.href).toContain(`/icb/${data.slug}`);

        // OG tags with ICB-specific content
        const ogTitle = metaResult.find((entry: any) => entry.property === "og:title") as { content: string } | undefined;
        const ogDescription = metaResult.find((entry: any) => entry.property === "og:description") as { content: string } | undefined;
        const ogUrl = metaResult.find((entry: any) => entry.property === "og:url") as { content: string } | undefined;

        expect(ogTitle).toBeDefined();
        expect(ogTitle!.content).toContain(data.icb.name);

        expect(ogDescription).toBeDefined();
        expect(ogDescription!.content).toContain(data.icb.name);

        expect(ogUrl).toBeDefined();
        expect(ogUrl!.content).toContain(`/icb/${data.slug}`);
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: seo-optimized-pages, Property 4: ICB page meta description contains policy data
 *
 * For any active ICB with policies, the meta description for its policy page should
 * contain the number of cycles offered and the maximum age from the ICB's primary (IVF) policy.
 *
 * We generate random ICB data with an IVF policy that has varying cycles_offered (1-5)
 * and max_age (35-45), call the meta function directly, and verify the description
 * includes those values.
 *
 * Validates: Requirements 3.3
 */
describe("Property 4: ICB Page Meta Description Contains Policy Data", () => {
  // Arbitrary for generating ICB names
  const icbNameArb = fc
    .array(
      fc.oneof(
        fc.constantFrom(
          "North",
          "South",
          "East",
          "West",
          "Central",
          "Greater",
          "Upper",
          "Lower",
          "New",
          "Old"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 2, maxLength: 5 }
    )
    .map((words) => words.join(" "));

  // Arbitrary for generating document_folder_name (may include commas)
  const documentFolderNameArb = fc
    .array(icbNameArb, { minLength: 1, maxLength: 3 })
    .map((parts) => parts.join(", "));

  // Arbitrary for generating an IVF policy with cycles_offered 1-5 and max_age 35-45
  const ivfPolicyArb = fc.record({
    treatment_type_id: fc.constant("ivf"),
    treatment_type_name: fc.constant("IVF"),
    cycles_offered: fc.integer({ min: 1, max: 5 }),
    min_age: fc.option(fc.integer({ min: 18, max: 30 }), { nil: null }),
    max_age: fc.integer({ min: 35, max: 45 }),
    bmi_min: fc.option(fc.integer({ min: 18, max: 22 }), { nil: null }),
    bmi_max: fc.option(fc.integer({ min: 25, max: 40 }), { nil: null }),
    amh_min_pmol: fc.option(fc.double({ min: 1, max: 10 }), { nil: null }),
    fsh_max_iu: fc.option(fc.double({ min: 5, max: 20 }), { nil: null }),
    iui_rounds_required: fc.integer({ min: 0, max: 6 }),
    endometriosis_priority_access: fc.boolean(),
    smoking_restricted: fc.boolean(),
    living_children_rule: fc.option(
      fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      { nil: null }
    ),
    additional_notes: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: null }),
    updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
    effective_from: fc.constant("2024-01-01"),
    effective_to: fc.option(fc.constant("2025-12-31"), { nil: null }),
  });

  // Arbitrary for generating full ICB data with an IVF policy
  const icbWithIvfPolicyArb = fc
    .tuple(
      fc.string({ minLength: 3, maxLength: 5 }).map((s) => s.toUpperCase().replace(/[^A-Z0-9]/g, "X")),
      icbNameArb,
      documentFolderNameArb,
      ivfPolicyArb
    )
    .map(([id, name, document_folder_name, ivfPolicy]) => ({
      icb: { id, name, document_folder_name },
      policies: [ivfPolicy],
      slug: toSlug(document_folder_name),
    }));

  it("meta description contains the number of cycles offered", () => {
    fc.assert(
      fc.property(icbWithIvfPolicyArb, (data) => {
        const metaResult = meta({ data } as any);

        const descriptionEntry = metaResult.find(
          (entry: any) => entry.name === "description"
        ) as { content: string } | undefined;

        expect(descriptionEntry).toBeDefined();
        expect(descriptionEntry!.content).toContain(
          String(data.policies[0].cycles_offered)
        );
      }),
      { numRuns: 100 }
    );
  });

  it("meta description contains the maximum age from the IVF policy", () => {
    fc.assert(
      fc.property(icbWithIvfPolicyArb, (data) => {
        const metaResult = meta({ data } as any);

        const descriptionEntry = metaResult.find(
          (entry: any) => entry.name === "description"
        ) as { content: string } | undefined;

        expect(descriptionEntry).toBeDefined();
        expect(descriptionEntry!.content).toContain(
          String(data.policies[0].max_age)
        );
      }),
      { numRuns: 100 }
    );
  });

  it("meta description contains both cycles and max age together", () => {
    fc.assert(
      fc.property(icbWithIvfPolicyArb, (data) => {
        const metaResult = meta({ data } as any);

        const descriptionEntry = metaResult.find(
          (entry: any) => entry.name === "description"
        ) as { content: string } | undefined;

        expect(descriptionEntry).toBeDefined();

        const description = descriptionEntry!.content;
        const cycles = data.policies[0].cycles_offered;
        const maxAge = data.policies[0].max_age;

        // Description must contain both the cycles count and max age
        expect(description).toContain(String(cycles));
        expect(description).toContain(String(maxAge));

        // Description should also mention the ICB name
        expect(description).toContain(data.icb.name);
      }),
      { numRuns: 100 }
    );
  });
});


import { renderToReadableStream } from "react-dom/server";
import { createElement } from "react";
import { PolicyCard, type Policy } from "./icb.$slug";

/**
 * Feature: seo-optimized-pages, Property 5: ICB page displays all required policy fields
 *
 * For any active ICB with policies, the rendered policy page content should include
 * the cycles offered, maximum age, IUI rounds required, living children rule, and
 * BMI requirements (when present) from the policy data.
 *
 * We generate random policy data, render the PolicyCard component using renderToReadableStream,
 * and verify the HTML output contains all required fields.
 *
 * Validates: Requirements 3.5
 */
describe("Property 5: ICB Page Displays All Required Policy Fields", () => {
  // Helper to render a PolicyCard to HTML string
  async function renderPolicyCard(policy: Policy): Promise<string> {
    const stream = await renderToReadableStream(
      createElement(PolicyCard, { policy })
    );
    const reader = stream.getReader();
    let html = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    return html;
  }

  // Arbitrary for generating a policy with all required fields populated
  const policyArb = fc.record({
    treatment_type_id: fc.constantFrom("ivf", "icsi", "iui", "fet"),
    treatment_type_name: fc.constantFrom("IVF", "ICSI", "IUI", "Frozen Embryo Transfer"),
    cycles_offered: fc.integer({ min: 0, max: 5 }),
    min_age: fc.option(fc.integer({ min: 18, max: 30 }), { nil: null }),
    max_age: fc.integer({ min: 35, max: 50 }),
    bmi_min: fc.option(fc.integer({ min: 18, max: 22 }), { nil: null }),
    bmi_max: fc.option(fc.integer({ min: 25, max: 40 }), { nil: null }),
    amh_min_pmol: fc.option(fc.double({ min: 1, max: 10 }), { nil: null }),
    fsh_max_iu: fc.option(fc.double({ min: 5, max: 20 }), { nil: null }),
    iui_rounds_required: fc.integer({ min: 0, max: 6 }),
    endometriosis_priority_access: fc.boolean(),
    smoking_restricted: fc.boolean(),
    living_children_rule: fc.option(
      fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      { nil: null }
    ),
    additional_notes: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: null }),
    updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
    effective_from: fc.constant("2024-01-01"),
    effective_to: fc.option(fc.constant("2025-12-31"), { nil: null }),
  });

  it("rendered output contains cycles offered value", () => {
    fc.assert(
      fc.asyncProperty(policyArb, async (policy) => {
        const html = await renderPolicyCard(policy);

        // The component displays cycles_offered as a number or "Not funded" for 0
        if (policy.cycles_offered > 0) {
          expect(html).toContain(String(policy.cycles_offered));
        } else {
          expect(html).toContain("Not funded");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered output contains maximum age value", () => {
    fc.assert(
      fc.asyncProperty(policyArb, async (policy) => {
        const html = await renderPolicyCard(policy);

        // The component displays max_age in the Age Range section
        if (policy.max_age > 0) {
          expect(html).toContain(String(policy.max_age));
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered output contains IUI rounds required value", () => {
    fc.assert(
      fc.asyncProperty(policyArb, async (policy) => {
        const html = await renderPolicyCard(policy);

        // The component displays iui_rounds_required or "None" for 0
        if (policy.iui_rounds_required > 0) {
          expect(html).toContain(String(policy.iui_rounds_required));
        } else {
          expect(html).toContain("None");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered output contains living children rule when present", () => {
    // Use a policy that always has a living_children_rule set
    const policyWithLivingChildrenArb = fc.record({
      treatment_type_id: fc.constant("ivf"),
      treatment_type_name: fc.constant("IVF"),
      cycles_offered: fc.integer({ min: 1, max: 3 }),
      min_age: fc.option(fc.integer({ min: 18, max: 30 }), { nil: null }),
      max_age: fc.integer({ min: 35, max: 45 }),
      bmi_min: fc.option(fc.integer({ min: 18, max: 22 }), { nil: null }),
      bmi_max: fc.option(fc.integer({ min: 25, max: 40 }), { nil: null }),
      amh_min_pmol: fc.constant(null),
      fsh_max_iu: fc.constant(null),
      iui_rounds_required: fc.integer({ min: 0, max: 6 }),
      endometriosis_priority_access: fc.boolean(),
      smoking_restricted: fc.boolean(),
      living_children_rule: fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      additional_notes: fc.constant(null),
      updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
      effective_from: fc.constant("2024-01-01"),
      effective_to: fc.constant(null),
    });

    fc.assert(
      fc.asyncProperty(policyWithLivingChildrenArb, async (policy) => {
        const html = await renderPolicyCard(policy);
        expect(html).toContain(policy.living_children_rule!);
      }),
      { numRuns: 100 }
    );
  });

  it("rendered output contains BMI requirements when present", () => {
    // Use a policy that always has BMI values set
    const policyWithBmiArb = fc.record({
      treatment_type_id: fc.constant("ivf"),
      treatment_type_name: fc.constant("IVF"),
      cycles_offered: fc.integer({ min: 1, max: 3 }),
      min_age: fc.constant(null),
      max_age: fc.integer({ min: 35, max: 45 }),
      bmi_min: fc.integer({ min: 18, max: 22 }),
      bmi_max: fc.integer({ min: 25, max: 40 }),
      amh_min_pmol: fc.constant(null),
      fsh_max_iu: fc.constant(null),
      iui_rounds_required: fc.integer({ min: 0, max: 6 }),
      endometriosis_priority_access: fc.boolean(),
      smoking_restricted: fc.boolean(),
      living_children_rule: fc.constant(null),
      additional_notes: fc.constant(null),
      updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
      effective_from: fc.constant("2024-01-01"),
      effective_to: fc.constant(null),
    });

    fc.assert(
      fc.asyncProperty(policyWithBmiArb, async (policy) => {
        const html = await renderPolicyCard(policy);

        // The component displays BMI as "bmi_min to bmi_max"
        expect(html).toContain(String(policy.bmi_min));
        expect(html).toContain(String(policy.bmi_max));
      }),
      { numRuns: 100 }
    );
  });

  it("rendered output contains all required fields together", () => {
    // Generate a policy with all fields populated to verify they all appear
    const fullPolicyArb = fc.record({
      treatment_type_id: fc.constant("ivf"),
      treatment_type_name: fc.constant("IVF"),
      cycles_offered: fc.integer({ min: 1, max: 5 }),
      min_age: fc.integer({ min: 18, max: 30 }),
      max_age: fc.integer({ min: 35, max: 50 }),
      bmi_min: fc.integer({ min: 18, max: 22 }),
      bmi_max: fc.integer({ min: 25, max: 40 }),
      amh_min_pmol: fc.constant(null),
      fsh_max_iu: fc.constant(null),
      iui_rounds_required: fc.integer({ min: 1, max: 6 }),
      endometriosis_priority_access: fc.boolean(),
      smoking_restricted: fc.boolean(),
      living_children_rule: fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      additional_notes: fc.constant(null),
      updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
      effective_from: fc.constant("2024-01-01"),
      effective_to: fc.constant(null),
    });

    fc.assert(
      fc.asyncProperty(fullPolicyArb, async (policy) => {
        const html = await renderPolicyCard(policy);

        // Cycles offered
        expect(html).toContain(String(policy.cycles_offered));

        // Maximum age
        expect(html).toContain(String(policy.max_age));

        // IUI rounds required
        expect(html).toContain(String(policy.iui_rounds_required));

        // Living children rule
        expect(html).toContain(policy.living_children_rule!);

        // BMI requirements
        expect(html).toContain(String(policy.bmi_min));
        expect(html).toContain(String(policy.bmi_max));
      }),
      { numRuns: 100 }
    );
  });
});


import { buildStructuredData } from "./icb.$slug";

/**
 * Feature: seo-optimized-pages, Property 6: ICB page has valid structured data
 *
 * For any active ICB policy page, the page should include a JSON-LD script block
 * with valid JSON that uses the "FAQPage" schema type from schema.org.
 *
 * We generate random ICB data (name, document_folder_name) and policies,
 * call buildStructuredData directly, and verify the output is valid JSON
 * with @type: "FAQPage" and @context: "https://schema.org".
 *
 * Validates: Requirements 3.4
 */
describe("Property 6: ICB Page Has Valid Structured Data", () => {
  // Arbitrary for generating ICB names
  const icbNameArb = fc
    .array(
      fc.oneof(
        fc.constantFrom(
          "North",
          "South",
          "East",
          "West",
          "Central",
          "Greater",
          "Upper",
          "Lower",
          "New",
          "Old"
        ),
        fc.stringMatching(/^[A-Z][a-z]{2,10}$/)
      ),
      { minLength: 2, maxLength: 5 }
    )
    .map((words) => words.join(" "));

  // Arbitrary for generating document_folder_name
  const documentFolderNameArb = fc
    .array(icbNameArb, { minLength: 1, maxLength: 3 })
    .map((parts) => parts.join(", "));

  // Arbitrary for generating a policy
  const policyArb: fc.Arbitrary<Policy> = fc.record({
    treatment_type_id: fc.constantFrom("ivf", "icsi", "iui", "fet"),
    treatment_type_name: fc.constantFrom("IVF", "ICSI", "IUI", "Frozen Embryo Transfer"),
    cycles_offered: fc.integer({ min: 0, max: 5 }),
    min_age: fc.option(fc.integer({ min: 18, max: 30 }), { nil: null }),
    max_age: fc.integer({ min: 35, max: 50 }),
    bmi_min: fc.option(fc.integer({ min: 18, max: 22 }), { nil: null }),
    bmi_max: fc.option(fc.integer({ min: 25, max: 40 }), { nil: null }),
    amh_min_pmol: fc.option(fc.double({ min: 1, max: 10 }), { nil: null }),
    fsh_max_iu: fc.option(fc.double({ min: 5, max: 20 }), { nil: null }),
    iui_rounds_required: fc.integer({ min: 0, max: 6 }),
    endometriosis_priority_access: fc.boolean(),
    smoking_restricted: fc.boolean(),
    living_children_rule: fc.option(
      fc.constantFrom(
        "No living children",
        "No living or adopted children",
        "No children from current relationship"
      ),
      { nil: null }
    ),
    additional_notes: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: null }),
    updated_at: fc.constant("2024-06-15T00:00:00.000Z"),
    effective_from: fc.constant("2024-01-01"),
    effective_to: fc.option(fc.constant("2025-12-31"), { nil: null }),
  });

  // Arbitrary for generating ICB data with policies (always includes an IVF policy)
  const icbDataArb = fc
    .tuple(
      icbNameArb,
      documentFolderNameArb,
      fc.array(policyArb, { minLength: 0, maxLength: 3 })
    )
    .map(([name, document_folder_name, otherPolicies]) => ({
      icb: { name },
      policies: otherPolicies,
      slug: toSlug(document_folder_name),
    }));

  // Arbitrary that always includes an IVF policy
  const icbDataWithIvfArb = fc
    .tuple(
      icbNameArb,
      documentFolderNameArb,
      policyArb.filter((p) => p.treatment_type_id === "ivf" || true).map((p) => ({
        ...p,
        treatment_type_id: "ivf" as const,
        treatment_type_name: "IVF" as const,
      })),
      fc.array(policyArb, { minLength: 0, maxLength: 2 })
    )
    .map(([name, document_folder_name, ivfPolicy, otherPolicies]) => ({
      icb: { name },
      policies: [ivfPolicy, ...otherPolicies],
      slug: toSlug(document_folder_name),
    }));

  it("buildStructuredData output is valid JSON (serializable and parseable)", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        // Verify it can be serialized to JSON and parsed back
        const jsonString = JSON.stringify(result);
        const parsed = JSON.parse(jsonString);

        expect(parsed).toEqual(result);
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData output has @type 'FAQPage'", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        expect(result["@type"]).toBe("FAQPage");
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData output has @context 'https://schema.org'", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        expect(result["@context"]).toBe("https://schema.org");
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData output has correct canonical URL", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        expect(result.url).toBe(`https://fertilityfund.uk/icb/${data.slug}`);
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData output has mainEntity array", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        expect(Array.isArray(result.mainEntity)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData with IVF policy produces FAQ entries with correct @type", () => {
    fc.assert(
      fc.property(icbDataWithIvfArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        // When there's an IVF policy, there should be at least 2 FAQ entries
        // (cycles question + age limit question)
        expect(result.mainEntity.length).toBeGreaterThanOrEqual(2);

        // Each entry should have @type "Question" with an acceptedAnswer of @type "Answer"
        for (const entry of result.mainEntity) {
          expect(entry["@type"]).toBe("Question");
          expect(entry.name).toBeDefined();
          expect(typeof entry.name).toBe("string");
          expect(entry.acceptedAnswer["@type"]).toBe("Answer");
          expect(entry.acceptedAnswer.text).toBeDefined();
          expect(typeof entry.acceptedAnswer.text).toBe("string");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("buildStructuredData output name contains ICB name", () => {
    fc.assert(
      fc.property(icbDataArb, (data) => {
        const result = buildStructuredData(data.icb, data.policies, data.slug);

        expect(result.name).toContain(data.icb.name);
      }),
      { numRuns: 100 }
    );
  });
});
