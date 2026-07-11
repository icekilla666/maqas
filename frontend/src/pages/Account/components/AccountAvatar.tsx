import type { CSSProperties } from "react";
import AvatarPlaceholder from "./AvatarPlaceholder";

interface AvatarProps {
  avatar?: string;
  username: string;
  className?: string;
  width?: number;
  size?: number;
}
const AccountAvatar = ({
  avatar,
  username,
  width,
  className,
  size = 42,
}: AvatarProps) => {
  return (
    <div
      className={`account__avatar rounded-full ${className}`.trim()}
      style={
        { "--avatar-width": width ? `${width}px` : width } as CSSProperties
      }
    >
      {avatar ? (
        <img
          className="w-full h-full rounded-full object-cover"
          src={avatar}
          alt="avatar"
        />
      ) : (
        <AvatarPlaceholder username={username} size={size} />
      )}
    </div>
  );
};

export default AccountAvatar;
