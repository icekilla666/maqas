import verifyWait from "@/assets/images/verify-wait.svg";
import verifySuccess from "@/assets/images/verify-success.svg";
import verifyError from "@/assets/images/verify-error.svg";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";

interface VerifyEmailProps {
  variant: "wait" | "success" | "error";
  className?: string;
  title?: string;
  text?: string;
  button?: string;
  onClick?: () => void;
}

const VerifyEmailWrapper = ({
  variant,
  className = "",
  title,
  text,
  button,
  onClick
}: VerifyEmailProps) => {
  return (
    <div className={`verify-wrapper ${className}`.trim()}>
      {variant === "wait" && <img src={verifyWait} alt={variant} />}
      {variant === "success" && <img src={verifySuccess} alt={variant} />}
      {variant === "error" && <img src={verifyError} alt={variant} />}
      {(title || text) && (
        <div className="flex flex-col text-center gap-1.5">
          <h1 className="text-[16px]">{title}</h1>
          <p className="text-[14px] whitespace-pre-line">{text}</p>
        </div>
      )}
      {button && <StrokeButton onClick={onClick} className="text-[12px]">{button}</StrokeButton>}
    </div>
  );
};

export default VerifyEmailWrapper;
