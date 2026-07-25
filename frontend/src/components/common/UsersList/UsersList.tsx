import type { ReactNode } from "react";
import UserItem from "./UserItem";
import type { ListUser } from "@/types/entities";

interface UsersListProps {
  users: ListUser[];
  className?: string;
  button?: ReactNode;
  onBtnClick?: (id: string) => void;
  userId?: string;
  showName?: boolean;
}

const UsersList = ({
  users,
  className = "",
  button,
  onBtnClick,
  userId,
  showName = true,
}: UsersListProps) => {
  return (
    <ul className="user-list__items">
      {users.map((user) => (
        <UserItem
          key={user.id}
          className={className}
          button={button}
          onBtnClick={onBtnClick}
          userId={userId}
          showName={showName}
          user={user}
        />
      ))}
    </ul>
  );
};

export default UsersList;
