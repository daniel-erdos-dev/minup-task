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
    <div className="overflow-auto w-full sm:max-w-6xl">
      <table className="border-collapse border border-gray-300 rounded-lg w-full">
        <CalendarTableHeader />
        <CalendarTableBody />
      </table>
    </div>
  );
};
