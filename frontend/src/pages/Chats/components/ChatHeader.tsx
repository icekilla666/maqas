import BackLink from "@/components/common/BackLink";
import { Link } from "react-router-dom";
import { Ellipsis, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu/ActionMenu";
import type { ChatUserData } from "@/types/api.types";
import { CHATS_PAGE } from "@/utils/constants";
import ChatUserInfo from "./ChatUserInfo";

interface ChatHeaderProps {
  user?: ChatUserData;
  isTyping: boolean;
  onDelete: () => void;
  disabled: boolean;
  canDelete: boolean;
}

const ChatHeader = ({ user, isTyping, onDelete, disabled, canDelete }: ChatHeaderProps) => (
  <header className="chat-header">
    <BackLink to={CHATS_PAGE} label="Вернуться к чатам" />
    {user ? (
      <Link
        to={`/${user.id}`}
        className="chat-header__user"
        aria-label={`Профиль ${user.name || user.username}`}
      >
        <ChatUserInfo user={user} isTyping={isTyping} compact />
      </Link>
    ) : (
      <h1 className="chat-header__user">Переписка</h1>
    )}
    {!disabled && (
      <ActionMenu
        ariaLabel="Меню чата"
        icon={<Ellipsis size={22} />}
        actions={[
          {
            text: "Удалить чат",
            icon: <Trash2 size={18} />,
            className: "text-red",
            onClick: onDelete,
            disabled: !canDelete,
          },
        ]}
      />
    )}
  </header>
);

export default ChatHeader;
