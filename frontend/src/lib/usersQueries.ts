import { usersApi } from "@/services/users.api";
import type { AccountData, BlackListUserData, UserData } from "@/types/api.types";
import type { FollowTab } from "@/types/entities";
import { userKeys } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ToggleFollowVariables = {
  userId: string;
  isFollowing: boolean;
};

type ToggleFollowContext = {
  previousUser?: UserData;
  previousMe?: AccountData;
};

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

export const useFollowQuery = (tab: FollowTab, userId?: string) => {
  return useQuery({
    queryKey:
      tab === "followers"
        ? userKeys.followers(userId)
        : userKeys.followings(userId),

    queryFn: () => {
      const params = { skip: 0, limit: 20 };

      if (tab === "followers") {
        return userId
          ? usersApi.getUserFollowers(userId, params)
          : usersApi.getFollowers(params);
      }
      return userId
        ? usersApi.getUserFollowings(userId, params)
        : usersApi.getFollowings(params);
    },
  });
};

// post запросы
export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.blockUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.blacklist() });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.followers() });
      queryClient.invalidateQueries({ queryKey: userKeys.followings() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followings(userId) });
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

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isFollowing }: ToggleFollowVariables) =>
      isFollowing ? usersApi.unfollowUser(userId) : usersApi.followUser(userId),

    onMutate: async ({ userId, isFollowing }): Promise<ToggleFollowContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: userKeys.detail(userId) }),
        queryClient.cancelQueries({ queryKey: userKeys.me() }),
      ]);

      const previousUser = queryClient.getQueryData<UserData>(
        userKeys.detail(userId),
      );
      const previousMe = queryClient.getQueryData<AccountData>(userKeys.me());

      const nextIsFollowing = !isFollowing;
      const delta = nextIsFollowing ? 1 : -1;

      queryClient.setQueryData<UserData>(userKeys.detail(userId), (old) =>
        old
          ? {
              ...old,
              is_following: nextIsFollowing,
              followers_count: Math.max(0, old.followers_count + delta),
            }
          : old,
      );

      queryClient.setQueryData<AccountData>(userKeys.me(), (old) =>
        old
          ? {
              ...old,
              followings_count: Math.max(0, old.followings_count + delta),
            }
          : old,
      );

      return { previousUser, previousMe };
    },

    onError: (_error, { userId }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(userId), context.previousUser);
      }

      if (context?.previousMe) {
        queryClient.setQueryData(userKeys.me(), context.previousMe);
      }
    },

    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followings() });
    },
  });
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.unfollowUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.followers(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followings() });
    },
  });
};

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
