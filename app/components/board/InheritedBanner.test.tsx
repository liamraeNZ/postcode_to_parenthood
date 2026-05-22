import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { InheritedBanner } from "./InheritedBanner";

afterEach(() => {
  cleanup();
});

describe("InheritedBanner", () => {
  it("renders the banner with predecessor ICB name interpolated", () => {
    render(<InheritedBanner predecessorIcb="North West London ICB, North Central London ICB" />);
    expect(
      screen.getByText("North West London ICB, North Central London ICB")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/inherited from/i)
    ).toBeInTheDocument();
  });

  it("includes the full approved copy", () => {
    render(<InheritedBanner predecessorIcb="Surrey Heartlands ICB, Sussex ICB" />);
    expect(
      screen.getByText(/formed in April 2026 through an NHS merger/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please verify with your GP before making any decisions/)
    ).toBeInTheDocument();
  });

  it("applies the correct styling classes", () => {
    render(<InheritedBanner predecessorIcb="Test ICB" />);
    const banner = screen.getByRole("note");
    expect(banner.className).toContain("bg-[#FDF3E3]");
    expect(banner.className).toContain("border-l-4");
    expect(banner.className).toContain("border-[#C4785A]");
    expect(banner.className).toContain("text-[#5C4A3A]");
    expect(banner.className).toContain("rounded-xl");
    expect(banner.className).toContain("px-5");
    expect(banner.className).toContain("py-4");
  });

  it("has an accessible role and label", () => {
    render(<InheritedBanner predecessorIcb="Test ICB" />);
    const banner = screen.getByRole("note");
    expect(banner).toHaveAttribute("aria-label", "Inherited policy information");
  });

  it("accepts additional className", () => {
    render(<InheritedBanner predecessorIcb="Test ICB" className="mt-4" />);
    const banner = screen.getByRole("note");
    expect(banner.className).toContain("mt-4");
  });
});
