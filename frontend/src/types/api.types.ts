export type RegisterData = {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ProfileProps = {
  username?: string;
  name?: string;
  bio?: string;
};

export type ListUsersProps = {
  skip?: number;
  limit?: number;
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

export type UserData = AccountData & {
  is_blocked: boolean;
  is_following: boolean;
};

export type BlackListUserData = Omit<
  AccountData,
  "email" | "bio" | "followers_count" | "followings_count" | "posts_count"
>;
