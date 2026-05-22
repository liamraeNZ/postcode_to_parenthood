import { describe, it, expect } from "vitest";
import { generatePlainEnglishSummary, type SummaryPolicy } from "./generateSummary";

describe("generatePlainEnglishSummary", () => {
  const icbName = "NHS West and North London ICB";

  it("returns zero-cycles message when cycles_offered is 0", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 0,
      min_age: null,
      max_age: 42,
      bmi_min: 19,
      bmi_max: 30,
      living_children_rule: "No living children",
      smoking_restricted: true,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toBe(
      "NHS West and North London ICB does not currently fund IVF cycles through the NHS."
    );
  });

  it("includes cycles count with correct pluralisation for 1 cycle", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 1,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("1 cycle of IVF");
    expect(result).not.toContain("cycles");
  });

  it("includes cycles count with correct pluralisation for multiple cycles", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 3,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("3 cycles of IVF");
  });

  it("includes age range when both min_age and max_age are present", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: 23,
      max_age: 42,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("be aged 23–42");
  });

  it("includes 'be under max_age' when only max_age is present", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 40,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("be under 40");
  });

  it("omits age clause when max_age is 0 and min_age is null", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).not.toContain("age");
    expect(result).not.toContain("under");
  });

  it("includes BMI range when both bmi_min and bmi_max are present", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: 19,
      bmi_max: 30,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("have a BMI between 19 and 30");
  });

  it("includes BMI max only when bmi_min is null", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: 35,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("have a BMI of 35 or below");
  });

  it("omits BMI clause when both bmi_min and bmi_max are null", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).not.toContain("BMI");
  });

  it("includes living children clause when living_children_rule is populated", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: "No living children from any relationship",
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("have no living children from any relationship");
  });

  it("omits living children clause when living_children_rule is null", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).not.toContain("children");
  });

  it("includes smoking clause when smoking_restricted is true", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: true,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toContain("Both partners must be non-smokers.");
  });

  it("omits smoking clause when smoking_restricted is false", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).not.toContain("smoker");
  });

  it("builds a full summary with all fields populated", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 3,
      min_age: 23,
      max_age: 42,
      bmi_min: 19,
      bmi_max: 30,
      living_children_rule: "No living children from any relationship",
      smoking_restricted: true,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toBe(
      "NHS West and North London ICB currently funds 3 cycles of IVF for eligible patients. " +
        "To qualify, you generally need to be aged 23–42, have a BMI between 19 and 30, " +
        "have no living children from any relationship. Both partners must be non-smokers."
    );
  });

  it("produces only the cycles sentence when no criteria fields are populated", () => {
    const policy: SummaryPolicy = {
      cycles_offered: 2,
      min_age: null,
      max_age: 0,
      bmi_min: null,
      bmi_max: null,
      living_children_rule: null,
      smoking_restricted: false,
    };

    const result = generatePlainEnglishSummary(icbName, policy);
    expect(result).toBe(
      "NHS West and North London ICB currently funds 2 cycles of IVF for eligible patients."
    );
  });
});
