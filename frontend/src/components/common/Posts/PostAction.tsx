import type { ReactNode } from "react";

export interface PostActionProps {
  icon: ReactNode;
  value?: number;
  onClick: () => void;
}

const PostAction = ({ icon, value, onClick }: PostActionProps) => {
  return (
    <button className="post-action" onClick={onClick}>
      {icon}
      {value && <span>{value}</span>}
    </button>
  );
};

export default PostAction;
