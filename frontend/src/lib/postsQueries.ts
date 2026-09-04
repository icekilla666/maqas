import { postsApi } from "@/services/posts.api";
import type { PostFeed } from "@/types/api.types";
import { postsKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export const usePostFeedQuery = ({
  feed_type,
  search_query,
  tags,
  sort,
}: PostFeed) => {
  return useQuery({
    queryKey: postsKeys.postFeed({ feed_type, search_query, tags, sort }),
    queryFn: () =>
      postsApi.getPostFeed({ feed_type, search_query, tags, sort }),
  });
};

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

// -------------

export const useCreatePostMutation = () => {
  return useMutation({
    mutationKey: postsKeys.createPost(),
    mutationFn: postsApi.createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postsKeys.all,
      });
    },
  });
};
