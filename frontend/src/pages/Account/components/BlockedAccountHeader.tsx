import AvatarPlaceholder from "@/components/common/Avatar/AvatarPlaceholder";
import AccountInfo from "./AccountInfo";
import AccountMenu from "./AccountMenu";

interface BlockedAccountHeaderProps {
  id: string;
  username: string;
  name: string;
  level: string;
}

const BlockedAccountHeader = ({
  id,
  username,
  name,
  level,
}: BlockedAccountHeaderProps) => {
  return (
    <header className="account-header account-header--blocked">
      <div className="flex w-full gap-3.5">
        <div className="account__avatar rounded-full">
          <AvatarPlaceholder username={username} size={42} />
        </div>
        <div className="min-w-0 flex flex-1 flex-col justify-between">
          <div className="flex justify-between">
            <AccountInfo name={name} username={username} lvl={level} />
            <AccountMenu id={id} />
          </div>
          <p className="account-blocked__message">
            Пользователь ограничил доступ к профилю
          </p>
        </div>
      </div>
    </header>
  );
};

export default BlockedAccountHeader;
