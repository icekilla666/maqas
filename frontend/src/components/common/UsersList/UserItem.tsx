import type { ListUser } from "@/types/entities";
import { ACCOUNT_PAGE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import type { ReactNode } from "react";

interface UserItemProps {
  user: ListUser;
  userId?: string;
  showName?: boolean;
  className?: string;
  button?: ReactNode;
  onBtnClick?: (id: string) => void;
}

const UserItem = ({
  user,
  userId,
  showName,
  className = "",
  button,
  onBtnClick,
}: UserItemProps) => {
  const navigate = useNavigate();
  const handleNavigate = (id: string) => {
    if (id === userId) return navigate(ACCOUNT_PAGE);
    navigate(`/${id}`);
  };
  const getStatusLabel = (status: ListUser["status"]) =>
    status === "banned" ? "заблокирован" : "не активен";
  const isActive = user.status === "active";

  return (
    <li
      className={`user-list__item ${
        isActive ? "" : "user-list__item--inactive"
      } ${className ?? ""}`.trim()}
      onClick={() => handleNavigate(user.id)}
    >
      <div className="user-list__avatar">
        <Avatar size={24} avatar={user.avatar_url} username={user.username} />
      </div>
      <div className="w-full flex justify-between">
        <div className="user__info">
          <div className="user-list__info-row">
            <p className="user-list__username">{user.username}</p>
            <span className="user-list__level">{user.level}</span>
            {!isActive && (
              <span className="user-list__status">
                {getStatusLabel(user.status)}
              </span>
            )}
          </div>
          {showName && <p className="user-list__name">{user.name}</p>}
        </div>
        {button && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBtnClick?.(user.id);
            }}
          >
            {button}
          </button>
        )}
      </div>
    </li>
  );
};

export default UserItem;
