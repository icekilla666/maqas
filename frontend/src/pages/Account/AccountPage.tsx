import AccountHeader from "./components/AccountHeader";
import Loader from "@/components/ui/Loader";
import { useProfileStore } from "@/store/profile.store";
import { useEffect } from "react";

const AccountPage = () => {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const error = useProfileStore((state) => state.error);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) return <Loader />; // в будущем здесь будет skeletonview
  return (
    <section>
      <div className="container">
        {profile ? (
          <AccountHeader {...profile} publications={0} lvl="лошок" />
        ) : (
          <h1 className="text-red text-center">{error}</h1>
        )}
      </div>
    </section>
  );
};

export default AccountPage;
