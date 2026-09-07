import type { PostActionProps } from "@/types/entities";
import type { MouseEvent } from "react";

const PostAction = ({
  icon,
  ariaLabel,
  value,
  onClick,
  className = "",
  disabled = false,
}: PostActionProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <button
      aria-label={ariaLabel}
      className={`post-action ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      <span>{value}</span>
    </button>
  );
};

export default PostAction;
