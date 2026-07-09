import type { CountType } from "@/types/entities";
import CountInfo from "./CountInfo";
import { useNavigate } from "react-router-dom";
import { FOLLOW_PAGE } from "@/utils/constants";
import { anchor } from "@/utils/anchor";
import AccountAvatar from "./AccountAvatar";
import AccountInfo from "./AccountInfo";

interface AccountHeaderProps {
  avatar_url?: string;
  username: string;
  name: string;
  bio?: string;
  lvl: string;
  followers_count: number;
  followings_count: number;
  publications: number;
}

const AccountHeader = ({
  avatar_url,
  username,
  name,
  bio,
  lvl,
  followers_count,
  followings_count,
  publications,
}: AccountHeaderProps) => {
  const navigate = useNavigate();

  const switchCount = (type: CountType) => {
    switch (type) {
      case "followers":
        navigate(FOLLOW_PAGE, { state: { tab: "followers" } });
        break;
      case "followings":
        navigate(FOLLOW_PAGE, { state: { tab: "followings" } });
        break;
      case "publications":
        anchor("publications");
        break;
    }
  };
  console.log(avatar_url)
  return (
    <header className="account-header">
      <div className="mb-3 flex gap-3.5">
        <AccountAvatar username={username} avatar={avatar_url} />
        <div className="min-w-0 flex flex-1 flex-col justify-between">
          <AccountInfo name={name} username={username} lvl={lvl} />
          <div className="account__count-wrapper flex items-center gap-3">
            <CountInfo
              followers={followers_count}
              followings={followings_count}
              publications={publications}
              onClick={(type) => switchCount(type)}
            />
          </div>
        </div>
      </div>
      {bio && <p className="text-xs text-second">{bio}</p>}
    </header>
  );
};

export default AccountHeader;
