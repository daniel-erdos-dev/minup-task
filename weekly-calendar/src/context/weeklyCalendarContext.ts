import { createContext } from "react";
import type { useWeeklyCalendar } from "../hooks/useWeeklyCalendar";

export type WeeklyCalendarContextType = ReturnType<typeof useWeeklyCalendar>;

export const WeeklyCalendarContext = createContext<WeeklyCalendarContextType | null>(null);
