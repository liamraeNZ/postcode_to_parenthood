import { describe, it, expect } from "vitest";
import { getIcbAriaLabel } from "./ariaLabels";

describe("getIcbAriaLabel", () => {
  it("returns ICB name with cycles offered for a positive value", () => {
    expect(getIcbAriaLabel("NHS West Yorkshire", 3)).toBe(
      "NHS West Yorkshire, 3 cycles offered"
    );
  });

  it("returns ICB name with 0 cycles offered", () => {
    expect(getIcbAriaLabel("NHS Devon", 0)).toBe(
      "NHS Devon, 0 cycles offered"
    );
  });

  it('returns ICB name with "no data available" for null', () => {
    expect(getIcbAriaLabel("NHS Cornwall", null)).toBe(
      "NHS Cornwall, no data available"
    );
  });

  it("handles large cycle values", () => {
    expect(getIcbAriaLabel("NHS Somerset", 10)).toBe(
      "NHS Somerset, 10 cycles offered"
    );
  });
});
