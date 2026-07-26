import { useParams } from "react-router-dom";
import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loaders/Loader";
import { TriangleAlert } from "lucide-react";
import UserActions from "./components/UserActions";
import BlockedAccountHeader from "./components/BlockedAccountHeader";
import { useFollowMutation, useUserQuery } from "@/lib/usersQueries";
import { useEffect, useRef, useState } from "react";
import { useUserPostsQuery } from "@/lib/postsQueries";
import PostsList from "@/components/common/Posts/PostsList";

const UserPage = () => {
  const { id } = useParams();
  const { isLoading, data: profile } = useUserQuery(id);
  const toggleFollowMutation = useFollowMutation();
  const [isFollowLocked, setIsFollowLocked] = useState(false);
  const followLockRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFollowDisabled = isFollowLocked || toggleFollowMutation.isPending;
  const { data: posts = [], isPending } = useUserPostsQuery(id);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const handleFollow = () => {
    if (!profile || followLockRef.current) return;

    followLockRef.current = true;
    setIsFollowLocked(true);

    toggleFollowMutation.mutate(
      {
        userId: profile.id,
        isFollowing: profile.is_following,
      },
      {
        onSettled: () => {
          unlockTimerRef.current = setTimeout(() => {
            followLockRef.current = false;
            setIsFollowLocked(false);
          }, 500);
        },
      },
    );
  };
  if (isLoading) return <Loader />; // скелет
  return (
    <section>
      <div className="container">
        {profile ? (
          profile.is_blocked ? (
            <BlockedAccountHeader {...profile} />
          ) : (
            <div className="flex flex-col gap-5">
              <AccountHeader {...profile} isOwnProfile={false} />

              <UserActions
                profile={profile}
                onFollow={handleFollow}
                isFollowDisabled={isFollowDisabled}
              />
              {isPending && <Loader />}

              {posts ? (
                <PostsList count={posts.length} posts={posts} />
              ) : (
                <h1>постов нет</h1>
              )}
            </div>
          )
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={"Не удалось загрузить профиль"}
            variant="error"
          />
        )}
      </div>
    </section>
  );
};

export default UserPage;
