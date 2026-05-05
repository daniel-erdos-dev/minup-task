import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {CalendarTableHeader} from "./CalendarTableHeader";
import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";

vi.mock("../context/useWeeklyCalendarContext");

vi.mock("./CollapseButton", () => ({
  CollapseButton: vi.fn(() => (
    <div data-testid="mock-collapse-button">Mock Collapse Button</div>
  )),
}));

const mockContext = vi.mocked(useWeeklyCalendarContext);

const renderHeader = () => {
  render(
    <table>
      <CalendarTableHeader />
    </table>,
  );
};

beforeEach(() => {
  mockContext.mockReturnValue({
    collapseAll: vi.fn(),
    isAllCollapsed: false,
  } as never);

  renderHeader();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CalendarTableHeader component", () => {
  it("renders the header with correct day labels", () => {
    expect(screen.getByText("Hétfő")).toBeInTheDocument();
    expect(screen.getByText("Kedd")).toBeInTheDocument();
    expect(screen.getByText("Szerda")).toBeInTheDocument();
    expect(screen.getByText("Csütörtök")).toBeInTheDocument();
    expect(screen.getByText("Péntek")).toBeInTheDocument();
    expect(screen.getByText("Szombat")).toBeInTheDocument();
    expect(screen.getByText("Vasárnap")).toBeInTheDocument();
  });

  it("renders the collapse button", () => {
    expect(screen.getByTestId("mock-collapse-button")).toBeInTheDocument();
  });
});
