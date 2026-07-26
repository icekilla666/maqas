import {
  mockPostComments,
  mockPostLikers,
  mockPosts,
} from "@/mocks/posts.mock";
import type { CommentData, LikersData, PostOut } from "@/types/api.types";
import { api } from "./api";

const USE_MOCK_POSTS = true;
const MOCK_DELAY_MS = 350;

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export const postsApi = {
  getMyPosts: async (): Promise<PostOut[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPosts;
    }

    const response = await api.get("/api/posts/me");
    return response.data.data;
  },
  getUserPosts: async (id?: string): Promise<PostOut[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPosts;
    }
    const response = await api.get(`/api/posts/me/${id}`);
    return response.data.data;
  },
  getPost: async (id?: string): Promise<PostOut> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPosts.find((post) => post.id === id) ?? mockPosts[0];
    }

    const response = await api.get(`/api/posts/${id}`);
    return response.data.data;
  },

  getPostLikers: async (id?: string): Promise<LikersData[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPostLikers;
    }

    const response = await api.get(`/api/likes/${id}`);
    return response.data.data;
  },

  getPostComments: async (id?: string): Promise<CommentData[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);
      return mockPostComments;
    }

    const response = await api.get(`/api/comments/post/${id}`);
    return response.data.data;
  },
};
