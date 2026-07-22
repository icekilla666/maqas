import {
  useDeleteMeMutation,
  useLogoutAllMutation,
  useLogoutMutation,
} from "@/lib/authQueries";

export const useExists = () => {
  const logout = useLogoutMutation();
  const logoutAll = useLogoutAllMutation();
  const deleteMe = useDeleteMeMutation();

  return {
    handleLogout: () => logout.mutateAsync(),
    handleLogoutAll: () => logoutAll.mutateAsync(),
    handleDelete: () => deleteMe.mutateAsync(),
    isPending: logout.isPending || logoutAll.isPending || deleteMe.isPending,
  };
};
