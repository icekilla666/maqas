import type { UserData } from "@/types/api.types";
import AccountInfo from "./AccountInfo";
import AccountMenu from "./AccountMenu";
import Avatar from "@/components/common/Avatar/Avatar";

const BlockedAccountHeader = ({
  id,
  username,
  name,
  level,
  blocked_user,
  avatar_url,
}: UserData) => {
  return (
    <header className="account-header account-header--blocked">
      <div className="flex w-full gap-3.5">
        <div className="account__avatar rounded-full">
          <Avatar avatar={avatar_url} username={username} size={42} />
        </div>
        <div className="min-w-0 flex flex-1 flex-col justify-between">
          <div className="flex justify-between">
            <AccountInfo name={name} username={username} lvl={level} />
            <AccountMenu blocked_user={blocked_user} id={id} />
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
