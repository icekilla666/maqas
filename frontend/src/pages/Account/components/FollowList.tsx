import TitlePage from "@/components/common/TitlePage";
import { ACCOUNT_PAGE } from "@/utils/constants";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import EmptyState from "@/components/common/EmptyState";
import UsersList from "@/components/common/UsersList/UsersList";
import UsersSkeleton from "@/components/common/Skeletons/UsersSkeleton";
import { useFollowQuery, useMeQuery } from "@/lib/usersQueries";
import type { FollowTab } from "@/types/entities";
import {
  TriangleAlert,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface FollowLocationState {
  tab?: FollowTab;
  userId?: string;
  username?: string;
  followersCount?: number;
  followingsCount?: number;
}

const FollowList = () => {
  const location = useLocation();
  const locationState = location.state as FollowLocationState | null;
  const initialTab: FollowTab =
    locationState?.tab === "followings" ? "followings" : "followers";
  const targetUserId = locationState?.userId ? locationState.userId : undefined;
  const [activeTab, setActiveTab] = useState<FollowTab>(initialTab);
  const usersQuery = useFollowQuery(activeTab, targetUserId);
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = usersQuery;
  const { data: profile } = useMeQuery();

  const isFollowings = activeTab === "followings";
  const followersCount =
    locationState?.followersCount ?? profile?.followers_count ?? 0;
  const followingsCount =
    locationState?.followingsCount ?? profile?.followings_count ?? 0;

  const switchTab = (tab: FollowTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="follow-list">
      <TitlePage
        title={locationState?.username ?? profile?.username ?? "Профиль"}
        backTo={targetUserId ? `/${targetUserId}` : ACCOUNT_PAGE}
        backLabel="Вернуться в профиль"
      />

      <nav className="follow-list__tabs">
        <button
          className={`follow-list__tab ${
            activeTab === "followers" ? "active" : ""
          }`.trim()}
          type="button"
          onClick={() => switchTab("followers")}
        >
          <span className="follow-list__tab-count">{followersCount}</span>
          <span>подписчиков</span>
        </button>
        <button
          className={`follow-list__tab ${
            activeTab === "followings" ? "active" : ""
          }`.trim()}
          type="button"
          onClick={() => switchTab("followings")}
        >
          <span className="follow-list__tab-count">{followingsCount}</span>
          <span>подписок</span>
        </button>
      </nav>

      {isLoading ? (
        <UsersSkeleton />
      ) : isError ? (
        <EmptyState
          icon={<TriangleAlert />}
          text="Не удалось загрузить список"
          error={error}
          variant="error"
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={isFollowings ? <UserRoundPlus /> : <UserRoundCheck />}
          text={
            isFollowings
              ? "Пока ни на кого не подписались"
              : "Здесь пока нет подписчиков"
          }
        />
      ) : (
        <UsersList users={users} userId={profile?.id} />
      )}
      <InfiniteScroll pagination={usersQuery} />
    </div>
  );
};

export default FollowList;
