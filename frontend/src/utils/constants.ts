import type { PostFeed } from "@/types/api.types";

// роуты
export const HOME_PAGE = "/";
export const ACCOUNT_PAGE = "/account";
export const FOLLOW_PAGE = `${ACCOUNT_PAGE}/follow`;
export const LOGIN_PAGE = "/login";
export const REGISTRATION_PAGE = "/registration";
export const USER_ACCOUNT = "/:id";
export const ADD_POSTS_PAGE = "/add-post";
export const POSTS_PAGE = "/posts";
export const POST_DETAIL = `${POSTS_PAGE}/:id`;
export const CHATS_PAGE = "/chats";
export const SETTINGS_PAGE = "/settings";
export const FAQ_PAGE = `${SETTINGS_PAGE}/faq`;
export const EDIT_PAGE = `${SETTINGS_PAGE}/edit`;
export const BLACKLIST_PAGE = `${SETTINGS_PAGE}/blacklist`;
export const VERIFY_EMAIL_PAGE = "/verify-email";
export const VERIFY_EMAIL_PENDING_PAGE = "/verify-email/pending";

// ключи кэша
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  followers: (id?: string) =>
    [...userKeys.all, "followers", id ?? "me"] as const,
  followings: (id?: string) =>
    [...userKeys.all, "followings", id ?? "me"] as const,
  blacklist: () => [...userKeys.all, "blacklist"] as const,
  search: (username: string) => [...userKeys.all, "search", username],
};

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
  logoutAll: () => [...authKeys.all, "logout-all"] as const,
  deleteMe: () => [...authKeys.all, "delete-me"] as const,
  resendEmail: () => [...authKeys.all, "resend-email"] as const,
};

export const postsKeys = {
  all: ["posts"] as const,
  postFeed: ({ feed_type, search_query, tags, sort }: PostFeed) =>
    [
      ...postsKeys.all,
      "feed-post",
      feed_type,
      search_query,
      tags,
      sort,
    ] as const,
  myPosts: () => [...postsKeys.all, "my-posts"] as const,
  userPosts: (id?: string) => [...postsKeys.all, "user-posts", id] as const,
  post: (id?: string) => [...postsKeys.all, "post", id] as const,
  postLikers: (id?: string) => [...postsKeys.all, "post-likers", id] as const,
  postComments: (id?: string) =>
    [...postsKeys.all, "post-comments", id] as const,
};
