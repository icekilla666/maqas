import AccountHeader from "./components/AccountHeader";
import Loader from "@/components/ui/Loader";
import { useProfileStore } from "@/store/profile.store";

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
          <h1 className="text-red text-center">{error}</h1>
        )}
      </div>
    </section>
  );
};

export default AccountPage;
