import { chatsApi } from "./chats.api";
import { getPostShareUrl } from "@/utils/sharedPost";

export const sharePostToUsers = async ({
  postId,
  userIds,
}: {
  postId: string;
  userIds: string[];
}) => {
  const recipients = [...new Set(userIds)];
  const results = await Promise.allSettled(
    recipients.map(async (userId) => {
      // Этот эндпоинт возвращает существующий чат или создаёт новый.
      const chat = await chatsApi.createChat(userId);
      await chatsApi.createMessage({
        chat_id: chat.id,
        content: getPostShareUrl(postId),
      });
      return userId;
    }),
  );

  const sentUserIds: string[] = [];
  const failures: { userId: string; error: unknown }[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") sentUserIds.push(result.value);
    else failures.push({ userId: recipients[index], error: result.reason });
  });
  return { sentUserIds, failures };
};
