export const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

export const validateImage = (file: File): string | null => {
  if (file.size > MAX_IMAGE_SIZE) return "Изображение слишком большое. Максимальный размер — 15 МБ";
  if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
    return "Выберите изображение JPG, PNG, GIF или WebP";
  }
  return null;
};
