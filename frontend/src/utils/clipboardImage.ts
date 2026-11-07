// Используем данные самого события paste — разрешение на чтение буфера не нужно.
export const getClipboardImage = (data: DataTransfer): File | null => {
  for (const item of Array.from(data.items)) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) return file;
    }
  }
  return null;
};
