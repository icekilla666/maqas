import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";

export interface PaginationControl {
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => Promise<unknown>;
}

const InfiniteScroll = ({ pagination, enabled = true, onLoad, label = "Загрузить ещё" }: {
  pagination: PaginationControl;
  enabled?: boolean;
  onLoad?: () => Promise<unknown>;
  label?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const { hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = pagination;
  const load = onLoad ?? fetchNextPage;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || !hasNextPage || isFetching || isFetchNextPageError) return;
    // У модалок и истории чата собственный скролл, у обычных страниц — окно.
    let root = element.parentElement;
    while (root) {
      const style = getComputedStyle(root);
      if (/(auto|scroll)/.test(`${style.overflowY} ${style.overflowX}`)) break;
      root = root.parentElement;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || lock.current) return;
      observer.disconnect();
      lock.current = true;
      void load().catch(() => {}).finally(() => { lock.current = false; });
    }, { root, rootMargin: "200px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, hasNextPage, isFetching, isFetchNextPageError, load]);

  if (!enabled || (!hasNextPage && !isFetchingNextPage)) return null;
  return (
    <div ref={ref} className="infinite-scroll">
      {isFetchingNextPage ? (
        <span role="status"><LoaderCircle size={18} className="animate-spin" /> Загрузка…</span>
      ) : (
        <>
          {isFetchNextPageError && <span role="status">Не удалось загрузить продолжение</span>}
          <button type="button" disabled={isFetching} onClick={() => {
            if (lock.current) return;
            lock.current = true;
            void load().catch(() => {}).finally(() => { lock.current = false; });
          }}>{isFetchNextPageError ? "Повторить" : label}</button>
        </>
      )}
    </div>
  );
};
export default InfiniteScroll;
