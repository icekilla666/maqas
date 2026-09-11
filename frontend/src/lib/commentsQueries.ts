import { commentsApi } from "@/services/comments.api";
import { commentsKeys, postsKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { toast } from "sonner";

export const useCommentsQuery = (id?: string) => {
  return useQuery({
    queryKey: commentsKeys.comments(id),
    queryFn: () => commentsApi.getPostComments(id),
    enabled: Boolean(id),
  });
};

export const useFullComment = (comment_id?: string) => {
  return useQuery({
    queryKey: commentsKeys.fullComment(comment_id),
    queryFn: () => commentsApi.getFullComment(comment_id),
    enabled: Boolean(comment_id),
  });
};

export const useRepliesComment = (comment_id?: string) => {
  return useQuery({
    queryKey: commentsKeys.repliesComment(comment_id),
    queryFn: () => commentsApi.getRepliesComment(comment_id),
    enabled: Boolean(comment_id),
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

    onError: () => {
      toast.error("Что-то пошло не так");
    },
    onSuccess: invalidateCommentRelatedQueries,
  });
};

export const useCommentDeleteMutation = () => {
  return useMutation({
    mutationKey: commentsKeys.deleteComment(),
    mutationFn: commentsApi.deletePostComment,

    onError: () => {
      toast.error("Что-то пошло не так");
    },
    onSuccess: invalidateCommentRelatedQueries,
  });
};

export const useCommentUpdateMutation = () => {
  return useMutation({
    mutationKey: commentsKeys.updateComment(),
    mutationFn: commentsApi.updatePostComment,

    onError: () => {
      toast.error("Что-то пошло не так");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.all });
    },
  });
};
