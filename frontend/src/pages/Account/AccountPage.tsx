import MainButton from "@/components/ui/Buttons/MainButton";
import { authApi } from "@/services/auth.api";
import { usersApi } from "@/services/users.api";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

const AccountPage = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuth) return;
      try {
        const response = await usersApi.getMe();
        console.log(response);
      } catch (error) {
        console.log(error);
        console.log('error')
      }
    };
    fetchProfile();
  }, [isAuth]);
  const handleLogout = async () => {
    await authApi.logout();
    setUser(false, null);
  };
  return (
    <div>
      <h1>Account page</h1>
      {isAuth ? (
        <div className="flex flex-col gap-2 max-w-3xs mx-auto">
          <h1>добро пожаловать</h1>
          <MainButton onClick={handleLogout}>Выйти</MainButton>
        </div>
      ) : (
        <h1>ты не зареган лалка</h1>
      )}
    </div>
  );
};

export default AccountPage;
