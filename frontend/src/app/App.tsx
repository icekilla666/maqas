import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store.ts";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.tsx";
import Loader from "@/components/ui/Loaders/Loader.tsx";
import { useApplyTheme } from "@/store/theme.store.ts";
import { Toaster } from "sonner";

const App = () => {
  useApplyTheme();

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
      <h1 className="hidden text-6xl uppercase text-center md:block">
        компьютерная версия недоступна, переходи на мобилку лошок
      </h1>
      <RouterProvider router={router} />
      <Toaster
        className="app-toaster"
        closeButton
        duration={4500}
        gap={10}
        mobileOffset={16}
        offset={24}
        position="top-right"
        toastOptions={{
          className: "app-toast",
        }}
      />
    </>
  );
};

export default App;
