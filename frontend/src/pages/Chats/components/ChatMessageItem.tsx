import { Check, CheckCheck, Ellipsis, Pencil, Reply, Trash2 } from "lucide-react";
import DateTime from "@/components/common/DateTime";
import ActionMenu, { type ActionMenuItem } from "@/components/ui/ActionMenu/ActionMenu";
import type { ChatMessageData } from "@/types/api.types";

interface ChatMessageItemProps {
  message: ChatMessageData;
  parent?: ChatMessageData;
  onReply: (message: ChatMessageData) => void;
  onEdit: (message: ChatMessageData) => void;
  onDelete: (message: ChatMessageData) => void;
  onImageLoad: () => void;
  disabled: boolean;
}

const ChatMessageItem = ({ message, parent, onReply, onEdit, onDelete, onImageLoad, disabled }: ChatMessageItemProps) => {
  const actions: ActionMenuItem[] = [
    { text: "Ответить", icon: <Reply size={18} />, onClick: () => onReply(message) },
    ...(message.is_owner ? [
      { text: "Редактировать текст", icon: <Pencil size={18} />, onClick: () => onEdit(message) },
      { text: "Удалить", icon: <Trash2 size={18} />, className: "text-red", onClick: () => onDelete(message) },
    ] : []),
  ];

  return (
    <article className={`chat-message ${message.is_owner ? "chat-message--own" : ""}`} aria-label={message.is_owner ? "Ваше сообщение" : `Сообщение от ${message.sender.name || message.sender.username}`}>
      <div className="chat-message__bubble">
        {message.parent_id && (
          <div className="chat-message__quote">
            <strong>{parent ? parent.sender.name || parent.sender.username : "Ответ на сообщение"}</strong>
            <span>{parent ? parent.content || "Изображение" : "Сообщение вне загруженной истории"}</span>
          </div>
        )}
        {message.image_url && <a href={message.image_url} target="_blank" rel="noreferrer" aria-label="Открыть изображение"><img className="chat-message__image" src={message.image_url} alt="Изображение в сообщении" onLoad={onImageLoad} /></a>}
        {message.content && <p className="chat-message__text">{message.content}</p>}
        <div className="chat-message__meta">
          <DateTime date={message.created_at} onlyTime />
          {message.is_owner && <span aria-label={message.is_read ? "Прочитано" : "Отправлено"} title={message.is_read ? "Прочитано" : "Отправлено"}>{message.is_read ? <CheckCheck size={15} /> : <Check size={15} />}</span>}
          {!disabled && <ActionMenu icon={<Ellipsis size={17} />} ariaLabel="Действия с сообщением" actions={actions} />}
        </div>
      </div>
    </article>
  );
};

export default ChatMessageItem;
