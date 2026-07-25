import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loaders/Loader";
import { TriangleAlert } from "lucide-react";
import { useMeQuery } from "@/lib/usersQueries";
import SwitchButtons, {
  type SwitchButtonItem,
} from "@/components/ui/Buttons/SwitchButtons";
import { useState } from "react";
import { useMyPostsQuery } from "@/lib/postsQueries";
import PostsList from "@/components/common/Posts/PostsList";

type AccountActions = "posts" | "likes";

const AccountPage = () => {
  const { data: profile, isLoading } = useMeQuery();
  const [action, setAction] = useState<AccountActions>("posts");
  const { data: posts = [], isPending } = useMyPostsQuery();
  console.log(posts)
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
    <section>
      <div className="container">
        {profile ? (
          <>
            <AccountHeader {...profile} isOwnProfile />
            <div className="flex flex-col gap-3">
              <SwitchButtons
                value={action}
                onChange={handleChangeAction}
                name="accountActions"
                items={accountButtons}
              />
              {/* скелет */}
              {isPending && <Loader />}
              {posts ? <PostsList posts={posts} /> : <h1>постов нет</h1>}
            </div>
          </>
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
