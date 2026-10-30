import { useEffect } from "react";
import { useMyChatsQuery } from "@/lib/chatsQueries";

export const useUnreadChats = () => {
  const {
    data: chats,
    hasNextPage,
    isFetching,
    isError,
    isFetchNextPageError,
    fetchNextPage,
  } = useMyChatsQuery();
  const hasUnread = chats.some((chat) => chat.unread_count > 0);

  useEffect(() => {
    // Для точки достаточно одного непрочитанного чата. Если его пока нет,
    // проверяем следующие страницы, используя общий кеш списка чатов.
    if (hasUnread || !hasNextPage || isFetching || isError || isFetchNextPageError) return;
    void fetchNextPage({ cancelRefetch: false }).catch(() => {});
  }, [hasUnread, hasNextPage, isFetching, isError, isFetchNextPageError, fetchNextPage]);

  return hasUnread;
};
