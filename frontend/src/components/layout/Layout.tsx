import { matchPath, Outlet, useLocation } from "react-router-dom";
import { Navigation } from "../common/Navigation/Navigation";
import { useAuthStore } from "@/store/auth.store";
import { POST_DETAIL } from "@/utils/constants";

const Layout = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  const { pathname } = useLocation();
  const isPostDetailPage = Boolean(matchPath(POST_DETAIL, pathname));
  const showNavigation = isAuth && !isPostDetailPage;
  const mainClassName = [
    showNavigation ? "mb-32" : "mb-0",
    isPostDetailPage ? "main--post-detail" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <main className={mainClassName}>
        <Outlet />
      </main>
      {showNavigation && <Navigation />}
    </>
  );
};

export default Layout;
