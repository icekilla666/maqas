import { mockPosts } from "@/mocks/posts.mock";
import type { PostOutShort } from "@/types/api.types";
import { api } from "./api";

const USE_MOCK_POSTS = true;
const MOCK_DELAY_MS = 350;

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export const postsApi = {
  getMyPosts: async (): Promise<PostOutShort[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPosts;
    }

    const response = await api.get("/api/posts/me");
    return response.data.data;
  },
};
