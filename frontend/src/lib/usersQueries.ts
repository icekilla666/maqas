import { usersApi } from "@/services/users.api";
import type { BlackListUserData } from "@/types/entities";
import { userKeys } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBlackListQuery = () => {
  return useQuery({
    queryKey: userKeys.blacklist(),
    queryFn: () => usersApi.getBlackList({ skip: 0, limit: 20 }),
  });
};

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.blockUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.blacklist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.unblockUser,
    onSuccess: (_, userId) => {
      queryClient.setQueryData<BlackListUserData[]>(
        userKeys.blacklist(),
        (old) => old?.filter((user) => user.id !== userId) ?? old,
      );
      queryClient.invalidateQueries({ queryKey: userKeys.blacklist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};
