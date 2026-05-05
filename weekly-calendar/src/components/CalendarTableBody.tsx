import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";
import {HOURS} from "../lib/calendarConstants";
import {CalendarTableRow} from "./CalendarTableRow";

export const CalendarTableBody = () => {
  const {
    appointments,
    collapseableBlocks,
    toggleBlock,
    isHiddenByCollapse,
    isCollapsed,
  } = useWeeklyCalendarContext();

  return (
    <tbody>
      {HOURS.map((hour) => {
        return (
          !isHiddenByCollapse(hour) && (
            <CalendarTableRow
              key={hour}
              hour={hour}
              collapseableBlocks={collapseableBlocks}
              appointments={appointments}
              isCollapsed={isCollapsed(hour)}
              onToggle={toggleBlock}
            />
          )
        );
      })}
    </tbody>
  );
};
