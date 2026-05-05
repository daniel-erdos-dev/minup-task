import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {CalendarTableHeader} from "./CalendarTableHeader";
import {useWeeklyCalendar} from "../hooks/useWeeklyCalendar";

vi.mock("../hooks/useWeeklyCalendar");

vi.mock("./CollapseButton", () => ({
  CollapseButton: vi.fn(() => (
    <div data-testid="mock-collapse-button">Mock Collapse Button</div>
  )),
}));

const mockHook = vi.mocked(useWeeklyCalendar);

const renderHeader = () => {
  render(
    <table>
      <CalendarTableHeader />
    </table>,
  );
};

beforeEach(() => {
  mockHook.mockReturnValue({
    toggleCollapseAll: vi.fn(),
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
