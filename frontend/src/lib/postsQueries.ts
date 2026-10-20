import { removeListItem } from "@/utils/paginatedCache";
import { usePaginatedQuery } from "./usePaginatedQuery";
import { USE_MOCK_POSTS } from "@/utils/settingsMock";
import { showApiError } from "@/utils/apiError";
import { postsApi } from "@/services/posts.api";
import type { PostFeed, PostPreview } from "@/types/api.types";
import { likesKeys, postsKeys, userKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { useDraftStore } from "@/store/draft.store";
import { isRequestOutcomeUncertain } from "@/utils/requestOutcome";

export const usePostFeedQuery = (filters: PostFeed) => usePaginatedQuery<PostPreview>({
  queryKey: postsKeys.postFeed(filters),
  path: "/api/posts/feed",
  params: filters,
  mock: USE_MOCK_POSTS ? () => postsApi.getPostFeed(filters) : undefined,
});

export const useMyPostsQuery = () => usePaginatedQuery<PostPreview>({
  queryKey: postsKeys.myPosts(),
  path: "/api/posts/me",
  mock: USE_MOCK_POSTS ? postsApi.getMyPosts : undefined,
});

export const useUserPostsQuery = (id?: string) => usePaginatedQuery<PostPreview>({
  queryKey: postsKeys.userPosts(id),
  path: `/api/posts/users/${id}`,
  enabled: Boolean(id),
  mock: USE_MOCK_POSTS ? () => postsApi.getUserPosts(id) : undefined,
});

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
      queryClient.setQueriesData({ queryKey: postsKeys.all }, data => removeListItem(data, postId));
      queryClient.setQueriesData({ queryKey: likesKeys.myLiked() }, data => removeListItem(data, postId));
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
