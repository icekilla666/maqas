import EmptyState from "@/components/common/EmptyState";
import UsersList from "@/components/common/UsersList";
import Loader from "@/components/ui/Loader";
import { useFollow, type FollowTab } from "@/hooks/useFollow";
import { useProfileStore } from "@/store/profile.store";
import {
  ChevronLeft,
  TriangleAlert,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import { useEffect } from "react";
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
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const initialTab: FollowTab =
    locationState?.tab === "followings" ? "followings" : "followers";
  const targetUserId = locationState?.userId ? locationState.userId : undefined;
  const {
    activeTab,
    setActiveTab,
    users,
    followers,
    followings,
    isLoading,
    serverError,
  } = useFollow(initialTab, targetUserId);
  const isFollowings = activeTab === "followings";
  const emptyText = isFollowings
    ? "Пока ни на кого не подписались"
    : "Здесь пока нет подписчиков";
  const followersCount =
    locationState?.followersCount ??
    profile?.followers_count ??
    followers.length;
  const followingsCount =
    locationState?.followingsCount ??
    profile?.followings_count ??
    followings.length;

  useEffect(() => {
    if (!profile) void fetchProfile();
  }, [fetchProfile, profile]);

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

      {isLoading && (
        <div className="follow-list__state">
          <Loader width={38} />
        </div>
      )}

      {!isLoading && serverError && (
        <EmptyState
          icon={<TriangleAlert />}
          text={serverError}
          variant="error"
        />
      )}

      {!isLoading && !serverError && users.length === 0 && (
        <EmptyState
          icon={isFollowings ? <UserRoundPlus /> : <UserRoundCheck />}
          text={emptyText}
        />
      )}

      {!isLoading && !serverError && users.length > 0 && (
        <UsersList users={users} />
      )}
    </div>
  );
};

export default FollowList;
