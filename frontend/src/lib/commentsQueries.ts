import { commentsApi } from "@/services/comments.api";
import { commentsKeys, postsKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { showApiError } from "@/utils/apiError";

export const useCommentsQuery = (id?: string) => {
  return useQuery({
    queryKey: commentsKeys.comments(id),
    queryFn: () => commentsApi.getPostComments(id),
  });
};

export const useRepliesComment = (comment_id: string, enabled: boolean) => {
  return useQuery({
    queryKey: commentsKeys.repliesComment(comment_id),
    queryFn: () => commentsApi.getRepliesComment(comment_id),
    enabled,
  });
};

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
