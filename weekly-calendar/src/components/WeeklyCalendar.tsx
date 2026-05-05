import {useWeeklyCalendar} from "../hooks/useWeeklyCalendar";
import {CalendarTableBody} from "./CalendarTableBody";
import {CalendarTableHeader} from "./CalendarTableHeader";

export const WeeklyCalendar = () => {
  const {loading, error} = useWeeklyCalendar();

  if (loading) {
    return (
      <div className="text-center py-4 animate-pulse text-3xl font-bold text-slate-700">
        Betöltés...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error.message}</div>;
  }

  return (
    <table className="border-collapse border border-gray-300 rounded-lg w-full sm:max-w-6xl">
      <CalendarTableHeader />
      <CalendarTableBody />
    </table>
  );
};
