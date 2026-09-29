import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModalActions from "@/components/ui/Modals/ModalActions";
import {
  useChatMessagesQuery,
  useCreateMessageMutation,
  useDeleteChatMutation,
  useDeleteMessageMutation,
  useMyChatsQuery,
  useUpdateMessageMutation,
} from "@/lib/chatsQueries";
import { useMeQuery } from "@/lib/usersQueries";
import type { ChatMessageData, ChatUserData } from "@/types/api.types";
import { CHATS_PAGE } from "@/utils/constants";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatComposer, {
  type ChatComposerContext,
} from "./components/ChatComposer";

const ChatConversation = ({ chatId }: { chatId: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: chats } = useMyChatsQuery();
  const { data: me } = useMeQuery();
  const messagesQuery = useChatMessagesQuery(chatId);
  const createMessage = useCreateMessageMutation();
  const updateMessage = useUpdateMessageMutation();
  const deleteMessage = useDeleteMessageMutation();
  const deleteChat = useDeleteChatMutation();
  const [context, setContext] = useState<ChatComposerContext>();
  const [messageToDelete, setMessageToDelete] = useState<ChatMessageData>();
  const [isDeleteChatOpen, setIsDeleteChatOpen] = useState(false);
  const [scrollRequest, setScrollRequest] = useState(0);

  const messages = useMemo(
    () =>
      [...(messagesQuery.data ?? [])]
        .map((message) => ({
          ...message,
          is_owner: message.is_owner === true || message.sender.id === me?.id,
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
    [messagesQuery.data, me?.id],
  );
  const state = location.state as { user?: ChatUserData } | null;
  const user =
    chats?.find((chat) => chat.id === chatId)?.target_user ??
    state?.user ??
    (me
      ? messages.find((message) => message.sender.id !== me.id)?.sender
      : undefined);
  const isBusy =
    createMessage.isPending ||
    updateMessage.isPending ||
    deleteMessage.isPending ||
    deleteChat.isPending;
  const canDeleteChat = messagesQuery.isSuccess && messages.length > 0;

  const handleSend = async (content: string, image: File | null) => {
    if (context?.type === "edit") {
      await updateMessage.mutateAsync({
        message_id: context.message.id,
        content,
        image_removed: false,
      });
    } else {
      await createMessage.mutateAsync({
        chat_id: chatId,
        content: content || undefined,
        image,
        parent_id: context?.message.id,
      });
      setScrollRequest((value) => value + 1);
    }
    setContext(undefined);
  };

  return (
    <section className="chat-page" aria-label="Переписка">
      <ChatHeader
        user={user}
        onDelete={() => setIsDeleteChatOpen(true)}
        disabled={isBusy}
        canDelete={canDeleteChat}
      />
      <ChatMessages
        messages={messages}
        isLoading={messagesQuery.isPending}
        isError={messagesQuery.isError}
        error={messagesQuery.error}
        onRetry={() => void messagesQuery.refetch()}
        scrollRequest={scrollRequest}
        onReply={(message) => setContext({ type: "reply", message })}
        onEdit={(message) => setContext({ type: "edit", message })}
        onDelete={setMessageToDelete}
        disabled={isBusy}
      />
      <ChatComposer
        key={context?.type === "edit" ? context.message.id : "new-message"}
        context={context}
        onCancel={() => setContext(undefined)}
        onSend={handleSend}
        isPending={createMessage.isPending || updateMessage.isPending}
        disabled={isBusy || !messagesQuery.data || messagesQuery.isError}
      />
      <ModalActions
        open={!!messageToDelete}
        text="Удалить сообщение у обоих участников?"
        confirmText="Удалить"
        cancelText="Отмена"
        isPending={deleteMessage.isPending}
        onCancel={() => setMessageToDelete(undefined)}
        onConfirm={() => {
          if (!messageToDelete) return;
          deleteMessage.mutate(messageToDelete.id, {
            onSuccess: () => {
              if (context?.message.id === messageToDelete.id)
                setContext(undefined);
              setMessageToDelete(undefined);
            },
          });
        }}
      />
      <ModalActions
        open={isDeleteChatOpen && canDeleteChat}
        text="Удалить чат и все сообщения у обоих участников?"
        confirmText="Удалить чат"
        cancelText="Отмена"
        isPending={deleteChat.isPending}
        onCancel={() => setIsDeleteChatOpen(false)}
        onConfirm={() => {
          if (!canDeleteChat) return;
          deleteChat.mutate(chatId, {
            onSuccess: () => navigate(CHATS_PAGE, { replace: true }),
          });
        }}
      />
    </section>
  );
};

const ChatPage = () => {
  const { chat_id } = useParams<{ chat_id: string }>();
  return chat_id ? <ChatConversation key={chat_id} chatId={chat_id} /> : null;
};

export default ChatPage;
