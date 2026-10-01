import type {
  ChatData,
  ChatMessageData,
  ChatShortData,
  CreateChatMessageProps,
  UpdateChatMessageProps,
} from "@/types/api.types";
import { api } from "./api";

const IMAGE_UPLOAD_TIMEOUT = 120_000;

export const chatsApi = {
  createChat: async (user_id: string): Promise<ChatShortData> => {
    const response = await api.post(`/api/chats/users/${user_id}`);
    return response.data.data;
  },
  myChats: async (): Promise<ChatData[]> => {
    const response = await api.get("/api/chats/me", {});
    return response.data.data;
  },

  getChatMessages: async (chat_id: string): Promise<ChatMessageData[]> => {
    const response = await api.get(`/api/chats/${chat_id}`, {});
    return response.data.data;
  },

  createMessage: async ({
    chat_id,
    content,
    parent_id,
    image,
  }: CreateChatMessageProps): Promise<ChatMessageData> => {
    const formData = new FormData();
    if (content != null) formData.append("message", content);
    if (parent_id != null) formData.append("parent_id", parent_id);
    if (image) formData.append("image", image);

    const response = await api.post(
      `/api/chats/${chat_id}/messages/create`,
      formData,
      image ? { timeout: IMAGE_UPLOAD_TIMEOUT } : {},
    );
    return response.data.data;
  },

  updateMessage: async ({
    message_id,
    content,
    image,
    image_removed,
  }: UpdateChatMessageProps): Promise<ChatMessageData> => {
    const formData = new FormData();
    if (content != null) formData.append("update_message", content);
    if (image) formData.append("image", image);

    const response = await api.patch(
      `/api/chats/messages/${message_id}`,
      formData,
      {
        params: { image_removed },
        ...(image ? { timeout: IMAGE_UPLOAD_TIMEOUT } : {}),
      },
    );
    return response.data.data;
  },

  deleteMessage: async (message_id: string) => {
    const response = await api.delete(`/api/chats/messages/${message_id}`);
    return response.data;
  },

  markMessagesAsRead: async (chat_id: string) => {
    const response = await api.patch(`/api/chats/${chat_id}/messages/read`);
    return response.data;
  },

  deleteChat: async (chat_id: string) => {
    const response = await api.delete(`/api/chats/${chat_id}`);
    return response.data;
  },
};
