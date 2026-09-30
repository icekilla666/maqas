const APP_ORIGIN = "https://maqas.ru";
const POST_PATH = /^\/posts\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;

export const getPostShareUrl = (postId: string) =>
  `${APP_ORIGIN}/posts/${encodeURIComponent(postId)}`;

export const getSharedPostId = (
  content: string | null | undefined,
  currentOrigin = typeof window === "undefined" ? APP_ORIGIN : window.location.origin,
): string | null => {
  if (!content || /\s/.test(content.trim())) return null;

  try {
    const url = new URL(content.trim());
    if (
      !["http:", "https:"].includes(url.protocol) ||
      ![APP_ORIGIN, currentOrigin].includes(url.origin) ||
      url.username || url.password
    ) return null;

    return url.pathname.match(POST_PATH)?.[1] ?? null;
  } catch {
    return null;
  }
};

export const getChatMessagePreview = (message: {
  content: string | null;
  image_url: string | null;
}): string => {
  if (getSharedPostId(message.content)) return "Публикация";
  if (message.image_url) return "Фотография";
  return message.content ?? "";
};
