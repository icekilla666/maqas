import type { CSSProperties } from "react";
import AvatarPlaceholder from "./AvatarPlaceholder";
import ImageViewer from "../ImageViewer";
import OptimizedImage from "../OptimizedImage";

interface AvatarProps {
  avatar?: string;
  preview?: boolean;
  username: string;
  className?: string;
  width?: number;
  size?: number;
}
const Avatar = ({
  avatar,
  preview = false,
  username,
  width,
  className = "",
  size = 42,
}: AvatarProps) => {
  const image = avatar ? (
    <OptimizedImage
      variant="avatar"
      className="w-full h-full rounded-full object-cover"
      src={avatar}
      alt={`Аватар ${username}`}
      loading="eager"
      decoding="async"
    />
  ) : <AvatarPlaceholder username={username} size={size} />;
  return (
    <div
      className={`account__avatar rounded-full ${className}`.trim()}
      style={
        { "--avatar-width": width ? `${width}px` : width } as CSSProperties
      }
    >
      {avatar && preview ? (
        <ImageViewer src={avatar} label={`Посмотреть аватар ${username}`} className="image-viewer--avatar">
          {image}
        </ImageViewer>
      ) : image}
    </div>
  );
};

export default Avatar;
