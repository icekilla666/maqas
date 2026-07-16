import { useParams } from "react-router-dom";
import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import { useEffect, useState } from "react";
import type { UserData } from "@/types/entities";
import Loader from "@/components/ui/Loader";
import { usersApi } from "@/services/users.api";
import { TriangleAlert } from "lucide-react";
import { useProfileStore } from "@/store/profile.store";
import UserActions from "./components/UserActions";
import BlockedAccountHeader from "./components/BlockedAccountHeader";

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserData | null>(null);
  const changeFollowingsCount = useProfileStore(
    (state) => state.changeFollowingsCount,
  );
  const { id } = useParams();
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!id) return setError("Пользователь не найден");
        const data = await usersApi.getUser(id);
        setProfile(data);
      } catch (error) {
        console.log(error);
        setError("Не удалось получить доступ к профилю");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);
  // console.log(profile);

  const handleFollow = async () => {
    if (!profile) return;
    const isFollowing = profile.is_following;

    try {
      if (isFollowing) {
        await usersApi.unfollowUser(profile.id);
      } else {
        await usersApi.followUser(profile.id);
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              is_following: !isFollowing,
              followers_count: Math.max(
                0,
                prev.followers_count + (isFollowing ? -1 : 1),
              ),
            }
          : prev,
      );
      changeFollowingsCount(isFollowing ? -1 : 1);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Loader />; // скелет
  return (
    <section>
      <div className="container">
        {profile ? (
          profile.is_blocked ? (
            <BlockedAccountHeader {...profile} />
          ) : (
            <>
              <AccountHeader {...profile} isOwnProfile={false} />
              <UserActions profile={profile} onFollow={handleFollow} />
            </>
          )
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={error || "Не удалось загрузить профиль"}
            variant="error"
          />
        )}
      </div>
    </section>
  );
};

export default UserPage;
