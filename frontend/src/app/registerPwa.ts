import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

// Один экземпляр на приложение, вне React StrictMode.
export const registerPwa = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh() {
      toast.info("Доступна новая версия Maqas", {
        id: "pwa-update",
        duration: Infinity,
        description: "Сохрани незавершённые изменения перед обновлением.",
        action: {
          label: "Обновить",
          onClick: () => {
            void updateServiceWorker(true).catch(() => {
              toast.error("Не удалось обновить приложение. Попробуй ещё раз.");
            });
          },
        },
      });
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      let checking = false;
      let lastCheck = 0;
      const check = async () => {
        if (document.hidden || !navigator.onLine || checking || registration.installing) return;
        if (Date.now() - lastCheck < 30_000) return;
        checking = true;
        lastCheck = Date.now();
        try {
          await registration.update();
        } catch {
          // Нет сети или сервер обновляется: повторяем при следующем возвращении.
        } finally {
          checking = false;
        }
      };
      void check();
      window.addEventListener("online", check);
      window.addEventListener("pageshow", check);
      document.addEventListener("visibilitychange", check);
      window.setInterval(check, 5 * 60_000);
    },
    onRegisterError(error) {
      console.error("Не удалось зарегистрировать обновления PWA:", error);
    },
  });
};
