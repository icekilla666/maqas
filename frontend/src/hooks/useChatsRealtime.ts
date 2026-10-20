import { refreshAccessToken } from "@/services/api";
import { queryClient } from "@/lib/queryClient";
import { setChatSocket } from "@/services/chatsSocket";
import { useAuthStore } from "@/store/auth.store";
import { useChatsRealtimeStore } from "@/store/chatsRealtime.store";
import { chatsKeys } from "@/utils/constants";
import { useEffect } from "react";

const TYPING_TIMEOUT = 5000;

export const useChatsRealtime = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    let socket: WebSocket | null = null;
    let disposed = false;
    let connecting = false;
    let attempts = 0;
    let refreshRequired = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const canConnect = () => !disposed && document.visibilityState !== "hidden" && navigator.onLine;

    const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();
    const { setTyping, clearTyping, resetTyping } = useChatsRealtimeStore.getState();

    const stopTyping = (chatId: string) => {
      clearTimeout(typingTimers.get(chatId));
      typingTimers.delete(chatId);
      clearTyping(chatId);
    };

    const reset = () => {
      typingTimers.forEach((timer) => clearTimeout(timer));
      typingTimers.clear();
      resetTyping();
      useChatsRealtimeStore.getState().resetPresence();
    };

    const disconnect = () => {
      clearTimeout(retryTimer);
      if (socket) {
            socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onopen = null;
        socket.close();
        socket = null;
      }
      setChatSocket(null);
      reset();
    };

    const scheduleReconnect = () => {
      clearTimeout(retryTimer);
      if (!canConnect()) return;
      retryTimer = setTimeout(() => void connect(), Math.min(1000 * 2 ** attempts++, 30_000));
    };

    const connect = async () => {
      if (!canConnect() || connecting || socket) return;
      connecting = true;
      try {
        // Проверка exp нужна только для выбора момента refresh; JWT проверяет сервер.
        let expiresSoon = true;
        try {
          const part = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
          const { exp } = JSON.parse(atob(part));
          expiresSoon = typeof exp !== "number" || exp * 1000 <= Date.now() + 30_000;
        } catch { /* Неизвестный формат токена — пробуем refresh. */ }
        if (expiresSoon || refreshRequired) {
          await refreshAccessToken();
          refreshRequired = false;
          // Новый токен запустит новый effect, старое подключение больше не нужно.
          if (useAuthStore.getState().accessToken !== accessToken) return;
        }
        if (!canConnect()) return;
        const url = new URL("/api/ws/chats", window.location.origin);
        url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        url.searchParams.set("token", accessToken);
        socket = new WebSocket(url);
        setChatSocket(socket);
        socket.onopen = () => {
          attempts = 0;
          void queryClient.invalidateQueries({ queryKey: chatsKeys.all });
        };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const presence = useChatsRealtimeStore.getState();
        if (payload.type === "chat.connected" && Array.isArray(payload.data?.online_user_ids)) {
          presence.setOnlineUsers(payload.data.online_user_ids.filter((id: unknown): id is string => typeof id === "string"));
          return;
        }
        if (payload.type === "chat.user.online" || payload.type === "chat.user.offline") {
          if (typeof payload.data?.user_id === "string") {
            presence.setPresence(payload.data.user_id, payload.type === "chat.user.online");
          }
          return;
        }
        if (payload.type === "chat.list.updated") {
          void queryClient.invalidateQueries({ queryKey: chatsKeys.myChats() });
          return;
        }
        const chatId = payload?.data?.chat_id;
        if (typeof chatId !== "string") return;

        if (payload.type === "chat.typing.started" || payload.type === "chat.typing.stopped") {
          const userId = payload.data.user_id;
          if (typeof userId !== "string") return;

          if (payload.type === "chat.typing.started") {
            clearTimeout(typingTimers.get(chatId));
            setTyping(chatId, userId);
            typingTimers.set(chatId, setTimeout(() => stopTyping(chatId), TYPING_TIMEOUT));
          } else if (useChatsRealtimeStore.getState().typingByChat[chatId] === userId) {
            stopTyping(chatId);
          }
          return;
        }

        const messageEvents = [
          "chat.message.created",
          "chat.message.updated",
          "chat.message.deleted",
          "chat.message.read",
        ];

        if (!messageEvents.includes(payload.type)) return;

        if (
          payload.type === "chat.message.created" &&
          typeof payload.data.message?.sender?.id === "string" &&
          useChatsRealtimeStore.getState().typingByChat[chatId] === payload.data.message.sender.id
        ) {
          stopTyping(chatId);
        }

        void queryClient.invalidateQueries({
          queryKey: chatsKeys.chatMessages(chatId),
        });

        void queryClient.invalidateQueries({
          queryKey: chatsKeys.myChats(),
        });
      } catch (error) {
        console.error("Не удалось обработать событие чата:", error);
      }
    };

        socket.onclose = (event) => {
          refreshRequired = event.code === 1008;
          socket = null;
          setChatSocket(null);
          reset();
          scheduleReconnect();
        };
      } catch {
        // Временная ошибка сети не означает выход из аккаунта.
        scheduleReconnect();
      } finally {
        connecting = false;
      }
    };

    const resume = () => {
      if (!canConnect()) {
        disconnect();
        return;
      }
      clearTimeout(retryTimer);
      void connect();
    };
    const suspend = () => disconnect();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    window.addEventListener("offline", suspend);
    window.addEventListener("pageshow", resume);
    window.addEventListener("pagehide", suspend);
    void connect();

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
      window.removeEventListener("offline", suspend);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("pagehide", suspend);
      disconnect();
    };
  }, [accessToken]);
};
