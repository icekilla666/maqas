import type { CommentFull, CommentPreview, SendCommentsProps } from "@/types/api.types";
import { api } from "./api";

export const commentsApi = {
  getPostComments: async (id?: string): Promise<CommentPreview[]> => {
    const response = await api.get(`/api/comments/post/${id}`);
    return response.data.data;
  },

  getFullComment: async (comment_id?: string): Promise<CommentFull> => {
    const response = await api.get(`/api/comments/${comment_id}`);
    return response.data.data;
  },

  getRepliesComment: async (comment_id?: string): Promise<CommentPreview[]> => {
    const response = await api.get(`/api/comments/${comment_id}/replies`);
    return response.data.data;
  },

  sendPostComment: async ({ id, parent_id, content }: SendCommentsProps) => {
    const response = await api.post(`/api/comments/post/${id}`, {
      content,
      parent_id,
    });
    return response;
  },

  updatePostComment: async ({
    comment_id,
    content,
  }: {
    comment_id: string;
    content: string;
  }): Promise<CommentFull> => {
    const response = await api.patch(`/api/comments/${comment_id}`, { content });
    return response.data.data;
  },

  deletePostComment: async (comment_id?: string) => {
    const response = await api.delete(`/api/comments/${comment_id}`);
    return response.data.data;
  },
};
