import {
  ACCOUNT_PAGE,
  ADD_POSTS_PAGE,
  CHATS_PAGE,
  HOME_PAGE,
  SETTINGS_PAGE,
} from "@/utils/constants";
import { House, MessageCircle, Plus, Settings, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileNavigation = () => {
  const navs = [
    {
      label: "Главная",
      to: HOME_PAGE,
      icon: <House />,
    },
    {
      label: "Чаты",
      to: CHATS_PAGE,
      icon: <MessageCircle />,
    },
    {
      label: "Добавить публикацию",
      to: ADD_POSTS_PAGE,
      icon: <Plus />,
      isAddPost: true,
    },
    {
      label: "Профиль",
      to: ACCOUNT_PAGE,
      icon: <UserRound />,
    },
    {
      label: "Настройки",
      to: SETTINGS_PAGE,
      icon: <Settings />,
    },
  ];
  return (
    <div className="mobile-nav-container">
      <nav className="mobile-nav" aria-label="Основная навигация">
        {navs.map((nav) => (
          <NavLink
            key={nav.label}
            to={nav.to}
            aria-label={nav.label}
            className={({ isActive }) => {
              if (nav.isAddPost) {
                return "nav__wrapper nav__wrapper--add-post";
              }

              return isActive ? "nav__wrapper active" : "nav__wrapper";
            }}
          >
            {nav.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
