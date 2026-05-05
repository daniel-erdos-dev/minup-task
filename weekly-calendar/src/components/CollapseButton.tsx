import {ChevronDown} from "./Icons/ChevronDown";

export const CollapseButton = ({
  isCollapsed,
  onClick,
}: {
  isCollapsed: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`cursor-pointer ${isCollapsed ? "rotate-180" : ""}`}
      onClick={onClick}
    >
      <ChevronDown />
    </button>
  );
};
