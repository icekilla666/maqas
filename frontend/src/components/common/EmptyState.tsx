import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  text: string;
  variant?: "default" | "error";
  className?: string;
}

const EmptyState = ({
  icon,
  text,
  variant = "default",
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`empty-state empty-state--${variant} ${className}`.trim()}>
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__text">{text}</p>
    </div>
  );
};

export default EmptyState;
