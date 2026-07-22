import { useProfileStore } from "@/store/profile.store";
import type { BlackListUserData } from "@/types/api.types";
import type { FollowUser } from "@/types/entities";
import { ACCOUNT_PAGE } from "@/utils/constants";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type ListUser = FollowUser | BlackListUserData;

interface UsersListProps {
  users: ListUser[];
  className?: string;
  button?: ReactNode;
  onBtnClick?: (id: string) => void;
}

const getInitial = (username: string) => username.slice(0, 1).toUpperCase();
const getStatusLabel = (status: ListUser["status"]) =>
  status === "banned" ? "заблокирован" : "не активен";

const UsersList = ({
  users,
  className,
  button,
  onBtnClick,
}: UsersListProps) => {
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();
  const handleNavigate = (id: string) => {
    if (id === profile?.id) return navigate(ACCOUNT_PAGE);
    navigate(`/${id}`);
  };
  return (
    <ul className="follow-list__items">
      {users.map((user) => {
        const isActive = user.status === "active";

        return (
          <li
            className={`follow-list__item ${
              isActive ? "" : "follow-list__item--inactive"
            } ${className ?? ""}`.trim()}
            onClick={() => handleNavigate(user.id)}
            key={user.id}
          >
            <div className="follow-list__avatar">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} />
              ) : (
                <span>{getInitial(user.username)}</span>
              )}
            </div>
            <div className="w-full flex justify-between">
              <div className="follow-list__user">
                <div className="follow-list__user-row">
                  <p className="follow-list__username">{user.username}</p>
                  <span className="follow-list__level">{user.level}</span>
                  {!isActive && (
                    <span className="follow-list__status">
                      {getStatusLabel(user.status)}
                    </span>
                  )}
                </div>
                <p className="follow-list__name">{user.name}</p>
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
      })}
    </ul>
  );
};

export default UsersList;
