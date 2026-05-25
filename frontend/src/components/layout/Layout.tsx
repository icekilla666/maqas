import { Outlet } from "react-router-dom";
import { Navigation } from "../common/navigation/Navigation";
import { useAuthStore } from "@/store/auth.store";

const Layout = () => {
  const isAuth = useAuthStore((s) => s.isAuth);
  return (
    <>
      <main>
        <Outlet />
      </main>
      {isAuth && <Navigation />}
    </>
  );
};

export default Layout;
