import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useChatMessagesQuery,
  useCreateMessageMutation,
  useDeleteChatMutation,
  useDeleteMessageMutation,
  useMarkMessagesAsReadMutation,
  useMyChatsQuery,
  useUpdateMessageMutation,
} from "@/lib/chatsQueries";
import { useMeQuery } from "@/lib/usersQueries";
import type { ChatMessageData, ChatUserData } from "@/types/api.types";
import { CHATS_PAGE } from "@/utils/constants";
import type { ChatComposerContext } from "@/pages/Chats/components/ChatComposer";

export const useChatConversation = (chatId: string) => {
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
  const [pendingMessage, setPendingMessage] = useState<ChatMessageData>();
  const {
    mutate: markAsRead,
    isPending: isMarkingRead,
    isError: isReadError,
  } = useMarkMessagesAsReadMutation();

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
  const displayedMessages = pendingMessage
    ? [...messages, pendingMessage]
    : messages;

  useEffect(() => {
    const imageUrl = pendingMessage?.image_url;
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [pendingMessage]);
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

  const hasUnreadMessages =
    !!me &&
    messagesQuery.isSuccess &&
    messages.some((message) => !message.is_owner && !message.is_read);

  useEffect(() => {
    if (!hasUnreadMessages || isMarkingRead || isReadError) return;

    const markVisible = () => {
      if (document.visibilityState === "visible") {
        markAsRead(chatId);
      }
    };
    markVisible();
    document.addEventListener("visibilitychange", markVisible);
    return () => {
      document.removeEventListener("visibilitychange", markVisible);
    };
  }, [hasUnreadMessages, isMarkingRead, isReadError, markAsRead, chatId]);

  const handleSend = async (content: string, image: File | null) => {
    if (context?.type === "edit") {
      await updateMessage.mutateAsync({
        message_id: context.message.id,
        content,
        image_removed: false,
      });
    } else {
      if (!me) throw new Error("Профиль ещё не загружен");

      setPendingMessage({
        id: `pending-${chatId}`,
        chat_id: chatId,
        content: content || null,
        image_url: image ? URL.createObjectURL(image) : null,
        parent_id: context?.message.id ?? null,
        created_at: new Date().toISOString(),
        sender: me,
        is_owner: true,
        is_read: false,
      });
      setScrollRequest((value) => value + 1);
      try {
        await createMessage.mutateAsync({
          chat_id: chatId,
          content: content || undefined,
          image,
          parent_id: context?.message.id,
        });
      } finally {
        setPendingMessage(undefined);
      }
    }
    setContext(undefined);
  };


  const handleReply = (message: ChatMessageData) => {
    setContext({ type: "reply", message });
  };

  const handleEdit = (message: ChatMessageData) => {
    setContext({ type: "edit", message });
  };

  const handleDeleteMessage = () => {
    if (!messageToDelete) return;
    deleteMessage.mutate(messageToDelete.id, {
      onSuccess: () => {
        if (context?.message.id === messageToDelete.id) setContext(undefined);
        setMessageToDelete(undefined);
      },
    });
  };

  const handleDeleteChat = () => {
    if (!canDeleteChat) return;
    deleteChat.mutate(chatId, {
      onSuccess: () => navigate(CHATS_PAGE, { replace: true }),
    });
  };

  return {
    user,
    messages: displayedMessages,
    pendingMessageId: pendingMessage?.id,
    messagesQuery,
    context,
    scrollRequest,
    isBusy,
    canDeleteChat,
    isSending: createMessage.isPending || updateMessage.isPending,
    isComposerDisabled: isBusy || !me || !messagesQuery.data || messagesQuery.isError,
    handleSend,
    handleReply,
    handleEdit,
    cancelContext: () => setContext(undefined),
    refetchMessages: () => void messagesQuery.refetch(),
    openDeleteChat: () => setIsDeleteChatOpen(true),
    requestDeleteMessage: setMessageToDelete,
    deleteMessageDialog: {
      open: !!messageToDelete,
      isPending: deleteMessage.isPending,
      onCancel: () => setMessageToDelete(undefined),
      onConfirm: handleDeleteMessage,
    },
    deleteChatDialog: {
      open: isDeleteChatOpen && canDeleteChat,
      isPending: deleteChat.isPending,
      onCancel: () => setIsDeleteChatOpen(false),
      onConfirm: handleDeleteChat,
    },
  };
};
