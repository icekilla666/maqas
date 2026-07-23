import Layout from "@/components/layout/Layout";
import { useAuthStore } from "@/store/auth.store";
import { LOGIN_PAGE } from "@/utils/constants";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  if (!isAuth) return <Navigate to={LOGIN_PAGE} replace />;

  return <Layout />;
};

export default ProtectedRoute;
