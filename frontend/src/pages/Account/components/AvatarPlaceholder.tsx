const AvatarPlaceholder = ({ username }: { username: string }) => {
  if (!username) return;
  const sliceUsername = username.slice(0, 1).toUpperCase();
  return (
    <div className="w-full h-full bg-primary flex justify-center items-center rounded-full">
      <span className="text-[42px] text-second">{sliceUsername}</span>
    </div>
  );
};

export default AvatarPlaceholder;
