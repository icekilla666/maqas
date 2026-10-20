import { nextPageOffset } from "@/utils/paginatedCache";
import { useMemo } from "react";
import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query";
import { getPage, PAGE_SIZE, type Page } from "@/services/pagination.api";

interface Options<T> {
  queryKey: QueryKey;
  path: string;
  params?: Record<string, unknown>;
  enabled?: boolean;
  mock?: () => Promise<T[]>;
}

export const usePaginatedQuery = <T extends { id: string }>({
  queryKey, path, params, enabled = true, mock,
}: Options<T>) => {
  const query = useInfiniteQuery({
    queryKey: [...queryKey, "infinite"],
    enabled,
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }): Promise<Page<T>> => {
      if (mock) {
        const items = await mock();
        return { data: items.slice(pageParam, pageParam + PAGE_SIZE), skip: pageParam, limit: PAGE_SIZE, total: items.length };
      }
      return getPage<T>(path, pageParam, params, signal);
    },
    getNextPageParam: nextPageOffset<T>,
  });
  const data = useMemo(() => {
    // При изменении ленты между запросами страницы могут пересекаться.
    const seen = new Set<string>();
    return query.data?.pages.flatMap(page => page.data).filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }) ?? [];
  }, [query.data]);

  return {
    ...query,
    data,
    total: query.data?.pages[0]?.total,
    // Ошибка дозагрузки не должна скрывать уже показанный список.
    isError: query.isError && !query.data,
    error: query.data ? null : query.error,
  };
};
