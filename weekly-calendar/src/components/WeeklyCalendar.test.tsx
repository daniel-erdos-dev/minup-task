import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {WeeklyCalendar} from "./WeeklyCalendar";
import {useWeeklyCalendar} from "../hooks/useWeeklyCalendar";

vi.mock("../hooks/useWeeklyCalendar");

vi.mock("./CalendarTableBody", () => ({
  CalendarTableBody: vi.fn(() => (
    <div data-testid="mock-calendar-table-body">Mock Calendar Table Body</div>
  )),
}));

vi.mock("./CalendarTableHeader", () => ({
  CalendarTableHeader: vi.fn(() => (
    <div data-testid="mock-calendar-table-header">
      Mock Calendar Table Header
    </div>
  )),
}));

const mockHook = vi.mocked(useWeeklyCalendar);

describe("WeeklyCalendar component", () => {
  it("renders the component", () => {
    mockHook.mockReturnValue({loading: false, error: null} as never);
    render(<WeeklyCalendar />);
    expect(
      screen.getByTestId("mock-calendar-table-header"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-calendar-table-body")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockHook.mockReturnValue({loading: true, error: null} as never);
    render(<WeeklyCalendar />);
    expect(screen.getByText(/Betöltés.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockHook.mockReturnValue({
      loading: false,
      error: new Error("Valami hiba történt"),
    } as never);
    render(<WeeklyCalendar />);
    expect(screen.getByText("Valami hiba történt")).toBeInTheDocument();
  });
});
