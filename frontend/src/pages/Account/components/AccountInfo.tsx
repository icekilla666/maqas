interface AccountInfoProps {
  username: string;
  lvl: string;
  name: string;
}

const AccountInfo = ({ username, lvl, name }: AccountInfoProps) => {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex items-center gap-1.5">
        <p className="account__username text-second text-xl break-all">{username}</p>
        <span className="account__lvl w-fit px-1.5 py-0.5 bg-main/50 text-second text-xs font-light rounded-[40px]">
          {lvl}
        </span>
      </div>
      <p className="account__name color-second text-[14px] text-second/60 break-all">
        {name}
      </p>
    </div>
  );
};

export default AccountInfo;
