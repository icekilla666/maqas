import Loader from "@/components/ui/Loader";
import { useFollow, type FollowTab } from "@/hooks/useFollow";
import { useProfileStore } from "@/store/profile.store";
import type { FollowUser } from "@/types/entities";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const getInitial = (username: string) => username.slice(0, 1).toUpperCase();
const getStatusLabel = (status: FollowUser["status"]) =>
  status === "banned" ? "заблокирован" : "не активен";

const FollowList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const initialTab: FollowTab =
    (location.state as { tab?: FollowTab } | null)?.tab === "followings"
      ? "followings"
      : "followers";
  const {
    activeTab,
    setActiveTab,
    users,
    followers,
    followings,
    isLoading,
    serverError,
  } = useFollow(initialTab);
  const isFollowings = activeTab === "followings";
  const emptyText = isFollowings ? "Подписок пока нет" : "Подписчиков пока нет";
  const followersCount = profile?.followers_count ?? followers.length;
  const followingsCount = profile?.followings_count ?? followings.length;

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
        <p className="follow-list__page-title">{profile?.username ?? "Профиль"}</p>
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
        <div className="follow-list__state follow-list__state--error">
          {serverError}
        </div>
      )}

      {!isLoading && !serverError && users.length === 0 && (
        <p className="follow-list__empty">{emptyText}</p>
      )}

      {!isLoading && !serverError && users.length > 0 && (
        <ul className="follow-list__items">
          {users.map((user) => {
            const isActive = user.status === "active";

            return (
              <li
                className={`follow-list__item ${
                  isActive ? "" : "follow-list__item--inactive"
                }`.trim()}
                key={user.id}
              >
                <div className="follow-list__avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} />
                  ) : (
                    <span>{getInitial(user.username)}</span>
                  )}
                </div>

                <div className="follow-list__user">
                  <div className="follow-list__user-row">
                    <p className="follow-list__username">{user.username}</p>
                    {!isActive && (
                      <span className="follow-list__status">
                        {getStatusLabel(user.status)}
                      </span>
                    )}
                  </div>
                  <p className="follow-list__name">{user.name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FollowList;
