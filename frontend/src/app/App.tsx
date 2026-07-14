import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store.ts";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.tsx";
import Loader from "@/components/ui/Loader.tsx";
import { useProfileStore } from "@/store/profile.store.ts";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthCheked = useAuthStore((state) => state.isAuthChecked);
  const setIsAuthCheked = useAuthStore((state) => state.setIsAuthChecked);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.refreshAccess();
        setUser(true, response.data.access_token);
      } catch {
        clearProfile();
        setUser(false, null);
      } finally {
        setIsAuthCheked(true);
      }
    };
    initAuth();
  }, [clearProfile, setUser, setIsAuthCheked]);

  if (!isAuthCheked)
    return (
      <div className="h-svh flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <>
      <h1 className="hidden text-6xl uppercase text-center md:block">
        компьютерная версия недоступна, переходи на мобилку лошок
      </h1>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
