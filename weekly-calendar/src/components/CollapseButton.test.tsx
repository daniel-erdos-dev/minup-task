import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {CollapseButton} from "./CollapseButton";

vi.mock("./Icons/ChevronDown", () => ({
  ChevronDown: () => (
    <div data-testid="mock-chevron-down">ChevronDown Icon</div>
  ),
}));

describe("CollapseButton component", () => {
  it("should render the button", () => {
    render(<CollapseButton isCollapsed={false} onClick={() => {}} />);

    expect(screen.getByTestId("mock-chevron-down")).toBeInTheDocument();
  });

  it("should apply rotation class when isCollapsed is true", () => {
    render(<CollapseButton isCollapsed={true} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rotate-180");
  });

  it("should not apply rotation class when isCollapsed is false", () => {
    render(<CollapseButton isCollapsed={false} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("rotate-180");
  });
});
