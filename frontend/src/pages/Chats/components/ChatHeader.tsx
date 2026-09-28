import { Link } from "react-router-dom";
import { ChevronLeft, Ellipsis, RefreshCw, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu/ActionMenu";
import IconButton from "@/components/ui/Buttons/IconButton";
import type { ChatUserData } from "@/types/api.types";
import { CHATS_PAGE } from "@/utils/constants";
import ChatUserInfo from "./ChatUserInfo";

interface ChatHeaderProps {
  user?: ChatUserData;
  onDelete: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  disabled: boolean;
}

const ChatHeader = ({ user, onDelete, onRefresh, isRefreshing, disabled }: ChatHeaderProps) => (
  <header className="chat-header">
    <Link className="chat-header__back" to={CHATS_PAGE} aria-label="Вернуться к чатам"><ChevronLeft size={24} /></Link>
    {user ? (
      <Link to={`/${user.id}`} className="chat-header__user" aria-label={`Профиль ${user.name || user.username}`}><ChatUserInfo user={user} compact /></Link>
    ) : <h1 className="chat-header__user">Переписка</h1>}
    <IconButton type="button" size="small" aria-label="Обновить сообщения" onClick={onRefresh} disabled={isRefreshing || disabled}><RefreshCw size={18} /></IconButton>
    {!disabled && <ActionMenu ariaLabel="Меню чата" icon={<Ellipsis size={22} />} actions={[{ text: "Удалить чат", icon: <Trash2 size={18} />, className: "text-red", onClick: onDelete }]} />}
  </header>
);

export default ChatHeader;
