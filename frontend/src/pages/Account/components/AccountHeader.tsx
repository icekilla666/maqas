import AvatarPlaceholder from "./AvatarPlaceholder";

interface AccountHeaderProps {
  avatar?: string;
  username: string;
  name: string;
  bio?: string;
  lvl: string;
  followers_count: number;
  followings_count: number;
  publications?: number;
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
  const rowCounts = [
    {
      label: "подписчики",
      value: followers_count ?? 0,
    },
    {
      label: "подписок",
      value: followings_count ?? 0,
    },
    {
      label: "публикации",
      value: publications ?? 0,
    },
  ];
  return (
    <header className="account-header">
      <div className="mb-3 flex gap-3.5">
        <div className="w-22.5 h-22.5 rounded-full">
          {avatar ? (
            <img
              className="w-full h-full rounded-full"
              src={avatar}
              alt="avatar"
            />
          ) : (
            <AvatarPlaceholder username={username} />
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-second text-xl">{username}</p>
            <span className="w-fit px-1.5 py-0.5 bg-main/50 text-second text-xs font-light rounded-[40px]">
              {lvl}
            </span>
          </div>
          <p className="color-second text-[14px] mb-5 text-second/60">{name}</p>
          <div className="flex justify-center items-center gap-3">
            {rowCounts.map((row) => (
              <div key={row.label} className="flex flex-col items-start">
                <p className="text-xs text-second font-medium">{row.label}</p>
                <p className="text-xs text-second">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {bio && <p className="text-xs text-second">{bio}</p>}
    </header>
  );
};

export default AccountHeader;
