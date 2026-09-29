import ModalActions from "@/components/ui/Modals/ModalActions";
import { useChatConversation } from "@/hooks/useChatConversation";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatComposer from "./ChatComposer";

const ChatConversation = ({ chatId }: { chatId: string }) => {
  const chat = useChatConversation(chatId);

  return (
    <section className="chat-page" aria-label="Переписка">
      <ChatHeader
        user={chat.user}
        onDelete={chat.openDeleteChat}
        disabled={chat.isBusy}
        canDelete={chat.canDeleteChat}
      />
      <ChatMessages
        messages={chat.messages}
        pendingMessageId={chat.pendingMessageId}
        isLoading={chat.messagesQuery.isPending}
        isError={chat.messagesQuery.isError}
        error={chat.messagesQuery.error}
        onRetry={chat.refetchMessages}
        scrollRequest={chat.scrollRequest}
        onReply={chat.handleReply}
        onEdit={chat.handleEdit}
        onDelete={chat.requestDeleteMessage}
        disabled={chat.isBusy}
      />
      <ChatComposer
        key={chat.context?.type === "edit" ? chat.context.message.id : "new-message"}
        context={chat.context}
        onCancel={chat.cancelContext}
        onSend={chat.handleSend}
        isPending={chat.isSending}
        disabled={chat.isComposerDisabled}
      />
      <ModalActions
        {...chat.deleteMessageDialog}
        text="Удалить сообщение у обоих участников?"
        confirmText="Удалить"
        cancelText="Отмена"
      />
      <ModalActions
        {...chat.deleteChatDialog}
        text="Удалить чат и все сообщения у обоих участников?"
        confirmText="Удалить чат"
        cancelText="Отмена"
      />
    </section>
  );
};

export default ChatConversation;
