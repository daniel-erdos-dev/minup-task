import {render, screen} from "@testing-library/react";
import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";
import {CalendarTableBody} from "./CalendarTableBody";
import {describe, expect, it, vi} from "vitest";
import {HOURS} from "../lib/calendarConstants";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import appointmentReducer from "../store/appointmentSlice";
import collapsedReducer from "../store/collapsedSlice";

vi.mock("../context/useWeeklyCalendarContext");

vi.mock("./CalendarTableRow", () => ({
  CalendarTableRow: vi.fn(({hour}: {hour: number}) => (
    <tr data-testid={`mock-row-${hour}`}>
      <td>{hour}</td>
    </tr>
  )),
}));

const mockContext = vi.mocked(useWeeklyCalendarContext);

const makeContextValue = (overrides = {}) =>
  ({
    appointments: [],
    collapseableBlocks: [],
    toggleBlock: vi.fn(),
    isHiddenByCollapse: vi.fn().mockReturnValue(false),
    isCollapsed: vi.fn().mockReturnValue(false),
    ...overrides,
  }) as never;

const makeStore = () =>
  configureStore({
    reducer: {appointments: appointmentReducer, collapsed: collapsedReducer},
  });

const renderBody = () =>
  render(
    <Provider store={makeStore()}>
      <table>
        <CalendarTableBody />
      </table>
    </Provider>,
  );

describe("CalendarTableBody component", () => {
  it("renders a row for every hour", () => {
    mockContext.mockReturnValue(makeContextValue());
    renderBody();
    HOURS.forEach((hour) => {
      expect(screen.getByTestId(`mock-row-${hour}`)).toBeInTheDocument();
    });
  });

  it("does not render a row for a hidden hour", () => {
    mockContext.mockReturnValue(
      makeContextValue({
        isHiddenByCollapse: vi.fn((hour: number) => hour === 12),
      }),
    );
    renderBody();
    expect(screen.queryByTestId("mock-row-12")).not.toBeInTheDocument();
  });

  it("renders all non-hidden hours when some are hidden", () => {
    mockContext.mockReturnValue(
      makeContextValue({
        isHiddenByCollapse: vi.fn((hour: number) => hour >= 12 && hour <= 14),
      }),
    );
    renderBody();
    const visibleHours = HOURS.filter((h) => h < 12 || h > 14);
    visibleHours.forEach((hour) => {
      expect(screen.getByTestId(`mock-row-${hour}`)).toBeInTheDocument();
    });
    [12, 13, 14].forEach((hour) => {
      expect(screen.queryByTestId(`mock-row-${hour}`)).not.toBeInTheDocument();
    });
  });
});
