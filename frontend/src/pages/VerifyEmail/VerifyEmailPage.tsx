import { useNavigate, useSearchParams } from "react-router-dom";
import VerifyEmailWrapper from "./components/VerifyEmailWrapper";
import { LOGIN_PAGE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { authApi } from "@/services/auth.api";
import axios from "axios";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;

    const checkedToken = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.detail ||
              "Неизвестная ошибка! Попробуйте позже",
          );
        } else {
          setError("Неизвестная ошибка! Попробуйте позже");
        }
        setStatus("error");
      }
    };
    checkedToken();
    const navigateTimeout = setTimeout(() => {
      navigate(LOGIN_PAGE);
    }, 3000);
    return () => clearTimeout(navigateTimeout);
  }, [navigate, token]);
  console.log(error);
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
          text={"error"}
          button="отправить сообщение повторно"
          variant="error"
        />
      )}
    </section>
  );
};

export default VerifyEmailPage;
