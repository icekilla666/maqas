import { commentsApi } from "@/services/comments.api";
import { commentsKeys } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useCommentsQuery = (id?: string) => {
  return useQuery({
    queryKey: commentsKeys.comments(id),
    queryFn: () => commentsApi.getPostComments(id),
    enabled: Boolean(id),
  });
};
