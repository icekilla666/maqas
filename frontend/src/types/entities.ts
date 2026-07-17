export type AccountData = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  status: string;
  email: string;
  level: string;
  bio: string;
  followers_count: number;
  followings_count: number;
  posts_count: number;
};

export type UserData = AccountData & {
  is_blocked: boolean;
  is_following: boolean;
};

export type BlackListUserData = Omit<
  AccountData,
  "email" | "bio" | "followers_count" | "followings_count" | "posts_count"
>;

export type CountType = "followers" | "followings" | "publications";

export type FollowUser = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  level: string;
  status: "active" | "banned" | "deactivated";
};
// type FormData = Omit<UserData, 'id' | 'role'>
