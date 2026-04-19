import { NavLink } from "react-router-dom";
import {
  ACCOUNT_PAGE,
  CHATS_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  SETTINGS_PAGE,
} from "../../utils/constants";

const Header = () => {
  return (
    <header className="w-full py-4 hidden justify-center gap-5 text-second md:flex">
      <NavLink to={HOME_PAGE}>Домой, Уолтер</NavLink>
      <NavLink to={ACCOUNT_PAGE}>Аккаунт</NavLink>
      <NavLink to={CHATS_PAGE}>Чаты</NavLink>
      <NavLink to={SETTINGS_PAGE}>Настройки</NavLink>
      <NavLink to={LOGIN_PAGE}>Вход</NavLink>
      <NavLink to={REGISTRATION_PAGE}>Регистрация</NavLink>
    </header>
  );
};

export default Header;
