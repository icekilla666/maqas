import { useNavigate, useSearchParams } from "react-router-dom";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";
import { LOGIN_PAGE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { authApi } from "@/services/auth.api";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"error" | "success" | "loading">(
    "loading",
  );
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const navigate = useNavigate();
  useEffect(() => {
    let navigateTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkedToken = async () => {
      if (!token) {
        setStatus("error");
        setError("Ссылка подтверждения некорректна");
        return;
      }
      try {
        const response = await authApi.verifyEmail(token);
        if (response.success) {
          setStatus("success");
          navigateTimeout = setTimeout(() => {
            navigate(LOGIN_PAGE);
          }, 3000);
        } else {
          setStatus("error");
          setPendingEmail(response.data)
          setError(response.message);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          typeof error.response?.data?.detail.message === "string"
        ) {
          setError(error.response?.data?.detail.message);
        } else {
          setError("Неизвестная ошибка! Попробуйте позже");
        }
        setStatus("error");
      }
    };
    checkedToken();
    return () => {
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [navigate, token, setPendingEmail]);
  return (
    <section className="h-svh flex justify-center items-center px-7">
      {status === "success" && (
        <VerifyEmailWrapper
          title="Регистрация прошла успешно!"
          text={`Ваш email подтверждён.\nПеренаправление на страницу входа...`}
          variant="success"
        />
      )}
      {status === "error" && (
        <VerifyEmailWrapper
          title="Возникла ошибка!"
          text={error}
          button={true}
          variant="error"
          email={pendingEmail!}
        />
      )}
    </section>
  );
};

export default VerifyEmailPage;
