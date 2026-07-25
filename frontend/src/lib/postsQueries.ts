import { postsApi } from "@/services/posts.api";
import { postsKeys } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useMyPostsQuery = () => {
  return useQuery({
    queryKey: postsKeys.myPosts(),
    queryFn: () => postsApi.getMyPosts(),
  });
};
