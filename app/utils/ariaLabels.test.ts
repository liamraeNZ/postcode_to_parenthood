import { describe, it, expect } from "vitest";
import { getBoardAriaLabel, getIcbAriaLabel } from "./ariaLabels";

describe("getBoardAriaLabel", () => {
  it("returns board name with cycles offered for a positive value", () => {
    expect(getBoardAriaLabel("NHS West Yorkshire", 3)).toBe(
      "NHS West Yorkshire, 3 cycles offered"
    );
  });

  it("returns board name with 0 cycles offered", () => {
    expect(getBoardAriaLabel("NHS Devon", 0)).toBe(
      "NHS Devon, 0 cycles offered"
    );
  });

  it('returns board name with "no data available" for null', () => {
    expect(getBoardAriaLabel("NHS Cornwall", null)).toBe(
      "NHS Cornwall, no data available"
    );
  });

  it("handles large cycle values", () => {
    expect(getBoardAriaLabel("NHS Somerset", 10)).toBe(
      "NHS Somerset, 10 cycles offered"
    );
  });
});

describe("getIcbAriaLabel (deprecated alias)", () => {
  it("is an alias for getBoardAriaLabel", () => {
    expect(getIcbAriaLabel("NHS West Yorkshire", 3)).toBe(
      getBoardAriaLabel("NHS West Yorkshire", 3)
    );
  });
});
