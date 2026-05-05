import { type ReactNode } from "react";
import { useWeeklyCalendar } from "../hooks/useWeeklyCalendar";
import { WeeklyCalendarContext } from "./weeklyCalendarContext";

export const WeeklyCalendarProvider = ({ children }: { children: ReactNode }) => {
  const value = useWeeklyCalendar();
  return (
    <WeeklyCalendarContext.Provider value={value}>
      {children}
    </WeeklyCalendarContext.Provider>
  );
};
