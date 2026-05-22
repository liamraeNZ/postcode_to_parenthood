import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

afterEach(() => {
  cleanup();
});

describe("StatusBadge", () => {
  it("renders 'Confirmed' with green background", () => {
    render(<StatusBadge dataConfidence="confirmed" />);
    const badge = screen.getByText("Confirmed");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-[#6B8F71]");
    expect(badge.className).toContain("text-white");
  });

  it("renders 'Inherited' with amber background", () => {
    render(<StatusBadge dataConfidence="inherited" />);
    const badge = screen.getByText("Inherited");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-[#C4785A]");
    expect(badge.className).toContain("text-white");
  });

  it("renders 'Under Review' with amber background", () => {
    render(<StatusBadge dataConfidence="under_review" />);
    const badge = screen.getByText("Under Review");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-[#C4785A]");
    expect(badge.className).toContain("text-white");
  });

  it("renders 'Unconfirmed' with grey background and dark text", () => {
    render(<StatusBadge dataConfidence="unconfirmed" />);
    const badge = screen.getByText("Unconfirmed");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-gray-200");
    expect(badge.className).toContain("text-gray-700");
  });

  it("renders as a pill shape with rounded-full", () => {
    render(<StatusBadge dataConfidence="confirmed" />);
    const badge = screen.getByText("Confirmed");
    expect(badge.className).toContain("rounded-full");
  });

  it("accepts additional className", () => {
    render(<StatusBadge dataConfidence="confirmed" className="ml-2" />);
    const badge = screen.getByText("Confirmed");
    expect(badge.className).toContain("ml-2");
  });
});
