import { Link, generatePath } from "react-router-dom";
import type { ChatData } from "@/types/api.types";
import { CHAT_DETAIL } from "@/utils/constants";
import ChatUserInfo from "./ChatUserInfo";

const ChatList = ({ chats }: { chats: ChatData[] }) => {
  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <li key={chat.id}>
          <Link
            className="chat-list__item"
            to={generatePath(CHAT_DETAIL, { chat_id: chat.id })}
            state={{ user: chat.target_user }}
          >
            <ChatUserInfo user={chat.target_user} />
            {chat.unread_messages_count > 0 && (
              <span
                className="chat-list__badge"
                aria-label={`Непрочитанных сообщений: ${chat.unread_messages_count}`}
              >
                {chat.unread_messages_count > 99
                  ? "99+"
                  : chat.unread_messages_count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
