import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ChatDirectory from "./ChatDirectory";

const ChatWorkspace = ({ children }: { children?: ReactNode }) => {
  const isWide = useMediaQuery("(min-width: 1200px)");

  if (!isWide) return children ?? <ChatDirectory />;

  return (
    <div className="chat-workspace">
      <aside className="chat-workspace__directory" aria-label="Список чатов">
        <ChatDirectory />
      </aside>
      <div className="chat-workspace__conversation">
        {children ?? (
          <div className="chat-workspace__welcome">
            <MessageCircle size={48} aria-hidden="true" />
            <h1>Ваши сообщения</h1>
            <p>Выберите переписку слева или найдите человека, чтобы начать общение.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWorkspace;
