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
    };

    const url = new URL("/api/ws/chats", window.location.origin);

    url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    url.searchParams.set("token", accessToken);

    const socket = new WebSocket(url);
    setChatSocket(socket);

    socket.onopen = () => {
      console.log("соединение +");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
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
          exact: true,
        });

        void queryClient.invalidateQueries({
          queryKey: chatsKeys.myChats(),
        });
      } catch (error) {
        console.error("Не удалось обработать событие чата:", error);
      }
    };

    socket.onclose = (event) => {
      reset();
      console.log("соединение - ", event.code);
    };

    return () => {
      socket.onmessage = null;
      socket.onclose = null;
      reset();
      setChatSocket(null);
      socket.close();
    };
  }, [accessToken]);
};
