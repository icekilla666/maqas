import { showApiError } from "@/utils/apiError";
import { postsApi } from "@/services/posts.api";
import type { PostDetails, PostFeed, PostPreview } from "@/types/api.types";
import { likesKeys, postsKeys, userKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { useDraftStore } from "@/store/draft.store";
import { isRequestOutcomeUncertain } from "@/utils/requestOutcome";

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

// -------------

export const useDeletePostMutation = () => {
  return useMutation({
    mutationKey: postsKeys.deletePost(),
    mutationFn: ({ postId }: { postId: string; authorId: string }) =>
      postsApi.deletePost(postId),
    retry: false,
    onError: showApiError,
    onSuccess: async (_, { postId, authorId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postsKeys.all }),
        queryClient.cancelQueries({ queryKey: likesKeys.myLiked() }),
      ]);
      queryClient.setQueriesData<PostPreview[] | PostDetails>(
        { queryKey: postsKeys.all },
        (data) => Array.isArray(data)
          ? data.filter((post) => post.id !== postId)
          : data,
      );
      queryClient.setQueryData<PostPreview[]>(likesKeys.myLiked(), (data) =>
        data?.filter((post) => post.id !== postId),
      );
      void queryClient.invalidateQueries({ queryKey: postsKeys.all });
      void queryClient.invalidateQueries({ queryKey: likesKeys.myLiked() });
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
      void queryClient.invalidateQueries({ queryKey: userKeys.detail(authorId) });
    },
  });
};

export const useCreatePostMutation = () => {
  return useMutation({
    mutationKey: postsKeys.createPost(),
    mutationFn: postsApi.createPost,
    retry: false,
    onMutate: (data) => {
      useDraftStore.getState().beginPublication(data);
    },
    onError: (error) => {
      if (isRequestOutcomeUncertain(error)) return;
      useDraftStore.getState().setPublicationUnconfirmed(false);
      showApiError(error);
    },
    onSuccess: () => {
      // Выполняется и при уходе со страницы, пока запрос ещё идёт.
      useDraftStore.getState().resetDraft();
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: postsKeys.all });
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
