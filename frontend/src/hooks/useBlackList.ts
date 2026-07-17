import { usersApi } from "@/services/users.api";

export const useBlackList = () => {
  const handleBlock = async (id: string) => {
    await usersApi.blockUser(id);
  };

  const handleUnblock = async (id: string) => {
    await usersApi.unblockUser(id);
  };
  return {
    handleBlock,
    handleUnblock
  };
};
