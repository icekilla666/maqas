export type UserData = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: "user" | "admin";
};

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

export type CountType = "followers" | "followings" | "publications";

export type FollowUser = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  status: "active" | "banned" | "deactivated";
};
// type FormData = Omit<UserData, 'id' | 'role'>
