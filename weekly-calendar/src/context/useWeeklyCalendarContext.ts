import { useContext } from "react";
import { WeeklyCalendarContext } from "./weeklyCalendarContext";

export const useWeeklyCalendarContext = () => {
  const ctx = useContext(WeeklyCalendarContext);
  if (!ctx) throw new Error("useWeeklyCalendarContext must be used within WeeklyCalendarProvider");
  return ctx;
};
