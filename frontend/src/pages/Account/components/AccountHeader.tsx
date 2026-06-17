import type { CountType } from "@/types/entities";
import AvatarPlaceholder from "./AvatarPlaceholder";
import CountInfo from "./CountInfo";
import { useNavigate } from "react-router-dom";
import { FOLLOWERS_PAGE, FOLLOWINGS_PAGE } from "@/utils/constants";
import { anchor } from "@/utils/anchor";

interface AccountHeaderProps {
  avatar?: string;
  username: string;
  name: string;
  bio?: string;
  lvl: string;
  followers_count: number;
  followings_count: number;
  publications: number;
}

const AccountHeader = ({
  avatar,
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
        navigate(FOLLOWERS_PAGE);
        break;
      case "followings":
        navigate(FOLLOWINGS_PAGE);
        break;
      case "publications":
        anchor("publications");
        break;
    }
  };

  return (
    <header className="account-header">
      <div className="mb-3 flex gap-3.5">
        <div className="account__avatar rounded-full">
          {avatar ? (
            <img
              className="w-full h-full rounded-full object-cover"
              src={avatar}
              alt="avatar"
            />
          ) : (
            <AvatarPlaceholder username={username} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="account__username text-second text-xl">{username}</p>
            <span className="account__lvl w-fit px-1.5 py-0.5 bg-main/50 text-second text-xs font-light rounded-[40px]">
              {lvl}
            </span>
          </div>
          <p className="account__name color-second text-[14px] mb-5 text-second/60">{name}</p>
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
