import { Check, CheckCheck, Clock3, Pencil, Reply, Trash2 } from "lucide-react";
import DateTime from "@/components/common/DateTime";
import ContextMenu from "@/components/ui/ActionMenu/ContextMenu";
import type { ActionMenuItem } from "@/components/ui/ActionMenu/ActionMenuList";
import type { ChatMessageData } from "@/types/api.types";
import { getChatMessagePreview, getSharedPostId } from "@/utils/sharedPost";
import ChatPostCard from "./ChatPostCard";

interface ChatMessageItemProps {
  message: ChatMessageData;
  parent?: ChatMessageData;
  onReply: (message: ChatMessageData) => void;
  onEdit: (message: ChatMessageData) => void;
  onDelete: (message: ChatMessageData) => void;
  onImageLoad: () => void;
  disabled: boolean;
  isSending?: boolean;
}

const ChatMessageItem = ({
  message,
  parent,
  onReply,
  onEdit,
  onDelete,
  onImageLoad,
  disabled,
  isSending = false,
}: ChatMessageItemProps) => {
  const sharedPostId = getSharedPostId(message.content);
  const statusLabel = isSending
    ? "Отправляется"
    : message.is_read
      ? "Прочитано"
      : "Отправлено";
  const actions: ActionMenuItem[] = [
    {
      text: "Ответить",
      icon: <Reply size={18} />,
      onClick: () => onReply(message),
    },
    ...(message.is_owner
      ? [
          ...(!sharedPostId
            ? [
                {
                  text: "Редактировать текст",
                  icon: <Pencil size={18} />,
                  onClick: () => onEdit(message),
                },
              ]
            : []),
          {
            text: "Удалить",
            icon: <Trash2 size={18} />,
            className: "text-red",
            onClick: () => onDelete(message),
          },
        ]
      : []),
  ];

  return (
    <article
      className={`chat-message ${message.is_owner ? "chat-message--own" : ""}`}
      aria-label={
        message.is_owner
          ? "Ваше сообщение"
          : `Сообщение от ${message.sender.name || message.sender.username}`
      }
    >
      <ContextMenu
        className={`chat-message__bubble ${sharedPostId ? "chat-message__bubble--post" : ""}`}
        actions={actions}
        disabled={disabled || isSending}
        ariaLabel="Сообщение. Меню действий: удержание, правая кнопка мыши или Shift+F10"
      >
        {message.parent_id && (
          <div className="chat-message__quote">
            <strong>
              {parent
                ? parent.sender.name || parent.sender.username
                : "Ответ на сообщение"}
            </strong>
            <span>
              {parent
                ? getChatMessagePreview(parent)
                : "Сообщение вне загруженной истории"}
            </span>
          </div>
        )}
        {message.image_url && (
          <a
            href={message.image_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть изображение"
            draggable={false}
          >
            <img
              className="chat-message__image"
              src={message.image_url}
              alt="Изображение в сообщении"
              onLoad={onImageLoad}
              draggable={false}
            />
          </a>
        )}
        {sharedPostId ? (
          <ChatPostCard postId={sharedPostId} onContentLoad={onImageLoad} />
        ) : (
          message.content && (
            <p className="chat-message__text">{message.content}</p>
          )
        )}
        <div className="chat-message__meta">
          <DateTime date={message.created_at} onlyTime />
          {message.is_owner && (
            <span aria-label={statusLabel} title={statusLabel}>
              {isSending ? (
                <Clock3 size={15} />
              ) : message.is_read ? (
                <CheckCheck size={15} />
              ) : (
                <Check size={15} />
              )}
            </span>
          )}
        </div>
      </ContextMenu>
    </article>
  );
};

export default ChatMessageItem;
