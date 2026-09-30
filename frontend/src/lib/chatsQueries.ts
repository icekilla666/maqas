import { chatsApi } from "@/services/chats.api";
import { sharePostToUsers } from "@/services/postShare.api";
import { chatsKeys } from "@/utils/constants";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { showApiError } from "@/utils/apiError";
import { queryClient } from "./queryClient";
import type { ChatMessageData } from "@/types/api.types";

export const useMyChatsQuery = () => {
  return useQuery({
    queryKey: chatsKeys.myChats(),
    queryFn: chatsApi.myChats,
  });
};

export const useChatMessagesQuery = (chat_id?: string) => {
  return useQuery({
    queryKey: chatsKeys.chatMessages(chat_id),
    queryFn: chat_id ? () => chatsApi.getChatMessages(chat_id) : skipToken,
  });
};

// -------------

const invalidateChatRelatedQueries = () => {
  return queryClient.invalidateQueries({ queryKey: chatsKeys.all });
};

export const useSharePostMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.sharePost(),
    mutationFn: sharePostToUsers,
    retry: false,
    onSettled: () => {
      void invalidateChatRelatedQueries();
    },
  });
};

export const useCreateChatMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.createChat(),
    mutationFn: chatsApi.createChat,

    onError: showApiError,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: chatsKeys.myChats() });
    },
  });
};

export const useCreateMessageMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.createMessage(),
    mutationFn: chatsApi.createMessage,

    onError: showApiError,
    onSuccess: async (message) => {
      const queryKey = chatsKeys.chatMessages(message.chat_id);
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData<ChatMessageData[]>(queryKey, (messages = []) =>
        messages.some((item) => item.id === message.id)
          ? messages
          : [...messages, message],
      );
      void invalidateChatRelatedQueries();
    },
  });
};

export const useUpdateMessageMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.updateMessage(),
    mutationFn: chatsApi.updateMessage,

    onError: showApiError,
    onSuccess: invalidateChatRelatedQueries,
  });
};

export const useDeleteMessageMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.deleteMessage(),
    mutationFn: chatsApi.deleteMessage,

    onError: showApiError,
    onSuccess: invalidateChatRelatedQueries,
  });
};

export const useMarkMessagesAsReadMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.markMessagesAsRead(),
    mutationFn: chatsApi.markMessagesAsRead,

    onError: showApiError,
    onSuccess: invalidateChatRelatedQueries,
  });
};

export const useDeleteChatMutation = () => {
  return useMutation({
    mutationKey: chatsKeys.deleteChat(),
    mutationFn: chatsApi.deleteChat,

    onError: showApiError,
    onSuccess: async (_, chat_id) => {
      const queryKey = chatsKeys.chatMessages(chat_id);
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.removeQueries({ queryKey, exact: true });
      return queryClient.invalidateQueries({ queryKey: chatsKeys.myChats() });
    },
  });
};
