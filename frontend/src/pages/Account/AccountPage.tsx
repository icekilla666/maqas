import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loaders/Loader";
import { Bot, TriangleAlert } from "lucide-react";
import { useMeQuery } from "@/lib/usersQueries";
import SwitchButtons, {
  type SwitchButtonItem,
} from "@/components/ui/Buttons/SwitchButtons";
import { useState } from "react";
import { useMyPostsQuery } from "@/lib/postsQueries";
import PostsList from "@/components/common/Posts/PostsList";
import { useMyLikedQueries } from "@/lib/likesQueries";

type AccountActions = "posts" | "likes";

const AccountPage = () => {
  const { data: profile, isLoading } = useMeQuery();
  const [action, setAction] = useState<AccountActions>("posts");
  const myPosts = useMyPostsQuery();
  const likedPosts = useMyLikedQueries();
  const activePosts = action === "posts" ? myPosts : likedPosts;
  const accountButtons: SwitchButtonItem[] = [
    {
      value: "posts",
      ariaLabel: "мои посты",
      children: "Мои посты",
    },
    {
      value: "likes",
      ariaLabel: "мои лайки",
      children: "Мои лайки",
    },
  ];
  const handleChangeAction = (value: string) => {
    setAction(value as AccountActions);
  };

  if (isLoading) return <Loader />; // в будущем здесь будет skeletonview
  return (
    <section className="wrapper">
      <div className="container">
        {profile ? (
          <div className="flex flex-col gap-3">
            <AccountHeader {...profile} isOwnProfile />

            <SwitchButtons
              value={action}
              onChange={handleChangeAction}
              name="accountActions"
              items={accountButtons}
              className="text-[15px]"
            />

            {/* скелет */}
            {activePosts.isPending ? (
              <Loader />
            ) : activePosts.isError ? (
              <EmptyState
                variant="error"
                text="Не удалось загрузить посты"
                icon={<TriangleAlert />}
              />
            ) : activePosts.data.length ? (
              <PostsList posts={activePosts.data} />
            ) : (
              <EmptyState variant="default" text="Постов нет" icon={<Bot />} />
            )}
          </div>
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

export default AccountPage;
