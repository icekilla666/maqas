import EmptyState from "@/components/common/EmptyState";
import UsersList from "@/components/common/UsersList/UsersList";
import Loader from "@/components/ui/Loaders/Loader";
import { useFollowQuery, useMeQuery } from "@/lib/usersQueries";
import type { FollowTab } from "@/types/entities";
import {
  ChevronLeft,
  TriangleAlert,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface FollowLocationState {
  tab?: FollowTab;
  userId?: string;
  username?: string;
  followersCount?: number;
  followingsCount?: number;
}

const FollowList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as FollowLocationState | null;
  const initialTab: FollowTab =
    locationState?.tab === "followings" ? "followings" : "followers";
  const targetUserId = locationState?.userId ? locationState.userId : undefined;
  const [activeTab, setActiveTab] = useState<FollowTab>(initialTab);
  const {
    data: users,
    isLoading,
    isError,
    isFetching,
  } = useFollowQuery(activeTab, targetUserId);
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
      <header className="follow-list__top">
        <button
          className="follow-list__back"
          type="button"
          aria-label="Назад"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={22} />
        </button>
        <p className="follow-list__page-title">
          {locationState?.username ?? profile?.username ?? "Профиль"}
        </p>
      </header>

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

      {isLoading || isFetching ? (
        <div className="follow-list__state">
          {/* скелет */}
          <Loader width={38} />
        </div>
      ) : isError ? (
        <EmptyState
          icon={<TriangleAlert />}
          text="Не удалось загрузить список"
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
    </div>
  );
};

export default FollowList;
