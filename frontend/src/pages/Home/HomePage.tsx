import InfiniteScroll from "@/components/common/InfiniteScroll";
import EmptyState from "@/components/common/EmptyState";
import PostsList from "@/components/common/Posts/PostsList";
import TitlePage from "@/components/common/TitlePage";
import PostsSkeleton from "@/components/common/Skeletons/PostsSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { usePostFeedQuery } from "@/lib/postsQueries";
import type { PostFeed, PostTag, HomeSort } from "@/types/api.types";
import { SearchX, TriangleAlert } from "lucide-react";
import { useState } from "react";
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
    selectedSort === "popular-desc" ? "popular"
      : selectedSort === "popular-asc" ? "popular_asc"
      : selectedSort;

  const feedQuery = usePostFeedQuery({
    feed_type: followingOnly ? "following" : "all",
    search_query: debouncedSearch || undefined,
    tags: selectedTags.length ? selectedTags : undefined,
    sort: requestSort,
  });
  const {
    data: feed = [],
    isError,
    error,
    isPending,
  } = feedQuery;

  const posts = feed;
  return (
    <section className="home-feed wrapper">
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
          <PostsSkeleton />
        ) : isError ? (
          <EmptyState
            icon={<TriangleAlert />}
            text="Не удалось загрузить публикации"
            error={error}
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

        <InfiniteScroll pagination={feedQuery} />
      </div>
    </section>
  );
};

export default HomePage;