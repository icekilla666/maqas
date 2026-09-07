import { mockPostLikers } from "@/mocks/posts.mock";
import type { LikersData, PostPreview } from "@/types/api.types";
import { MOCK_DELAY_MS, USE_MOCK_POSTS, wait } from "@/utils/settingsMock";
import { api } from "./api";

export const likesApi = {
  getPostLikers: async (id?: string): Promise<LikersData[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPostLikers;
    }

    const response = await api.get(`/api/likes/${id}`);
    return response.data.data;
  },

  getMyLikedPost: async (): Promise<PostPreview[]> => {
    const response = await api.get("/api/likes/me");
    return response.data.data;
  },

  likePost: async (id: string) => {
    const response = await api.post(`/api/likes/${id}`);
    return response.data.data;
  },

  unlikePost: async (id: string) => {
    const response = await api.delete(`/api/likes/${id}`);
    return response.data.data;
  },
};
