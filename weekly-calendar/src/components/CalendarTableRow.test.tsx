import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {CalendarTableRow} from "./CalendarTableRow";
import type {Appointment} from "../server/models/Appointment";
import type {ComponentProps} from "react";

vi.mock("./CollapseButton", () => ({
  CollapseButton: vi.fn(() => (
    <div data-testid="mock-collapse-button">Mock Collapse Button</div>
  )),
}));

const makeMockAppointment = (
  id: string,
  date: string,
  startHour: number,
): Appointment => ({
  id,
  title: `Meeting ${id}`,
  date,
  startHour,
  endHour: startHour + 1,
});

const renderRow = (props: ComponentProps<typeof CalendarTableRow>) =>
  render(
    <table>
      <tbody>
        <CalendarTableRow {...props} />
      </tbody>
    </table>,
  );

describe("CalendarTableRow component", () => {
  describe("hour label", () => {
    it("shows the hour as HH:00", () => {
      renderRow({
        hour: 9,
        appointments: [],
        collapseableBlocks: [],
        isCollapsed: false,
        onToggle: vi.fn(),
      });
      expect(screen.getByText("9:00")).toBeInTheDocument();
    });

    it("shows a range label when collapsed and block spans multiple hours", () => {
      const block = {startHour: 9, endHour: 12};
      renderRow({
        hour: 9,
        appointments: [],
        collapseableBlocks: [block],
        isCollapsed: true,
        onToggle: vi.fn(),
      });
      expect(screen.getByText("9:00 - 11:00")).toBeInTheDocument();
    });

    it("shows plain hour label when collapsed but block is only one hour", () => {
      const block = {startHour: 9, endHour: 10};
      renderRow({
        hour: 9,
        appointments: [],
        collapseableBlocks: [block],
        isCollapsed: true,
        onToggle: vi.fn(),
      });
      expect(screen.getByText("9:00")).toBeInTheDocument();
    });
  });

  describe("appointment rendering", () => {
    it("renders an appointment title in the correct day cell", () => {
      // 2025-04-07 is a Monday (Hétfő)
      const appts = [makeMockAppointment("a1", "2025-04-07", 9)];
      renderRow({
        hour: 9,
        appointments: appts,
        collapseableBlocks: [],
        isCollapsed: false,
        onToggle: vi.fn(),
      });
      expect(screen.getByText("Meeting a1")).toBeInTheDocument();
    });
  });

  describe("collapse button", () => {
    it("renders collapse button when the hour is the start of a collapseable block", () => {
      const block = {startHour: 9, endHour: 11};
      renderRow({
        hour: 9,
        appointments: [],
        collapseableBlocks: [block],
        isCollapsed: false,
        onToggle: vi.fn(),
      });
      expect(screen.getByTestId("mock-collapse-button")).toBeInTheDocument();
    });

    it("does not render collapse button for non-block hours", () => {
      renderRow({
        hour: 9,
        appointments: [],
        collapseableBlocks: [],
        isCollapsed: false,
        onToggle: vi.fn(),
      });
      expect(
        screen.queryByTestId("mock-collapse-button"),
      ).not.toBeInTheDocument();
    });
  });
});
