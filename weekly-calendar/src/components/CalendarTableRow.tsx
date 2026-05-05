import {DAYS} from "../lib/calendarConstants";
import {transformDayToNumber} from "../lib/dateTransformers";
import type {Appointment} from "../server/models/Appointment";
import type {Day} from "../types/days";
import {CollapseButton} from "./CollapseButton";

interface CalendarTableRowProps {
  hour: number;
  collapseableBlocks: {startHour: number; endHour: number}[];
  appointments: Appointment[];
  isCollapsed: boolean;
  onToggle: (startHour: number) => void;
}

export const CalendarTableRow = ({
  hour,
  collapseableBlocks,
  appointments,
  isCollapsed,
  onToggle,
}: CalendarTableRowProps) => {
  const getAppointment = (day: Day): string | null => {
    const dayInEnglish = transformDayToNumber(day);

    const appointmentsForTheDay = appointments.filter(
      (appt) => new Date(appt.date).getDay() === dayInEnglish,
    );
    if (appointmentsForTheDay) {
      const appointmentForThatCell = appointmentsForTheDay.find(
        (appt) => appt.startHour === hour,
      );
      return appointmentForThatCell ? appointmentForThatCell.title : null;
    }

    return null;
  };

  const getHourLabel = () => {
    const block = collapseableBlocks.find((b) => b.startHour === hour);
    return block && isCollapsed && block.endHour - block.startHour > 1
      ? `${hour}:00 - ${block.endHour - 1}:00`
      : `${hour}:00`;
  };

  const shouldShowCollapseButton = collapseableBlocks.some(
    (block) => block.startHour === hour,
  );

  return (
    <tr key={hour}>
      <td
        className={`bg-gray-50 border border-gray-300 px-4 text-center w-24 wrap-break-word ${isCollapsed ? "h-0 py-0" : "sm:h-16 py-2"}`}
      >
        {getHourLabel()}
      </td>
      {DAYS.map((day) => (
        <td
          key={`${day}-${hour}`}
          className="text-center text-wrap border border-gray-200 py-4 px-4"
        >
          {getAppointment(day)}
        </td>
      ))}
      {shouldShowCollapseButton && (
        <td className={`text-center ${isCollapsed ? "h-0" : "sm:h-16"}`}>
          <CollapseButton
            isCollapsed={isCollapsed}
            onClick={() => onToggle(hour)}
          />
        </td>
      )}
    </tr>
  );
};
