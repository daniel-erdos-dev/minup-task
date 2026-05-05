import {useWeeklyCalendarContext} from "../context/useWeeklyCalendarContext";
import {HOURS} from "../lib/calendarConstants";
import {CalendarTableRow} from "./CalendarTableRow";
import {useAppDispatch} from "../store/hooks";
import {toggleBlock} from "../store/collapsedSlice";

export const CalendarTableBody = () => {
  const {appointments, collapseableBlocks, isHiddenByCollapse, isCollapsed} =
    useWeeklyCalendarContext();

  const dispatch = useAppDispatch();

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
              onToggle={() => dispatch(toggleBlock(hour))}
            />
          )
        );
      })}
    </tbody>
  );
};
