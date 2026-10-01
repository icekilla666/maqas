import { useNavigate, useSearchParams } from "react-router-dom";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";
import { HOME_PAGE, LOGIN_PAGE } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { authApi } from "@/services/auth.api";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAuthStore } from "@/store/auth.store";
import Loader from "@/components/ui/Loaders/Loader";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"error" | "success" | "loading">(
    "loading",
  );
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const requestRef = useRef<{ token: string; promise: ReturnType<typeof authApi.verifyEmail> } | null>(null);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  useEffect(() => {
    let active = true;
    let navigateTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkedToken = async () => {
      setStatus("loading");
      if (!token) {
        setStatus("error");
        setError("Ссылка подтверждения некорректна");
        return;
      }
      try {
        // Повторный запуск эффекта в StrictMode использует тот же запрос.
        if (requestRef.current?.token !== token) {
          requestRef.current = { token, promise: authApi.verifyEmail(token) };
        }
        const response = await requestRef.current.promise;
        if (!active) return;
        if (response.success) {
          setStatus("success");
          setPendingEmail(null);
          navigateTimeout = setTimeout(() => {
            navigate(useAuthStore.getState().isAuth ? HOME_PAGE : LOGIN_PAGE, { replace: true });
          }, 3000);
        } else {
          setStatus("error");
          if (typeof response.data === "string") setPendingEmail(response.data);
          setError(response.message);
        }
      } catch (error) {
        if (!active) return;
        setError(getApiErrorMessage(error, "Неизвестная ошибка! Попробуйте позже"));
        setStatus("error");
      }
    };
    checkedToken();
    return () => {
      active = false;
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [token, setPendingEmail, navigate]);
  return (
    <section className="h-svh flex justify-center items-center px-7">
      {status === "loading" && <Loader />}
      {status === "success" && (
        <VerifyEmailWrapper
          title="Регистрация прошла успешно!"
          text={`Ваш email подтверждён.\n${isAuth ? "Перенаправление на главную..." : "Перенаправление на страницу входа..."}`}
          variant="success"
        />
      )}
      {status === "error" && (
        <VerifyEmailWrapper
          title="Возникла ошибка!"
          text={error}
          button={true}
          variant="error"
          email={pendingEmail ?? undefined}
        />
      )}
    </section>
  );
};

export default VerifyEmailPage;
