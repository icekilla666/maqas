import type { ButtonHTMLAttributes, ReactNode } from "react";

interface StrokeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const StrokeButton = ({
  children,
  className = "",
  icon,
  ...props
}: StrokeButtonProps) => {
  return (
    <button
      className={`${className} flex disabled:text-grey`.trim()}
      {...props}
      style={{ ...(icon ? { gap: "8px" } : {}) }}
    >
      {icon}
      {children}
    </button>
  );
};

export default StrokeButton;
