import {
  ACCOUNT_PAGE,
  CHATS_PAGE,
  HOME_PAGE,
  SETTINGS_PAGE,
} from "@/utils/constants";
import { House, MessageCircle, Settings, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileNavigation = () => {
  const navs = [
    {
      to: HOME_PAGE,
      icon: <House />,
    },
    {
      to: CHATS_PAGE,
      icon: <MessageCircle />,
    },
    {
      to: ACCOUNT_PAGE,
      icon: <UserRound />,
    },
    {
      to: SETTINGS_PAGE,
      icon: <Settings />,
    },
  ];
  return (
    <div className="container fixed bottom-6 flex justify-center items-center">
      <nav className="mobile-nav">
        {navs.map((nav) => (
          <NavLink
            key={nav.to}
            to={nav.to}
            className={({ isActive }) =>
              isActive ? "nav__wrapper active" : "nav__wrapper"
            }
          >
            {nav.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
