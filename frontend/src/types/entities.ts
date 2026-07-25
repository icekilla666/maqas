import type { BlackListUserData, FindUsers } from "./api.types";

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