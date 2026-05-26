import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BoroughList, parseBoroughs } from "./BoroughList";

afterEach(() => {
  cleanup();
});

describe("BoroughList", () => {
  // Legacy flat array format tests
  it("parses a legacy JSON array string and renders boroughs as comma-separated list", () => {
    const boroughs = JSON.stringify(["Camden", "Islington", "Hackney"]);
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Camden, Hackney, Islington")).toBeInTheDocument();
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

    expect(screen.getByText("Areas covered")).toBeInTheDocument();
  });

  // New object format tests
  it("parses the new object format with boroughs and neighbourhoods", () => {
    const boroughs = JSON.stringify({
      boroughs: ["Southwark", "Lewisham"],
      neighbourhoods: ["Forest Hill", "Crystal Palace", "Sydenham"],
    });
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Lewisham, Southwark")).toBeInTheDocument();
    expect(
      screen.getByText("Including neighbourhoods: Crystal Palace, Forest Hill, Sydenham")
    ).toBeInTheDocument();
  });

  it("renders only boroughs when neighbourhoods array is empty", () => {
    const boroughs = JSON.stringify({
      boroughs: ["Bath", "Swindon"],
      neighbourhoods: [],
    });
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Bath, Swindon")).toBeInTheDocument();
    expect(screen.queryByText(/Including neighbourhoods/)).not.toBeInTheDocument();
  });

  it("handles object format with missing neighbourhoods key", () => {
    const boroughs = JSON.stringify({ boroughs: ["Cardiff"] });
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(screen.getByText("Cardiff")).toBeInTheDocument();
    expect(screen.queryByText(/Including neighbourhoods/)).not.toBeInTheDocument();
  });

  it("shows fallback when object format has empty boroughs array", () => {
    const boroughs = JSON.stringify({ boroughs: [], neighbourhoods: ["Sydenham"] });
    render(<BoroughList boroughs={boroughs} dataConfidence="confirmed" />);

    expect(
      screen.getByText("Area data being compiled. Check back soon")
    ).toBeInTheDocument();
  });
});

describe("parseBoroughs", () => {
  it("returns empty arrays for null input", () => {
    expect(parseBoroughs(null)).toEqual({ boroughs: [], neighbourhoods: [] });
  });

  it("handles legacy flat array format", () => {
    const result = parseBoroughs(JSON.stringify(["B", "A"]));
    expect(result).toEqual({ boroughs: ["A", "B"], neighbourhoods: [] });
  });

  it("handles new object format", () => {
    const result = parseBoroughs(
      JSON.stringify({ boroughs: ["X", "A"], neighbourhoods: ["Z", "B"] })
    );
    expect(result).toEqual({ boroughs: ["A", "X"], neighbourhoods: ["B", "Z"] });
  });

  it("filters invalid entries in both arrays", () => {
    const result = parseBoroughs(
      JSON.stringify({ boroughs: ["A", "", null, 5], neighbourhoods: [true, "B", ""] })
    );
    expect(result).toEqual({ boroughs: ["A"], neighbourhoods: ["B"] });
  });
});
