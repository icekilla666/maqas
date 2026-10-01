import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store.ts";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.tsx";
import Loader from "@/components/ui/Loaders/Loader.tsx";
import { useApplyTheme } from "@/store/theme.store.ts";
import AppToaster from "@/components/ui/AppToaster";
import { useChatsRealtime } from "@/hooks/useChatsRealtime.ts";

const App = () => {
  useApplyTheme();
  useChatsRealtime();

  const isAuthCheked = useAuthStore((state) => state.isAuthChecked);
  const setIsAuthCheked = useAuthStore((state) => state.setIsAuthChecked);
  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        await authApi.refreshAccess();
      } catch {
        // Refresh сам обновляет состояние сессии; сетевой сбой не сбрасывает её.
      } finally {
        if (active) setIsAuthCheked(true);
      }
    };
    void initAuth();
    return () => { active = false; };
  }, [setIsAuthCheked]);

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
      <AppToaster />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
