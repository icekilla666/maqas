import ActionMenu, {
  type ActionMenuItem,
} from "@/components/ui/ActionMenu/ActionMenu";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import type { PostTag, HomeSort } from "@/types/api.types";
import { POST_TAGS } from "@/utils/constants";
import {
  ArrowUpDown,
  Clock3,
  ListFilter,
  Tags,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";

interface HomeHeaderProps {
  setSearch: (search: string) => void;
  search: string;
  selectedTags: PostTag[];
  setSelectedTags: Dispatch<SetStateAction<PostTag[]>>;
  followingOnly: boolean;
  setFollowingOnly: Dispatch<SetStateAction<boolean>>;
  selectedSort: HomeSort;
  setSelectedSort: (sort: HomeSort) => void;
  isToolbarHidden: boolean;
}

const HomeHeader = ({
  setSearch,
  search,
  selectedTags,
  setSelectedTags,
  followingOnly,
  setFollowingOnly,
  selectedSort,
  setSelectedSort,
  isToolbarHidden,
}: HomeHeaderProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const toggleTag = (tag: PostTag) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  };

  const hasActiveFilters = followingOnly || selectedTags.length > 0;

  const sortActions: ActionMenuItem[] = [
    {
      actions: [
        {
          isActive: selectedSort === "popular-desc",
          onClick: () => setSelectedSort("popular-desc"),
          text: "Более популярное",
        },
        {
          isActive: selectedSort === "popular-asc",
          onClick: () => setSelectedSort("popular-asc"),
          text: "Менее популярное",
        },
      ],
      icon: <TrendingUp size={18} />,
      isActive: selectedSort.startsWith("popular"),
      text: "По популярности",
    },
    {
      actions: [
        {
          isActive: selectedSort === "new",
          onClick: () => setSelectedSort("new"),
          text: "Сначала новые",
        },
        {
          isActive: selectedSort === "old",
          onClick: () => setSelectedSort("old"),
          text: "Сначала старые",
        },
      ],
      icon: <Clock3 size={18} />,
      isActive: selectedSort === "new" || selectedSort === "old",
      text: "По новизне",
    },
  ];

  const filterActions: ActionMenuItem[] = [
    {
      actions: POST_TAGS.map((tag) => ({
        text: tag,
        isActive: selectedTags.includes(tag),
        onClick: () => toggleTag(tag),
      })),
      icon: <Tags size={18} />,
      isActive: selectedTags.length > 0,
      text: "Теги",
    },
    {
      icon: <UsersRound size={18} />,
      isActive: followingOnly,
      onClick: () => setFollowingOnly((isFollowingOnly) => !isFollowingOnly),
      text: "Мои подписки",
    },
  ];
  return (
    <div
      className={`home-feed__toolbar ${
        isToolbarHidden ? "home-feed__toolbar--hidden" : ""
      }`.trim()}
    >
      <SearchInput
        aria-label="Поиск по публикациям"
        className="home-feed__search"
        maxLength={20}
        onChange={handleSearchChange}
        placeholder="#хештег или название"
        value={search}
      />
      <div className="home-feed__actions">
        <ActionMenu
          actions={filterActions}
          ariaLabel="Фильтры публикаций"
          className={`home-feed__action ${
            hasActiveFilters ? "active" : ""
          }`.trim()}
          icon={<ListFilter size={20} />}
        />
        <ActionMenu
          actions={sortActions}
          ariaLabel="Сортировка публикаций"
          className="home-feed__action"
          icon={<ArrowUpDown size={20} />}
        />
      </div>
    </div>
  );
};

export default HomeHeader;
