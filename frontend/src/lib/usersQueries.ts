import { usersApi } from "@/services/users.api";
import type { BlackListUserData } from "@/types/entities";
import { userKeys } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// get запросы
export const useBlackListQuery = () => {
  return useQuery({
    queryKey: userKeys.blacklist(),
    queryFn: () => usersApi.getBlackList({ skip: 0, limit: 20 }),
  });
};

export const useMeQuery = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => usersApi.getMe(),
  });
};

export const useUserQuery = (id?: string) => {
  return useQuery({
    queryKey: id ? userKeys.detail(id) : [...userKeys.all, "detail", "missing"],
    queryFn: () => {
      if (!id) throw new Error("ID аккаунта не распознан!");
      return usersApi.getUser(id);
    },
    enabled: Boolean(id),
  });
};

export const useFollowersQuery = () => {
  return useQuery({
    queryKey: userKeys.followers(),
    queryFn: () => usersApi.getFollowers({ skip: 0, limit: 20 }),
  });
};

export const useFollowingsQuery = () => {
  return useQuery({
    queryKey: userKeys.followings(),
    queryFn: () => usersApi.getFollowings({ skip: 0, limit: 20 }),
  });
};

// post запросы
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
