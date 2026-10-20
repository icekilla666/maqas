import { usePaginatedQuery } from "./usePaginatedQuery";
import { USE_MOCK_POSTS } from "@/utils/settingsMock";
import type { LikersData, PostPreview } from "@/types/api.types";
import { likesApi } from "@/services/likes.api";
import { likesKeys, postsKeys } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { showApiError } from "@/utils/apiError";

type SetPostLikeVariables = {
  id: string;
  nextIsLiked: boolean;
  nextLikesCount: number;
};

export const useLikersQuery = (id?: string) => usePaginatedQuery<LikersData>({
  queryKey: likesKeys.likers(id), path: `/api/likes/${id}`, enabled: Boolean(id),
  mock: USE_MOCK_POSTS ? () => likesApi.getPostLikers(id) : undefined,
});

export const useMyLikedQueries = () => usePaginatedQuery<PostPreview>({
  queryKey: likesKeys.myLiked(), path: "/api/likes/me",
});

// -------------

const invalidateLikeRelatedQueries = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: postsKeys.all }),
    queryClient.invalidateQueries({ queryKey: likesKeys.all }),
  ]);
};

export const usePostLikeMutation = () => {
  return useMutation({
    mutationKey: likesKeys.likePost(),
    mutationFn: ({ id, nextIsLiked }: SetPostLikeVariables) => {
      return nextIsLiked ? likesApi.likePost(id) : likesApi.unlikePost(id);
    },
    onError: showApiError,
    onSettled: invalidateLikeRelatedQueries,
  });
};
