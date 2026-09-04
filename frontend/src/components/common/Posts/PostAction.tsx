import type { MouseEvent, ReactNode } from "react";

export interface PostActionProps {
  icon: ReactNode;
  ariaLabel: string;
  value?: number;
  onClick: () => void;
}

const PostAction = ({ icon, ariaLabel, value, onClick }: PostActionProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <button
      aria-label={ariaLabel}
      className="post-action"
      onClick={handleClick}
      type="button"
    >
      {icon}
      <span>{value}</span>
    </button>
  );
};

export default PostAction;
