import { useNavigate, useSearchParams } from "react-router-dom";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";
import { LOGIN_PAGE } from "@/utils/constants";
import { useEffect } from "react";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const navigateTimeout = setTimeout(() => {
        navigate(LOGIN_PAGE);
      }, 3000);
      return () => clearTimeout(navigateTimeout);
    }
  }, [navigate, token]);
  return (
    <section className="h-svh flex justify-center items-center px-7">
      {token ? (
        <VerifyEmailWrapper
          title="Регистрация прошла успешно!"
          text={`Ваш email подтверждён.\nПеренаправление на страницу входа...`}
          variant="success"
        />
      ) : (
        <VerifyEmailWrapper
          title="Ссылка недействительна"
          text="Повторите попытку регистрации"
          button="отправить сообщение повторно"
          variant="error"
        />
      )}
    </section>
  );
};

export default VerifyEmailPage;