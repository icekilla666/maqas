import EmptyState from "@/components/common/EmptyState";
import PostsList from "@/components/common/Posts/PostsList";
import TitlePage from "@/components/common/TitlePage";
import Loader from "@/components/ui/Loaders/Loader";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostFeedQuery } from "@/lib/postsQueries";
import type { PostFeed, PostTag, HomeSort } from "@/types/api.types";
import { SearchX, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import HomeHeader from "./components/HomeHeader";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<PostTag[]>([]);
  const [followingOnly, setFollowingOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState<HomeSort>("new");
  const isToolbarHidden = useHideOnScroll();
  const debouncedSearch = useDebounce(search.trim(), 350);
  const requestSort: PostFeed["sort"] =
    selectedSort === "popular-desc" || selectedSort === "popular-asc"
      ? "popular"
      : selectedSort;

  const {
    data: feed = [],
    isError,
    isPending,
  } = usePostFeedQuery({
    feed_type: followingOnly ? "following" : "all",
    search_query: debouncedSearch || undefined,
    tags: selectedTags.length ? selectedTags : undefined,
    sort: requestSort,
  });

  const posts = useMemo(
    () =>
      selectedSort === "popular-asc"
        ? [...feed].sort(
            (firstPost, secondPost) =>
              firstPost.likes_count - secondPost.likes_count,
          )
        : feed,
    [feed, selectedSort],
  );

  return (
    <section className="home-feed">
      <div className="container relative">
        <TitlePage title="Лента" />

        <HomeHeader
          setSearch={setSearch}
          search={search}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          followingOnly={followingOnly}
          setFollowingOnly={setFollowingOnly}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          isToolbarHidden={isToolbarHidden}
        />

        {isPending ? (
          <Loader className="home-feed__loader" />
        ) : isError ? (
          <EmptyState
            icon={<TriangleAlert />}
            text="Не удалось загрузить публикации"
            variant="error"
          />
        ) : posts.length ? (
          <PostsList posts={posts} />
        ) : (
          <EmptyState
            icon={<SearchX />}
            text="По заданным параметрам публикаций не найдено"
          />
        )}

      </div>
    </section>
  );
};

export default HomePage;