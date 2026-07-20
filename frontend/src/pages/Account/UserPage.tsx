import { useParams } from "react-router-dom";
import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";
import { TriangleAlert } from "lucide-react";
import UserActions from "./components/UserActions";
import BlockedAccountHeader from "./components/BlockedAccountHeader";
import { useUserQuery } from "@/lib/usersQueries";

const UserPage = () => {
  const { id } = useParams();
  const { isLoading, data: profile } = useUserQuery(id);

  if (isLoading) return <Loader />; // скелет
  return (
    <section>
      <div className="container">
        {profile ? (
          profile.is_blocked ? (
            <BlockedAccountHeader {...profile} />
          ) : (
            <>
              <AccountHeader {...profile} isOwnProfile={false} />
              <UserActions
                profile={profile}
                onFollow={() => console.log("q")}
              />
            </>
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
