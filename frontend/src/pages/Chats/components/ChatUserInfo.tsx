import Avatar from "@/components/common/Avatar/Avatar";
import DateTime from "@/components/common/DateTime";
import { Check, CheckCheck } from "lucide-react";
import type { ChatUserData, LastMessage } from "@/types/api.types";

interface ChatUserInfoProps {
  user: ChatUserData;
  compact?: boolean;
  last_message?: LastMessage | null;
  unread_count?: number;
}
const ChatUserInfo = ({ user, last_message, unread_count = 0, compact = false }: ChatUserInfoProps) => {
  const preview = last_message
    ? last_message.image_url
      ? "Фотография"
      : last_message.content ?? ""
    : `@${user.username}`;
  return (
    <>
      <Avatar
        avatar={user.avatar_url ?? undefined}
        username={user.username}
        width={compact ? 42 : 52}
        size={compact ? 23 : 28}
      />
      <span className="chat-user-info">
        <span className="chat-user-info__row">
          <span className="chat-user-info__name" title={user.name || user.username}>
            {user.name || user.username}
          </span>
          {last_message && (
            <span className="chat-list__time-row">
              {last_message.is_owner && typeof last_message.is_read === "boolean" && (
                <span
                  className="chat-list__read-status"
                  aria-label={last_message.is_read ? "Прочитано" : "Не прочитано"}
                  title={last_message.is_read ? "Прочитано" : "Не прочитано"}
                >
                  {last_message.is_read ? <CheckCheck size={14} /> : <Check size={14} />}
                </span>
              )}
              <DateTime date={last_message.created_at} className="chat-list__time" />
            </span>
          )}
        </span>
        <span className="chat-user-info__row">
          <span className="chat-user-info__username" title={preview}>
            {preview}
          </span>
          {last_message && unread_count > 0 && (
            <span
              className="chat-list__badge"
              aria-label={`Непрочитанных сообщений: ${unread_count}`}
            >
              {unread_count > 99 ? "99+" : unread_count}
            </span>
          )}
        </span>
      </span>
    </>
  );
};

export default ChatUserInfo;
