import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { LOGIN_PAGE } from "@/utils/constants";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  const profile = useProfileStore((s) => s.profile);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    if (isAuth && !profile) {
      fetchProfile();
    }
  }, [isAuth, profile, fetchProfile]);

  if (!isAuth) return <Navigate to={LOGIN_PAGE} replace />;

  return <Layout />;
};

export default ProtectedRoute;
