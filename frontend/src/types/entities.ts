export type CountType = "followers" | "followings" | "publications";
export type FollowTab = "followers" | "followings";


export type FollowUser = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  level: string;
  status: "active" | "banned" | "deactivated";
};