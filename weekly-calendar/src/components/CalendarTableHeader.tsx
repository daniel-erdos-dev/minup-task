import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";
import {DAYS} from "../lib/calendarConstants";
import {CollapseButton} from "./CollapseButton";

export const CalendarTableHeader = () => {
  const {collapseAll, isAllCollapsed} = useWeeklyCalendarContext();

  return (
    <thead>
      <tr>
        <th className="bg-gray-50 border border-gray-300 px-4 py-2" />
        {DAYS.map((day) => (
          <th
            key={day}
            className="bg-gray-50 border border-gray-300 px-4 py-2 text-center"
          >
            {day}
          </th>
        ))}
        <th className="px-4 py-2 text-center bg-gray-50 border border-gray-300">
          <CollapseButton isCollapsed={isAllCollapsed} onClick={collapseAll} />
        </th>
      </tr>
    </thead>
  );
};
