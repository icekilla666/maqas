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

const DesktopNavigation = () => (
  <aside className="desktop-sidebar">
    <Link to={HOME_PAGE} className="desktop-sidebar__brand" aria-label="Maqas — главная">
      <Logo />
    </Link>
    <nav className="desktop-sidebar__nav" aria-label="Основная навигация">
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end={to === HOME_PAGE} title={label} aria-label={label}
          className={({ isActive }) => `desktop-sidebar__link${isActive ? " is-active" : ""}`}>
          <Icon size={24} aria-hidden="true" /><span>{label}</span>
        </NavLink>
      ))}
      <NavLink to={ADD_POSTS_PAGE} title="Создать публикацию" aria-label="Создать публикацию" className="desktop-sidebar__create">
        <Plus size={24} aria-hidden="true" /><span>Создать пост</span>
      </NavLink>
    </nav>
    <p className="desktop-sidebar__caption">Делитесь историями.<br />Находите своих.</p>
  </aside>
);

export default DesktopNavigation;
