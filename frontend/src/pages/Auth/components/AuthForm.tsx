import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_PAGE, LOGIN_PAGE, REGISTRATION_PAGE } from "@/utils/constants";
import Login from "./Login";
import Registration from "./Registration";
import Logo from "@/components/common/Logo";
import MainButton from "@/components/ui/MainButton";
import { useAuth } from "@/hooks/useAuth";
import { type SubmitEvent } from "react";
import Loader from "@/components/ui/Loader";
import { authApi } from "@/services/auth.api";
import type { LoginData, RegisterData } from "@/types/api.types";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname == LOGIN_PAGE;
  const {
    formData,
    updateField,
    getFieldError,
    handleSubmit,
    isLoading,
    getSubmitData,
    serverError,
  } = useAuth(isLogin);
  const onSubmit = async () => {
    const submitData = getSubmitData();
    if (isLogin) {
      const response = await authApi.login(submitData as LoginData);
      console.log(response);
      navigate(ACCOUNT_PAGE);
    } else {
      const response = await authApi.register(submitData as RegisterData);
      console.log(response.data);
      navigate(LOGIN_PAGE);
    }
  };
  const onSumbitForm = (e: SubmitEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };
  return (
    <div className="auth__wrapper">
      <Logo />
      <div className="auth__form">
        <h1 className="text-[28px] font-semibold text-center mb-6">
          {isLogin ? "Логин" : "Регистрация"}
        </h1>
        <form
          className="flex flex-col gap-3 max-w-2xl mx-auto"
          onSubmit={onSumbitForm}
        >
          {isLogin ? (
            <Login
              formData={formData}
              updateField={updateField}
              getFieldError={getFieldError}
            />
          ) : (
            <Registration
              formData={formData}
              updateField={updateField}
              getFieldError={getFieldError}
            />
          )}

          <MainButton
            className="mt-3"
            disabled={isLoading}
            typesBtn="primary-outline"
          >
            {isLoading ? <Loader width={35} /> : "Отправить"}
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
          {serverError && (
            <div className="text-red text-center text-sm">{serverError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
