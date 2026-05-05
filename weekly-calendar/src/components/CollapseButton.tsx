import {ChevronDown} from "./Icons/ChevronDown";

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
  testId?: string;
}

export const CollapseButton = ({
  isCollapsed,
  onClick,
  testId,
}: CollapseButtonProps) => {
  return (
    <button
      className={`cursor-pointer ${isCollapsed ? "rotate-180" : ""}`}
      onClick={onClick}
      data-testid={testId}
    >
      <ChevronDown />
    </button>
  );
};
