import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store.ts";
import axios from "axios";
import EmptyState from "@/components/common/EmptyState";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.tsx";
import Loader from "@/components/ui/Loaders/Loader.tsx";
import { useApplyTheme } from "@/store/theme.store.ts";
import AppToaster from "@/components/ui/AppToaster";
import { useChatsRealtime } from "@/hooks/useChatsRealtime.ts";

const App = () => {
  useApplyTheme();
  useChatsRealtime();

  const [authError, setAuthError] = useState(false);
  const [authAttempt, setAuthAttempt] = useState(0);
  const isAuthCheked = useAuthStore((state) => state.isAuthChecked);
  const setIsAuthCheked = useAuthStore((state) => state.setIsAuthChecked);
  useEffect(() => {
    let active = true;
    let pending = false;
    const initAuth = async () => {
      if (pending) return;
      pending = true;
      try {
        await authApi.refreshAccess();
        if (active) setIsAuthCheked(true);
      } catch (error) {
        if (!active) return;
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
          setIsAuthCheked(true);
        } else {
          setAuthError(true);
        }
      } finally {
        pending = false;
      }
    };
    const retryOnReturn = () => {
      if (document.visibilityState !== "hidden" && !useAuthStore.getState().isAuthChecked) void initAuth();
    };
    window.addEventListener("online", retryOnReturn);
    document.addEventListener("visibilitychange", retryOnReturn);
    void initAuth();
    return () => {
      active = false;
      window.removeEventListener("online", retryOnReturn);
      document.removeEventListener("visibilitychange", retryOnReturn);
    };
  }, [setIsAuthCheked, authAttempt]);

  if (!isAuthCheked)
    return (
      <div className="h-svh flex justify-center items-center">
        {authError ? (
          <EmptyState
            icon={<WifiOff />}
            text="Не удалось восстановить сессию. Проверьте подключение и попробуйте снова."
            isError
            onRefetch={() => { setAuthError(false); setAuthAttempt(value => value + 1); }}
          />
        ) : <Loader />}
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
