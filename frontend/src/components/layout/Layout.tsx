import { Outlet, useMatches } from "react-router-dom";
import { Navigation } from "../common/Navigation/Navigation";
import { useAuthStore } from "@/store/auth.store";

type RouteHandle = {
  hideNavigation?: boolean;
};

const Layout = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  const matches = useMatches();
  const currentRoute = matches.at(-1);
  const handle = currentRoute?.handle as RouteHandle | undefined;
  const showNavigation = isAuth && !handle?.hideNavigation;

  return (
    <>
      <main className={showNavigation ? "mb-32" : "mb-0"}>
        <Outlet />
      </main>
      {showNavigation && <Navigation />}
    </>
  );
};

export default Layout;
