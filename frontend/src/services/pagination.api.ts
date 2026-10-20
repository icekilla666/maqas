import { api } from "./api";

export const PAGE_SIZE = 20;
export type Page<T> = { data: T[]; skip: number; limit: number; total?: number };

export const getPage = async <T>(
  path: string,
  skip: number,
  params: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<Page<T>> => {
  const response = await api.get<Page<T>>(path, {
    params: { ...params, skip, limit: PAGE_SIZE },
    paramsSerializer: { indexes: null },
    signal,
  });
  const page = response.data;
  if (!Array.isArray(page.data)) throw new Error("Сервер не вернул список");
  return {
    data: page.data,
    skip,
    limit: PAGE_SIZE,
    // Некоторые ручки возвращают total=0 по умолчанию, даже при непустом списке.
    total: typeof page.total === "number" && page.total >= skip + page.data.length
      ? page.total : undefined,
  };
};
