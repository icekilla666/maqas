export const HOME_PAGE = "/";
export const ACCOUNT_PAGE = "/account";
export const FOLLOW_PAGE = `${ACCOUNT_PAGE}/follow`;
export const LOGIN_PAGE = "/login";
export const REGISTRATION_PAGE = "/registration";
export const USER_ACCOUNT = "/:id";
export const CHATS_PAGE = "/chats";
export const SETTINGS_PAGE = "/settings";
export const FAQ_PAGE = `${SETTINGS_PAGE}/faq`;
export const EDIT_PAGE = `${SETTINGS_PAGE}/edit`;
export const BLACKLIST_PAGE = `${SETTINGS_PAGE}/blacklist`;
export const VERIFY_EMAIL_PAGE = "/verify-email";
export const VERIFY_EMAIL_PENDING_PAGE = "/verify-email/pending";


export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  followers: (id?: string) =>
    [...userKeys.all, "followers", id ?? "me"] as const,
  followings: (id?: string) =>
    [...userKeys.all, "followings", id ?? "me"] as const,
  blacklist: () => [...userKeys.all, "blacklist"] as const,
};
