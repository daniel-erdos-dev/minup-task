import {renderHook, act, waitFor} from "@testing-library/react";
import {vi, describe, it, expect, beforeEach} from "vitest";
import {useWeeklyCalendar} from "./useWeeklyCalendar";
import type {Appointment} from "../server/models/Appointment";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createElement} from "react";
import {fetchAppointments} from "../server/mockApi";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import appointmentReducer from "../store/appointmentSlice";
import collapsedReducer, {toggleBlock} from "../store/collapsedSlice";

vi.mock("../server/mockApi");

const mockFetch = vi.mocked(fetchAppointments);

const makeAppointment = (id: string, startHour: number): Appointment => ({
  id,
  title: `Appointment ${id}`,
  date: "2025-04-07",
  startHour,
  endHour: startHour + 1,
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
  });
  const store = configureStore({
    reducer: {appointments: appointmentReducer, collapsed: collapsedReducer},
  });
  const wrapper = ({children}: {children: React.ReactNode}) =>
    createElement(
      Provider,
      {store, children},
      createElement(QueryClientProvider, {client: queryClient}, children),
    );
  return {store, wrapper};
};

const renderCalendar = async (appointments: Appointment[]) => {
  mockFetch.mockResolvedValue(appointments);
  const {store, wrapper} = createWrapper();
  const {result} = renderHook(() => useWeeklyCalendar(), {wrapper});
  await waitFor(() => expect(result.current.loading).toBe(false));
  return {result, store};
};

describe("useWeeklyCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial loading", () => {
    it("starts in loading state", () => {
      mockFetch.mockResolvedValue([]);
      const {wrapper} = createWrapper();
      const {result} = renderHook(() => useWeeklyCalendar(), {wrapper});
      expect(result.current.loading).toBe(true);
    });

    it("sets loading to false after fetch completes", async () => {
      await renderCalendar([]);
    });

    it("sets appointments after successful fetch", async () => {
      const appts = [makeAppointment("a1", 9)];
      const {result} = await renderCalendar(appts);
      expect(result.current.appointments).toEqual(appts);
    });

    it("sets error and clears loading when fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      const {wrapper} = createWrapper();
      const {result} = renderHook(() => useWeeklyCalendar(), {wrapper});
      await waitFor(() => expect(result.current.error).not.toBeNull());
      expect(result.current.error?.message).toBe("Network error");
      expect(result.current.appointments).toEqual([]);
    });
  });

  describe("collapseable blocks calculation", () => {
    it("computes a single-hour block for an empty hour", async () => {
      const {result} = await renderCalendar([makeAppointment("a1", 9)]);
      expect(result.current.collapseableBlocks[0]).toEqual({
        startHour: 8,
        endHour: 9,
      });
    });

    it("merges consecutive empty hours into one block", async () => {
      const {result} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      const block = result.current.collapseableBlocks.find(
        (b) => b.startHour === 10,
      );
      expect(block).toEqual({startHour: 10, endHour: 15});
    });

    it("creates separate blocks for non-consecutive empty hours", async () => {
      const {result} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 11),
        makeAppointment("a3", 15),
      ]);
      const startHours = result.current.collapseableBlocks.map(
        (b) => b.startHour,
      );
      expect(startHours).toContain(8);
      expect(startHours).toContain(10);
      expect(startHours).toContain(12);
    });
  });

  describe("isCollapsed", () => {
    it("returns true for a collapsed block's start hour", async () => {
      const {result, store} = await renderCalendar([makeAppointment("a1", 9)]);
      const blockStart = result.current.collapseableBlocks[0].startHour;
      act(() => store.dispatch(toggleBlock(blockStart)));
      expect(result.current.isCollapsed(blockStart)).toBe(true);
    });

    it("returns false for a non-collapsed hour", async () => {
      const {result} = await renderCalendar([makeAppointment("a1", 9)]);
      expect(result.current.isCollapsed(9)).toBe(false);
    });
  });

  describe("isHiddenByCollapse", () => {
    it("hides hours inside a collapsed block", async () => {
      const {result, store} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      act(() => store.dispatch(toggleBlock(10)));
      expect(result.current.isHiddenByCollapse(11)).toBe(true);
      expect(result.current.isHiddenByCollapse(14)).toBe(true);
    });

    it("does not hide the start hour of a collapsed block", async () => {
      const {result, store} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      act(() => store.dispatch(toggleBlock(10)));
      expect(result.current.isHiddenByCollapse(10)).toBe(false);
    });
  });

  describe("toggleCollapseAll", () => {
    it("collapses all blocks", async () => {
      const {result} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      act(() => result.current.toggleCollapseAll());
      expect(result.current.collapsedBlocksStartHours.length).toBe(
        result.current.collapseableBlocks.length,
      );
    });

    it("uncollapses all blocks when all are already collapsed", async () => {
      const {result} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      act(() => result.current.toggleCollapseAll());
      act(() => result.current.toggleCollapseAll());
      expect(result.current.collapsedBlocksStartHours).toEqual([]);
    });

    it("isAllCollapsed is true only when all blocks are collapsed", async () => {
      const {result} = await renderCalendar([
        makeAppointment("a1", 9),
        makeAppointment("a2", 15),
      ]);
      expect(result.current.isAllCollapsed).toBe(false);
      act(() => result.current.toggleCollapseAll());
      expect(result.current.isAllCollapsed).toBe(true);
    });
  });
});
