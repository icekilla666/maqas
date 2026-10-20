import { usePaginatedQuery } from "./usePaginatedQuery";
import type { CommentData } from "@/types/api.types";
import { commentsApi } from "@/services/comments.api";
import { commentsKeys, postsKeys } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { showApiError } from "@/utils/apiError";

export const useCommentsQuery = (id?: string) => usePaginatedQuery<CommentData>({
  queryKey: commentsKeys.comments(id), path: `/api/comments/post/${id}`, enabled: Boolean(id),
});

export const useRepliesComment = (id: string, enabled: boolean) => usePaginatedQuery<CommentData>({
  queryKey: commentsKeys.repliesComment(id), path: `/api/comments/${id}/replies`, enabled,
});

// -------------

const invalidateCommentRelatedQueries = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: postsKeys.all }),
    queryClient.invalidateQueries({ queryKey: commentsKeys.all }),
  ]);
};

export const useCommentSendMutation = () => {
  return useMutation({
    mutationKey: commentsKeys.sendComment(),
    mutationFn: commentsApi.sendPostComment,

    onError: showApiError,
    onSuccess: invalidateCommentRelatedQueries,
  });
};

export const useCommentDeleteMutation = () => {
  return useMutation({
    mutationKey: commentsKeys.deleteComment(),
    mutationFn: commentsApi.deletePostComment,

    onError: showApiError,
    onSuccess: invalidateCommentRelatedQueries,
  });
};

export const useCommentUpdateMutation = () => {
  return useMutation({
    mutationKey: commentsKeys.updateComment(),
    mutationFn: commentsApi.updatePostComment,

    onError: showApiError,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: commentsKeys.all });
    },
  });
};
