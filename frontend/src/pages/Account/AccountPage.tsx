import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";
import { useProfileStore } from "@/store/profile.store";
import { TriangleAlert } from "lucide-react";

const AccountPage = () => {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const error = useProfileStore((state) => state.error);

  if (isLoading) return <Loader />; // в будущем здесь будет skeletonview
  return (
    <section>
      <div className="container">
        {profile ? (
          <AccountHeader {...profile} />
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={error ?? "Не удалось загрузить профиль"}
            variant="error"
          />
        )}
      </div>
    </section>
  );
};

export default AccountPage;
