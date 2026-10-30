import { useParams } from "react-router-dom";
import ChatWorkspace from "./components/ChatWorkspace";
import ChatConversation from "./components/ChatConversation";

const ChatPage = () => {
  const { chat_id } = useParams<{ chat_id: string }>();
  return (
    <ChatWorkspace>
      {chat_id ? <ChatConversation key={chat_id} chatId={chat_id} /> : null}
    </ChatWorkspace>
  );
};

export default ChatPage;
