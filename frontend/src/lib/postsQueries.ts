import { postsApi } from "@/services/posts.api";
import { postsKeys } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useMyPostsQuery = () => {
  return useQuery({
    queryKey: postsKeys.myPosts(),
    queryFn: () => postsApi.getMyPosts(),
  });
};

export const useUserPostsQuery = (id?: string) => {
  return useQuery({
    queryKey: postsKeys.userPosts(id),
    queryFn: () => postsApi.getUserPosts(id),
    enabled: Boolean(id),
  });
};

export const usePostQuery = (id?: string) => {
  return useQuery({
    queryKey: postsKeys.post(id),
    queryFn: () => postsApi.getPost(id),
    enabled: Boolean(id),
  });
};

export const useLikersQuery = (id?: string) => {
  return useQuery({
    queryKey: postsKeys.postLikers(id),
    queryFn: () => postsApi.getPostLikers(id),
    enabled: Boolean(id),
  });
};

export const useCommentsQuery = (id?: string) => {
  return useQuery({
    queryKey: postsKeys.postComments(id),
    queryFn: () => postsApi.getPostComments(id),
    enabled: Boolean(id),
  });
};
