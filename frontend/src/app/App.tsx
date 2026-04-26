import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../router.tsx";
import Loader from "@/components/ui/Loader.tsx";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthCheked = useAuthStore((state) => state.isAuthChecked);
  const setIsAuthCheked = useAuthStore((state) => state.setIsAuthChecked);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.refreshAccess();
        setUser(true, response.data.access_token);
      } catch {
        setUser(false, null);
      } finally {
        setIsAuthCheked(true);
      }
    };
    initAuth();
  }, [setUser, setIsAuthCheked]);

  if (!isAuthCheked)
    return (
      <div className="h-svh flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <>
      <RouterProvider router={router} />
      <h1 className="hidden text-6xl uppercase text-center md:block">
        компьютерная версия недоступна, переходи на мобилку лошок
      </h1>
    </>
  );
};

export default App;
