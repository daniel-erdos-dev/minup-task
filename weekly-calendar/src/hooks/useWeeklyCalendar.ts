import {useEffect, useState} from "react";
import type {Appointment} from "../server/models/Appointment";
import {HOURS} from "../lib/calendarConstants";
import {fetchAppointments} from "../server/mockApi";

export const useWeeklyCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [collapseableBlocks, setCollapseableBlocks] = useState<
    {startHour: number; endHour: number}[]
  >([]);
  const [collapsedBlocksStartHours, setCollapsedBlocksStartHours] = useState<
    number[]
  >([]);

  useEffect(() => {
    const getCollapseableAppointmentBlocks = (data: Appointment[]) => {
      const noAppointmentHours = HOURS.filter(
        (hour) => !data.some((appt) => appt.startHour === hour),
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

    const getAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetchAppointments();
        if (response) {
          setAppointments(response);
          const collapseableBlocks = getCollapseableAppointmentBlocks(response);
          setCollapseableBlocks(collapseableBlocks);
        } else {
          throw new Error("Nincs adat");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Ismeretlen hiba"));
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, []);

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
