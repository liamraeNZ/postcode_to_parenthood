import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BoroughList } from "./BoroughList";

afterEach(() => {
  cleanup();
});

describe("BoroughList", () => {
  it("parses a JSON array string and renders boroughs as comma-separated list", () => {
    const boroughs = JSON.stringify(["Camden", "Islington", "Hackney"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Camden, Islington, Hackney")).toBeInTheDocument();
  });

  it("renders the 'Areas covered' label", () => {
    const boroughs = JSON.stringify(["Westminster"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Areas covered")).toBeInTheDocument();
  });

  it("shows fallback text when boroughs is null", () => {
    render(<BoroughList boroughs={null} dataConfidence="confirmed" />);

    expect(
      screen.getByText("Area data being compiled. Check back soon")
    ).toBeInTheDocument();
  });

  it("shows fallback text when boroughs is an empty JSON array", () => {
    render(<BoroughList boroughs="[]" dataConfidence="confirmed" />);

    expect(
      screen.getByText("Area data being compiled. Check back soon")
    ).toBeInTheDocument();
  });

  it("shows fallback text when boroughs is invalid JSON", () => {
    render(<BoroughList boroughs="not valid json" dataConfidence="unconfirmed" />);

    expect(
      screen.getByText("Area data being compiled. Check back soon")
    ).toBeInTheDocument();
  });

  it("adds boundary change note when dataConfidence is 'inherited'", () => {
    const boroughs = JSON.stringify(["Barnet", "Brent"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="inherited" />);

    expect(
      screen.getByText(/Boundaries may have changed following the April 2026 merger/)
    ).toBeInTheDocument();
  });

  it("does not show boundary note for non-inherited boards", () => {
    const boroughs = JSON.stringify(["Barnet", "Brent"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(
      screen.queryByText(/Boundaries may have changed/)
    ).not.toBeInTheDocument();
  });

  it("shows boundary note even when boroughs is empty for inherited boards", () => {
    render(<BoroughList boroughs={null} dataConfidence="inherited" />);

    expect(
      screen.getByText("Area data being compiled. Check back soon")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Boundaries may have changed/)
    ).toBeInTheDocument();
  });

  it("filters out non-string and empty entries from the JSON array", () => {
    const boroughs = JSON.stringify(["Camden", "", null, 42, "Islington"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Camden, Islington")).toBeInTheDocument();
  });

  it("has an accessible heading", () => {
    render(<BoroughList boroughs={null} dataConfidence="confirmed" />);

    const heading = screen.getByRole("heading", { name: /areas covered/i });
    expect(heading).toBeInTheDocument();
  });
});
