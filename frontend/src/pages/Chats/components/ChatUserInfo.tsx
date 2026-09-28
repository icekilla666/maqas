import Avatar from "@/components/common/Avatar/Avatar";
import type { ChatUserData } from "@/types/api.types";

interface ChatUserInfoProps {
  user: ChatUserData;
  compact?: boolean;
}

const ChatUserInfo = ({ user, compact = false }: ChatUserInfoProps) => (
  <>
    <Avatar avatar={user.avatar_url ?? undefined} username={user.username} width={compact ? 42 : 52} size={compact ? 23 : 28} />
    <span className="chat-user-info">
      <span className="chat-user-info__name">{user.name || user.username}</span>
      <span className="chat-user-info__username">@{user.username}</span>
    </span>
  </>
);

export default ChatUserInfo;
