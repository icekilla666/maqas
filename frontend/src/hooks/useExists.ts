import { authApi } from "@/services/auth.api";
import { usersApi } from "@/services/users.api";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";

export const useExists = () => {
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(false, null);
    clearProfile();
  };
  const handleLogoutAll = async () => {
    await authApi.logoutAll();
    setUser(false, null);
    clearProfile();
  };
  const handleDelete = async () => {
    await usersApi.deleteMe();
  };

  return {
    handleLogout,
    handleLogoutAll,
    handleDelete,
  };
};
