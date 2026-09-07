import { mockPostComments } from "@/mocks/posts.mock";
import type { CommentData } from "@/types/api.types";
import { MOCK_DELAY_MS, USE_MOCK_POSTS, wait } from "@/utils/settingsMock";
import { api } from "./api";

export const commentsApi = {
  getPostComments: async (id?: string): Promise<CommentData[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPostComments;
    }

    const response = await api.get(`/api/comments/post/${id}`);
    return response.data.data;
  },
};
