import MainButton from "@/components/ui/Buttons/MainButton";
import { authApi } from "@/services/auth.api";
import { usersApi } from "@/services/users.api";
import { useAuthStore } from "@/store/auth.store";
import type { AccountData } from "@/types/entities";
import { useEffect, useState } from "react";
import AccountHeader from "./components/AccountHeader";

const AccountPage = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const [profile, setProfile] = useState<AccountData | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuth) return;
      try {
        const response = await usersApi.getMe();
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [isAuth]);
  const handleLogout = async () => {
    await authApi.logout();
    setUser(false, null);
  };

  return (
    <section>
      <div className="container">
        {isAuth && profile ? (
          <>
            <AccountHeader {...profile} lvl="лошок" />
            <MainButton onClick={handleLogout}>Выйти</MainButton>
          </>
        ) : (
          <h1>ты не зареган лалка</h1>
        )}
      </div>
    </section>
  );
};

export default AccountPage;
