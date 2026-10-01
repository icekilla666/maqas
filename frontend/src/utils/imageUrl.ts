export type ImageVariant = "avatar" | "post" | "message";

// Стабильные размеры позволяют использовать один кэш на разных экранах.
const imageWidths: Record<ImageVariant, number> = {
  avatar: 256,
  post: 1200,
  message: 960,
};

export const getImageUrl = (source: string, variant: ImageVariant): string => {
  try {
    const url = new URL(source);
    // Меняем только публичные versioned URL, которые возвращает наш бэкенд.
    // Локальные превью, подписанные ссылки и готовые трансформации сохраняем.
    if (
      url.origin !== "https://res.cloudinary.com" ||
      url.username || url.password || url.search || url.hash
    ) return source;

    const match = url.pathname.match(/^\/([^/]+)\/image\/upload\/(v\d+\/.+)$/);
    if (!match) return source;

    url.pathname = `/${match[1]}/image/upload/c_limit,w_${imageWidths[variant]}/f_auto/q_auto/${match[2]}`;
    return url.href;
  } catch {
    return source;
  }
};
