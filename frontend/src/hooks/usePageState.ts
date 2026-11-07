import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Состояние конкретной записи истории: возврат назад сохраняет фильтры,
// а новый переход на страницу начинает её с исходными настройками.
export const usePageState = <T>(name: string, initialValue: T) => {
  const { key } = useLocation();
  const storageKey = `page:${key}:${name}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved === null ? initialValue : JSON.parse(saved) as T;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* Хранилище может быть недоступно. */ }
  }, [storageKey, value]);
  return [value, setValue] as const;
};
