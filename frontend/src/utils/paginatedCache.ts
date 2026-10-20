import type { InfiniteData } from "@tanstack/react-query";
import type { Page } from "@/services/pagination.api";

export const isPaginatedData = <T>(value: unknown): value is InfiniteData<Page<T>, number> =>
  !!value && typeof value === "object" && "pages" in value &&
  Array.isArray(value.pages) && value.pages.every(page => Array.isArray(page?.data));

export const removeListItem = (value: unknown, id: string): unknown => {
  if (Array.isArray(value)) return value.filter(item => item.id !== id);
  if (!isPaginatedData<{ id: string }>(value)) return value;
  if (!value.pages.some(page => page.data.some(item => item.id === id))) return value;
  let skip = 0;
  const pages = value.pages.map(page => {
    const data = page.data.filter(item => item.id !== id);
    const result = { ...page, data, skip, total: page.total === undefined ? undefined : Math.max(0, page.total - 1) };
    skip += data.length;
    return result;
  });
  return { ...value, pages, pageParams: pages.map(page => page.skip) };
};

export const nextPageOffset = <T>(page: Page<T>) => {
  const next = page.skip + page.data.length;
  if (!page.data.length || (page.total !== undefined
    ? next >= page.total : page.data.length < page.limit)) return undefined;
  return next;
};
