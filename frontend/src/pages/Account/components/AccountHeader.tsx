import type { CountType } from "@/types/entities";
import CountInfo from "./CountInfo";
import { useNavigate } from "react-router-dom";
import { FOLLOW_PAGE } from "@/utils/constants";
import { anchor } from "@/utils/anchor";
import AccountInfo from "./AccountInfo";
import Avatar from "@/components/common/Avatar";

interface AccountHeaderProps {
  id: string;
  avatar_url?: string;
  username: string;
  name: string;
  bio?: string;
  level: string;
  followers_count: number;
  followings_count: number;
  posts_count: number;
}

const AccountHeader = ({
  id,
  avatar_url,
  username,
  name,
  bio,
  level,
  followers_count,
  followings_count,
  posts_count,
}: AccountHeaderProps) => {
  const navigate = useNavigate();

  const switchCount = (type: CountType) => {
    const followState = {
      userId: id,
      username,
      followersCount: followers_count,
      followingsCount: followings_count,
    };

    switch (type) {
      case "followers":
        navigate(FOLLOW_PAGE, { state: { ...followState, tab: "followers" } });
        break;
      case "followings":
        navigate(FOLLOW_PAGE, {
          state: { ...followState, tab: "followings" },
        });
        break;
      case "publications":
        anchor("publications");
        break;
    }
  };
  return (
    <header className="account-header">
      <div className="flex gap-3.5">
        <Avatar username={username} avatar={avatar_url} />
        <div className="min-w-0 flex flex-1 flex-col justify-between">
          <AccountInfo name={name} username={username} lvl={level} />
          <div className="account__count-wrapper flex items-center gap-3">
            <CountInfo
              followers={followers_count}
              followings={followings_count}
              posts={posts_count}
              onClick={(type) => switchCount(type)}
            />
          </div>
        </div>
      </div>
      {bio && (
        <div className="w-full">
          <p className="w-full text-[14px] text-second break-all">{bio}</p>
        </div>
      )}
    </header>
  );
};

export default AccountHeader;
