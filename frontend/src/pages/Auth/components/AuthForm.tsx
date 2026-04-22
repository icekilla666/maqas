import { NavLink, useLocation } from "react-router-dom";
import { LOGIN_PAGE, REGISTRATION_PAGE } from "../../../utils/constants";
import Login from "./Login";
import Registration from "./Registration";
import Logo from "../../../components/common/Logo";
import MainButton from "../../../components/ui/MainButton";

const AuthForm = () => {
  const location = useLocation();
  const isLogin = location.pathname == LOGIN_PAGE;
  return (
    <div className="auth__wrapper">
      <Logo />
      <div className="auth__form">
        <h1 className="text-[28px] font-semibold text-center mb-6">
          {isLogin ? "Логин" : "Регистрация"}
        </h1>
        <form className="flex flex-col gap-3 max-w-2xl mx-auto">
          {isLogin ? <Login /> : <Registration />}

          <MainButton className="mt-3" typesBtn="primary-outline">
            Отправить
          </MainButton>

          <p className="text-center font-light mt-1 text-[14px]">
            {isLogin ? "нет аккаунта? " : "уже есть аккаунт?  "}
            <NavLink
              className="font-medium"
              to={isLogin ? REGISTRATION_PAGE : LOGIN_PAGE}
            >
              {isLogin ? "зарегистрироваться" : "войти"}
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
