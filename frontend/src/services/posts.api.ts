import {
  mockFollowingUserIds,
  mockPostComments,
  mockPostLikers,
  mockPosts,
} from "@/mocks/posts.mock";
import type {
  CommentData,
  LikersData,
  PostFeed,
  PostOut,
} from "@/types/api.types";
import { api } from "./api";

const USE_MOCK_POSTS = true;
const MOCK_DELAY_MS = 350;

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export const postsApi = {
  getPostFeed: async ({
    feed_type,
    search_query,
    tags,
    sort,
  }: PostFeed): Promise<PostOut[]> => {
    if (USE_MOCK_POSTS) {
      await wait(MOCK_DELAY_MS);

      const normalizedSearch = search_query?.trim().toLocaleLowerCase("ru-RU");
      let feed = [...mockPosts];

      if (feed_type === "following") {
        feed = feed.filter((post) =>
          mockFollowingUserIds.includes(post.user.id),
        );
      }

      if (tags?.length) {
        feed = feed.filter((post) =>
          post.tags.some(({ tag }) => tags.includes(tag)),
        );
      }

      if (normalizedSearch) {
        const hashtagSearch = normalizedSearch.startsWith("#")
          ? normalizedSearch.slice(1)
          : null;

        feed = feed.filter((post) => {
          if (hashtagSearch) {
            return post.hashtags?.some(({ hashtag }) =>
              hashtag.toLocaleLowerCase("ru-RU").includes(hashtagSearch),
            );
          }

          return [post.title, post.content].some((value) =>
            value.toLocaleLowerCase("ru-RU").includes(normalizedSearch),
          );
        });
      }

      feed.sort((firstPost, secondPost) => {
        if (sort === "popular") {
          return secondPost.likes_count - firstPost.likes_count;
        }

        const firstDate = new Date(firstPost.created_at).getTime();
        const secondDate = new Date(secondPost.created_at).getTime();

        return sort === "old"
          ? firstDate - secondDate
          : secondDate - firstDate;
      });

      return feed;
    }

    const response = await api.get("/api/posts/feed", {
      params: {
        feed_type,
        search_query,
        tags,
        sort,
      },
    });
    return response.data.data;
  },

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
