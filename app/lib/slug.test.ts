import { describe, it, expect } from "vitest";
import { toSlug, findIcbBySlug } from "./slug";

describe("toSlug", () => {
  it("converts a document_folder_name to a URL slug", () => {
    expect(toSlug("Bath and North East Somerset, Swindon and Wiltshire")).toBe(
      "bath-and-north-east-somerset-swindon-and-wiltshire"
    );
  });

  it("removes commas and replaces spaces with hyphens", () => {
    expect(toSlug("NHS Devon")).toBe("nhs-devon");
  });

  it("handles multiple commas and spaces", () => {
    expect(toSlug("Buckinghamshire, Oxfordshire and Berkshire West")).toBe(
      "buckinghamshire-oxfordshire-and-berkshire-west"
    );
  });

  it("trims leading and trailing hyphens", () => {
    expect(toSlug(" Some Name ")).toBe("some-name");
  });

  it("collapses consecutive non-alphanumeric characters into a single hyphen", () => {
    expect(toSlug("North East & North Cumbria")).toBe(
      "north-east-north-cumbria"
    );
  });
});

describe("findIcbBySlug", () => {
  const icbs = [
    { id: "1", document_folder_name: "Bath and North East Somerset, Swindon and Wiltshire" },
    { id: "2", document_folder_name: "NHS Devon" },
    { id: "3", document_folder_name: "Buckinghamshire, Oxfordshire and Berkshire West" },
  ];

  it("finds an ICB by its slug", () => {
    const result = findIcbBySlug(icbs, "nhs-devon");
    expect(result).toEqual({ id: "2", document_folder_name: "NHS Devon" });
  });

  it("returns undefined for a non-matching slug", () => {
    const result = findIcbBySlug(icbs, "non-existent-slug");
    expect(result).toBeUndefined();
  });

  it("matches the full slug correctly", () => {
    const result = findIcbBySlug(
      icbs,
      "bath-and-north-east-somerset-swindon-and-wiltshire"
    );
    expect(result).toEqual({
      id: "1",
      document_folder_name: "Bath and North East Somerset, Swindon and Wiltshire",
    });
  });
});
