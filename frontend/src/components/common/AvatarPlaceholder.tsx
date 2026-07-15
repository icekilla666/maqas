interface AvatarPlaceholderProps {
  username: string;
  size?: number;
}

const AvatarPlaceholder = ({ username, size }: AvatarPlaceholderProps) => {
  if (!username) return;
  const sliceUsername = username.slice(0, 1).toUpperCase();
  return (
    <div className="w-full h-full bg-primary flex justify-center items-center rounded-full">
      <span className="text-second" style={{ fontSize: `${size}px` }}>
        {sliceUsername}
      </span>
    </div>
  );
};

export default AvatarPlaceholder;
