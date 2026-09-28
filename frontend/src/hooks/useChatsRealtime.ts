import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth.store";
import { chatsKeys } from "@/utils/constants";
import { useEffect } from "react";

export const useChatsRealtime = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const url = new URL("/api/ws/chats", window.location.origin);

    url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    url.searchParams.set("token", accessToken);

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("соединение +");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        const messageEvents = [
          "chat.message.created",
          "chat.message.updated",
          "chat.message.deleted",
          "chat.message.read",
        ];

        if (!messageEvents.includes(payload.type)) return;
        if (typeof payload.data?.chat_id !== "string") return;

        void queryClient.invalidateQueries({
          queryKey: chatsKeys.chatMessages(payload.data.chat_id),
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
      console.log("соединение - ", event.code);
    };

    return () => {
      socket.close();
    };
  }, [accessToken]);
};
