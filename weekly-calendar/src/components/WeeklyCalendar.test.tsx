import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {WeeklyCalendar} from "./WeeklyCalendar";
import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";

vi.mock("../context/useWeeklyCalendarContext");

vi.mock("../context/WeeklyCalendarProvider", () => ({
  WeeklyCalendarProvider: ({children}: {children: React.ReactNode}) => (
    <>{children}</>
  ),
}));

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

const mockContext = vi.mocked(useWeeklyCalendarContext);

describe("WeeklyCalendar component", () => {
  it("renders the component", () => {
    mockContext.mockReturnValue({loading: false, error: null} as never);
    render(<WeeklyCalendar />);
    expect(
      screen.getByTestId("mock-calendar-table-header"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-calendar-table-body")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockContext.mockReturnValue({loading: true, error: null} as never);
    render(<WeeklyCalendar />);
    expect(screen.getByText(/Betöltés.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockContext.mockReturnValue({
      loading: false,
      error: new Error("Valami hiba történt"),
    } as never);
    render(<WeeklyCalendar />);
    expect(screen.getByText("Valami hiba történt")).toBeInTheDocument();
  });
});
