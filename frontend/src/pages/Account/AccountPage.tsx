import MainButton from "@/components/ui/MainButton";
import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

const AccountPage = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = async () => {
    const resp = await authApi.logout();
    console.log(resp);
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
