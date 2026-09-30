import { sendTyping } from "@/services/chatsSocket";
import { useCallback, useEffect, useRef } from "react";

const STOP_DELAY = 1500;
const REPEAT_DELAY = 2000;

export const useChatTyping = (chatId: string) => {
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentAtRef = useRef<number | null>(null);

  const stopTyping = useCallback(() => {
    if (timeRef.current !== null) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    if (lastSentAtRef.current !== null) {
      sendTyping(chatId, false);
      lastSentAtRef.current = null;
    }
  }, [chatId]);

  const handleTyping = useCallback(
    (value: string) => {
      if (!value.trim() || document.visibilityState !== "visible") {
        stopTyping();
        return;
      }
      const now = Date.now();
      const lastSentAt = lastSentAtRef.current;

      if (lastSentAt === null || now - lastSentAt >= REPEAT_DELAY) {
        if (sendTyping(chatId, true)) {
          lastSentAtRef.current = now;
        }
      }

      if (timeRef.current !== null) {
        clearTimeout(timeRef.current);
      }

      timeRef.current = setTimeout(stopTyping, STOP_DELAY);
    },
    [chatId, stopTyping],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        stopTyping();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTyping();
    };
  }, [stopTyping]);
  return { handleTyping, stopTyping };
};
