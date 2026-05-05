import {renderHook, act, waitFor} from "@testing-library/react";
import {vi, describe, it, expect, beforeEach} from "vitest";
import {useWeeklyCalendar} from "./useWeeklyCalendar";
import type {Appointment} from "../server/models/Appointment";

vi.mock("../server/mockApi");
import {fetchAppointments} from "../server/mockApi";

const mockFetch = vi.mocked(fetchAppointments);

const makeAppointment = (id: string, startHour: number): Appointment => ({
  id,
  title: `Appointment ${id}`,
  date: "2025-04-07",
  startHour,
  endHour: startHour + 1,
});

describe("useWeeklyCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial loading", () => {
    it("starts in loading state", () => {
      mockFetch.mockResolvedValue([]);
      const {result} = renderHook(() => useWeeklyCalendar());
      expect(result.current.loading).toBe(true);
    });

    it("sets loading to false after fetch completes", async () => {
      mockFetch.mockResolvedValue([]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    it("sets appointments after successful fetch", async () => {
      const appts = [makeAppointment("a1", 9)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.appointments).toEqual(appts);
    });

    it("sets error and clears loading when fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error?.message).toBe("Network error");
      expect(result.current.appointments).toEqual([]);
    });
  });

  describe("collapseable blocks calculation", () => {
    it("computes a single-hour block for an empty hour", async () => {
      mockFetch.mockResolvedValue([makeAppointment("a1", 9)]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const firstBlock = result.current.collapseableBlocks[0];
      expect(firstBlock).toEqual({startHour: 8, endHour: 9});
    });

    it("merges consecutive empty hours into one block", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const block = result.current.collapseableBlocks.find(
        (b) => b.startHour === 10,
      );
      expect(block).toEqual({startHour: 10, endHour: 15});
    });

    it("creates separate blocks for non-consecutive empty hours", async () => {
      const appts = [
        makeAppointment("a1", 9),
        makeAppointment("a2", 11),
        makeAppointment("a3", 15),
      ];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const startHours = result.current.collapseableBlocks.map(
        (b) => b.startHour,
      );
      expect(startHours).toContain(8);
      expect(startHours).toContain(10);
      expect(startHours).toContain(12);
    });
  });

  describe("toggleBlock", () => {
    it("collapses a block when toggled", async () => {
      mockFetch.mockResolvedValue([makeAppointment("a1", 9)]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const blockStart = result.current.collapseableBlocks[0].startHour;
      act(() => result.current.toggleBlock(blockStart));
      expect(result.current.collapsedBlocksStartHours).toContain(blockStart);
    });

    it("uncollapses a block when toggled twice", async () => {
      mockFetch.mockResolvedValue([makeAppointment("a1", 9)]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const blockStart = result.current.collapseableBlocks[0].startHour;
      act(() => result.current.toggleBlock(blockStart));
      act(() => result.current.toggleBlock(blockStart));
      expect(result.current.collapsedBlocksStartHours).not.toContain(
        blockStart,
      );
    });
  });

  describe("isCollapsed", () => {
    it("returns true for a collapsed block's start hour", async () => {
      mockFetch.mockResolvedValue([makeAppointment("a1", 9)]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      const blockStart = result.current.collapseableBlocks[0].startHour;
      act(() => result.current.toggleBlock(blockStart));
      expect(result.current.isCollapsed(blockStart)).toBe(true);
    });

    it("returns false for a non-collapsed hour", async () => {
      mockFetch.mockResolvedValue([makeAppointment("a1", 9)]);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.isCollapsed(9)).toBe(false);
    });
  });

  describe("isHiddenByCollapse", () => {
    it("hides hours inside a collapsed block", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => result.current.toggleBlock(10));
      expect(result.current.isHiddenByCollapse(11)).toBe(true);
      expect(result.current.isHiddenByCollapse(14)).toBe(true);
    });

    it("does not hide the start hour of a collapsed block", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => result.current.toggleBlock(10));
      expect(result.current.isHiddenByCollapse(10)).toBe(false);
    });
  });

  describe("collapseAll", () => {
    it("collapses all blocks", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => result.current.collapseAll());
      expect(result.current.collapsedBlocksStartHours.length).toBe(
        result.current.collapseableBlocks.length,
      );
    });

    it("uncollapses all blocks when all are already collapsed", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      act(() => result.current.collapseAll());
      act(() => result.current.collapseAll());
      expect(result.current.collapsedBlocksStartHours).toEqual([]);
    });

    it("isAllCollapsed is true only when all blocks are collapsed", async () => {
      const appts = [makeAppointment("a1", 9), makeAppointment("a2", 15)];
      mockFetch.mockResolvedValue(appts);
      const {result} = renderHook(() => useWeeklyCalendar());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.isAllCollapsed).toBe(false);
      act(() => result.current.collapseAll());
      expect(result.current.isAllCollapsed).toBe(true);
    });
  });
});
