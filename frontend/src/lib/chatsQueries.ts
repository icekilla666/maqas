import { isPaginatedData } from "@/utils/paginatedCache";
import { usePaginatedQuery } from "./usePaginatedQuery";
import { chatsApi } from "@/services/chats.api";
import { sharePostToUsers } from "@/services/postShare.api";
import { chatsKeys } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { showApiError } from "@/utils/apiError";
import { queryClient } from "./queryClient";
import type { ChatMessageData, ChatData } from "@/types/api.types";
import { isRequestOutcomeUncertain } from "@/utils/requestOutcome";

export const useMyChatsQuery = () => usePaginatedQuery<ChatData>({
  queryKey: chatsKeys.myChats(), path: "/api/chats/me",
});

export const useChatMessagesQuery = (id?: string) => usePaginatedQuery<ChatMessageData>({
  queryKey: chatsKeys.chatMessages(id), path: `/api/chats/${id}`, enabled: Boolean(id),
});

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
    retry: false,
    onError: (error) => {
      // Неопределённый результат показывается у сообщения в открытом чате.
      if (!isRequestOutcomeUncertain(error)) showApiError(error);
    },
    onSuccess: async (message) => {
      const queryKey = chatsKeys.chatMessages(message.chat_id);
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueriesData({ queryKey }, (data: unknown) => {
        if (!isPaginatedData<ChatMessageData>(data) || !data.pages.length) return data;
        if (data.pages.some(page => page.data.some(item => item.id === message.id))) return data;
        const pages = data.pages.map((page, index) => ({
          ...page,
          data: index === 0 ? [message, ...page.data] : page.data,
          skip: index === 0 ? 0 : page.skip + 1,
          total: page.total === undefined ? undefined : page.total + 1,
        }));
        return { ...data, pages, pageParams: pages.map(page => page.skip) };
      });
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
      await queryClient.cancelQueries({ queryKey });
      queryClient.removeQueries({ queryKey });
      return queryClient.invalidateQueries({ queryKey: chatsKeys.myChats() });
    },
  });
};
