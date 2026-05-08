import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { TreatmentToggle } from "./TreatmentToggle";
import type { TreatmentTypeId } from "./TreatmentToggle";

afterEach(() => {
  cleanup();
});

describe("TreatmentToggle", () => {
  const defaultProps = {
    selected: "ivf" as TreatmentTypeId,
    onChange: vi.fn(),
  };

  it("renders all 4 treatment options", () => {
    render(<TreatmentToggle {...defaultProps} />);

    expect(screen.getByRole("radio", { name: "IVF/ICSI" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "IUI" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "DI" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "FET" })).toBeInTheDocument();
  });

  it("marks the selected option as checked", () => {
    render(<TreatmentToggle selected="ivf" onChange={defaultProps.onChange} />);

    expect(screen.getByRole("radio", { name: "IVF/ICSI" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("defaults to IVF when selected is ivf", () => {
    render(<TreatmentToggle {...defaultProps} />);

    expect(screen.getByRole("radio", { name: "IVF/ICSI" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("calls onChange with the correct treatment type when clicked", () => {
    const onChange = vi.fn();
    render(<TreatmentToggle selected="ivf" onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "FET" }));

    expect(onChange).toHaveBeenCalledWith("fet");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("has a radiogroup role with accessible label", () => {
    render(<TreatmentToggle {...defaultProps} />);

    expect(
      screen.getByRole("radiogroup", { name: "Treatment type" })
    ).toBeInTheDocument();
  });
});
