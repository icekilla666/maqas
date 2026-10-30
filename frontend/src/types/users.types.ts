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
  blocked_by_user: boolean;
  blocked_user: boolean;
  is_following: boolean;
};

export type BlackListUserData = Omit<
  AccountData,
  "email" | "bio" | "followers_count" | "followings_count" | "posts_count"
>;

export type FindUsers = BlackListUserData & {
  is_following: boolean;
};

export type CountType = "followers" | "followings" | "publications";

export type FollowTab = "followers" | "followings";

export type FollowUser = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  level: string;
  status: "active" | "banned" | "deactivated";
};

export type ListUser = FollowUser | BlackListUserData | FindUsers;
