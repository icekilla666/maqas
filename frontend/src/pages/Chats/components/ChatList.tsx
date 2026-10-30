import { NavLink, generatePath } from "react-router-dom";
import type { ChatData } from "@/types/chats.types";
import { CHAT_DETAIL } from "@/utils/constants";
import { useChatsRealtimeStore } from "@/store/chatsRealtime.store";
import ChatUserInfo from "./ChatUserInfo";

const ChatList = ({ chats }: { chats: ChatData[] }) => {
  const typingByChat = useChatsRealtimeStore((state) => state.typingByChat);

  return (
    <ul className="chat-list">
      {chats.map((chat) => {
        const lastMessage = chat.last_message;
        if (!lastMessage) return null;

        return (
          <li key={chat.id}>
            <NavLink
              className={({ isActive }) => `chat-list__item${isActive ? " is-active" : ""}`}
              to={generatePath(CHAT_DETAIL, { chat_id: chat.id })}
              state={{ user: chat.target_user }}
            >
              <ChatUserInfo
                last_message={lastMessage}
                user={chat.target_user}
                unread_count={chat.unread_count}
                isTyping={typingByChat[chat.id] === chat.target_user.id}
              />
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
