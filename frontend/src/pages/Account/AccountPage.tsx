import MainButton from "@/components/ui/Buttons/MainButton";
import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import AccountHeader from "./components/AccountHeader";
import Loader from "@/components/ui/Loader";
import { useProfileStore } from "@/store/profile.store";
import { useEffect } from "react";

const AccountPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { profile, isLoading, error, fetchProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(false, null);
    clearProfile();
  };
  if (isLoading) return <Loader />; // в будущем здесь будет skeletonview
  return (
    <section>
      <div className="container">
        {profile ? (
          <>
            <AccountHeader {...profile} lvl="лошок" />
            <MainButton onClick={handleLogout}>Выйти</MainButton>
          </>
        ) : (
          <h1 className="text-red text-center">{error}</h1>
        )}
      </div>
    </section>
  );
};

export default AccountPage;
