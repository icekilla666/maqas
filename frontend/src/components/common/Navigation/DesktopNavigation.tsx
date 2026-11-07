import { useNavigationScroll } from "@/hooks/useNavigationScroll";
import { House, MessageCircle, Plus, Settings, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ACCOUNT_PAGE, ADD_POSTS_PAGE, CHATS_PAGE, HOME_PAGE, SETTINGS_PAGE } from "@/utils/constants";
import Logo from "@/components/common/Logo";

const items = [
  { to: HOME_PAGE, label: "Лента", Icon: House },
  { to: CHATS_PAGE, label: "Сообщения", Icon: MessageCircle },
  { to: ACCOUNT_PAGE, label: "Мой профиль", Icon: UserRound },
  { to: SETTINGS_PAGE, label: "Настройки", Icon: Settings },
];

const DesktopNavigation = ({ hasUnread = false }: { hasUnread?: boolean }) => {
  const handleNavigationClick = useNavigationScroll();
  return (
  <aside className="desktop-sidebar">
    <Link to={HOME_PAGE} onClick={(event) => handleNavigationClick(event, HOME_PAGE)} className="desktop-sidebar__brand" aria-label="Maqas — главная">
      <Logo />
    </Link>
    <nav className="desktop-sidebar__nav" aria-label="Основная навигация">
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} onClick={(event) => handleNavigationClick(event, to)} end={to === HOME_PAGE} title={label} aria-label={to === CHATS_PAGE && hasUnread ? `${label}: есть непрочитанные сообщения` : label}
          className={({ isActive }) => `desktop-sidebar__link${isActive ? " is-active" : ""}`}>
          <span className="navigation-icon">
            <Icon size={24} aria-hidden="true" />
            {to === CHATS_PAGE && hasUnread && <span className="navigation-unread-dot" aria-hidden="true" />}
          </span>
          <span className="desktop-sidebar__label">{label}</span>
        </NavLink>
      ))}
      <NavLink to={ADD_POSTS_PAGE} title="Создать публикацию" aria-label="Создать публикацию" className="desktop-sidebar__create">
        <Plus size={24} aria-hidden="true" /><span>Создать пост</span>
      </NavLink>
    </nav>
  </aside>
  );
};

export default DesktopNavigation;
