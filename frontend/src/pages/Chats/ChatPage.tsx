import { useParams } from "react-router-dom";
import ChatConversation from "./components/ChatConversation";

const ChatPage = () => {
  const { chat_id } = useParams<{ chat_id: string }>();
  return chat_id ? <ChatConversation key={chat_id} chatId={chat_id} /> : null;
};

export default ChatPage;
