import {useMemo, useState} from "react";
import type {Appointment} from "../server/models/Appointment";
import {HOURS} from "../lib/calendarConstants";
import {fetchAppointments} from "../server/mockApi";
import {useQuery} from "@tanstack/react-query";

const getCollapseableBlocks = (appointments: Appointment[]) => {
  const noAppointmentHours = HOURS.filter(
    (hour) => !appointments.some((appt) => appt.startHour === hour),
  );
  const blocks: {startHour: number; endHour: number}[] = [];
  noAppointmentHours.forEach((noApptHr) => {
    const last = blocks[blocks.length - 1];
    if (last && last.endHour === noApptHr) {
      last.endHour = noApptHr + 1;
    } else {
      blocks.push({startHour: noApptHr, endHour: noApptHr + 1});
    }
  });
  return blocks;
};

export const useWeeklyCalendar = () => {
  const {
    data: appointments = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const [collapsedBlocksStartHours, setCollapsedBlocksStartHours] = useState<
    number[]
  >([]);

  const collapseableBlocks = useMemo(
    () => getCollapseableBlocks(appointments),
    [appointments],
  );

  const toggleBlock = (startHour: number) => {
    setCollapsedBlocksStartHours((prev) =>
      prev.includes(startHour)
        ? prev.filter((h) => h !== startHour)
        : [...prev, startHour],
    );
  };

  const isHiddenByCollapse = (hour: number) =>
    collapsedBlocksStartHours.some((startHour) => {
      const block = collapseableBlocks.find((b) => b.startHour === startHour);
      return block && hour > block.startHour && hour < block.endHour;
    });

  const isCollapsed = (hour: number) => {
    const blockStartHour =
      collapseableBlocks.find((b) => b.startHour === hour)?.startHour ?? null;
    return (
      blockStartHour !== null &&
      collapsedBlocksStartHours.includes(blockStartHour)
    );
  };

  const collapseAll = () => {
    if (collapsedBlocksStartHours.length === collapseableBlocks.length) {
      setCollapsedBlocksStartHours([]);
    } else {
      setCollapsedBlocksStartHours(collapseableBlocks.map((b) => b.startHour));
    }
  };

  const isAllCollapsed =
    collapsedBlocksStartHours.length === collapseableBlocks.length;

  return {
    appointments,
    loading,
    error,
    collapseableBlocks,
    collapsedBlocksStartHours,
    toggleBlock,
    isHiddenByCollapse,
    isCollapsed,
    collapseAll,
    isAllCollapsed,
  };
};
