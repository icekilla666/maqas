import AccountSkeleton from "@/components/common/Skeletons/AccountSkeleton";
import { useMeQuery } from "@/lib/usersQueries";
import { ACCOUNT_PAGE } from "@/utils/constants";
import { Navigate, Outlet, useParams } from "react-router-dom";

const UserProfileRedirect = () => {
  const { id } = useParams();
  const { data: profile, isLoading } = useMeQuery();

  if (isLoading) return <AccountSkeleton />;

  if (profile?.id === id) {
    return <Navigate to={ACCOUNT_PAGE} replace />;
  }

  return <Outlet />;
};

export default UserProfileRedirect;
