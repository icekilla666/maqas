import verifyWait from "@/assets/images/verify-wait.svg";
import verifySuccess from "@/assets/images/verify-success.svg";
import verifyError from "@/assets/images/verify-error.svg";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import { authApi } from "@/services/auth.api";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

interface VerifyEmailProps {
  variant: "wait" | "success" | "error";
  className?: string;
  title?: string;
  text?: string;
  button?: boolean;
  email?: string;
}

const VerifyEmailWrapper = ({
  variant,
  className = "",
  title,
  text,
  button,
  email,
}: VerifyEmailProps) => {
  const [message, setMessage] = useState(text);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResend = async (email: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await authApi.resendEmail(email);
      setMessage(response.message);
      setCooldown(60);
    } catch {
      setMessage("Что-то пошло не так. Попробуйте позже");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`verify-wrapper ${className}`.trim()}>
      {variant === "wait" && <img src={verifyWait} alt={variant} />}
      {variant === "success" && <img src={verifySuccess} alt={variant} />}
      {variant === "error" && <img src={verifyError} alt={variant} />}
      {(title || text) && (
        <div className="flex flex-col text-center gap-1.5">
          <h1 className="text-[16px]">{title}</h1>
          <p className="text-[14px] whitespace-pre-line">{message}</p>
        </div>
      )}
      {button && email && (
        <StrokeButton
          onClick={() => handleResend(email)}
          className="text-[12px]"
          disabled={cooldown > 0}
        >
          {loading ? <Loader width={18} /> : cooldown > 0 ? `отправить повторно через ${cooldown}` : "отправить сообщение повторно"}
        </StrokeButton>
      )}
    </div>
  );
};

export default VerifyEmailWrapper;
