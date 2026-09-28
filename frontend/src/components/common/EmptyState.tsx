import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import MainButton from "@/components/ui/Buttons/MainButton";
import { getApiErrorMessage } from "@/utils/apiError";

interface EmptyStateProps {
  icon: ReactNode;
  text: string;
  variant?: "default" | "error";
  className?: string;
  isError?: boolean;
  onRefetch?: () => void;
  error?: unknown;
}

const EmptyState = ({
  icon,
  text,
  variant = "default",
  className = "",
  isError = false,
  onRefetch,
  error,
}: EmptyStateProps) => {
  const stateVariant = isError ? "error" : variant;

  return (
    <div className={`empty-state empty-state--${stateVariant} ${className}`.trim()}>
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__text">{getApiErrorMessage(error, text)}</p>
      {isError && onRefetch && (
        <MainButton
          type="button"
          size="small"
          align="center"
          icon={<RefreshCw size={16} />}
          onClick={onRefetch}
        >
          Попробовать снова
        </MainButton>
      )}
    </div>
  );
};

export default EmptyState;
