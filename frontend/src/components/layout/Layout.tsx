import { Outlet, ScrollRestoration, useMatches } from "react-router-dom";
import { Navigation } from "../common/Navigation/Navigation";
import { useAuthStore } from "@/store/auth.store";
import InstallAppPrompt from "../common/InstallAppPrompt";

import { useMediaQuery } from "@/hooks/useMediaQuery";

type RouteHandle = {
  hideNavigation?: boolean;
};

const Layout = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  const matches = useMatches();
  const currentRoute = matches.at(-1);
  const handle = currentRoute?.handle as RouteHandle | undefined;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showNavigation = isAuth && (isDesktop || !handle?.hideNavigation);

  return (
    <div className={isAuth ? "app-layout app-layout--authenticated" : "app-layout"}>
      <main id="main-content" className={`app-main ${showNavigation ? "mb-32" : "mb-0"}`}>
        <Outlet />
      </main>
      {showNavigation && <Navigation />}
      {isAuth && <InstallAppPrompt />}
      <ScrollRestoration />
    </div>
  );
};

export default Layout;
