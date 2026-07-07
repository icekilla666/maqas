import AvatarPlaceholder from "./AvatarPlaceholder";

interface AvatarProps {
  avatar?: string;
  username: string;
}
const AccountAvatar = ({ avatar, username }: AvatarProps) => {
  return (
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
  );
};

export default AccountAvatar;
