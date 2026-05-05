import {useMemo} from "react";
import type {Appointment} from "../server/models/Appointment";
import {HOURS} from "../lib/calendarConstants";
import {fetchAppointments} from "../server/mockApi";
import {useQuery} from "@tanstack/react-query";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {
  collapseAllBlocks,
  expandAllBlocks,
  selectCollapsedBlocks,
  selectIsAllCollapsed,
} from "../store/collapsedSlice";

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

  const collapsedBlocksStartHours = useAppSelector(selectCollapsedBlocks);
  const dispatch = useAppDispatch();

  const collapseableBlocks = useMemo(
    () => getCollapseableBlocks(appointments),
    [appointments],
  );

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

  const isAllCollapsedSelector = useMemo(
    () => selectIsAllCollapsed(collapseableBlocks.map((b) => b.startHour)),
    [collapseableBlocks],
  );

  const isAllCollapsed = useAppSelector(isAllCollapsedSelector);

  const toggleCollapseAll = () => {
    if (isAllCollapsed) {
      dispatch(expandAllBlocks());
    } else {
      dispatch(collapseAllBlocks(collapseableBlocks.map((b) => b.startHour)));
    }
  };

  return {
    appointments,
    loading,
    error,
    collapseableBlocks,
    collapsedBlocksStartHours,
    isHiddenByCollapse,
    isCollapsed,
    toggleCollapseAll,
    isAllCollapsed,
  };
};
