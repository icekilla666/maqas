import { likesApi } from "@/services/likes.api";
import { likesKeys, postsKeys } from "@/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { toast } from "sonner";

type SetPostLikeVariables = {
  id: string;
  nextIsLiked: boolean;
  nextLikesCount: number;
};

export const useLikersQuery = (id?: string) => {
  return useQuery({
    queryKey: likesKeys.likers(id),
    queryFn: () => likesApi.getPostLikers(id),
    enabled: Boolean(id),
  });
};

export const useMyLikedQueries = () => {
  return useQuery({
    queryKey: likesKeys.myLiked(),
    queryFn: () => likesApi.getMyLikedPost(),
  });
};

// -------------

const invalidateLikeRelatedQueries = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: postsKeys.all }),
    queryClient.invalidateQueries({ queryKey: likesKeys.all }),
  ]);
};

export const usePostLikeMutation = () => {
  return useMutation({
    mutationFn: ({ id, nextIsLiked }: SetPostLikeVariables) => {
      return nextIsLiked ? likesApi.likePost(id) : likesApi.unlikePost(id);
    },
    onError: () => {
      toast.error("Что-то пошло не так");
    },
    onSettled: invalidateLikeRelatedQueries,
  });
};
