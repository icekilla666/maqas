import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  typesBtn?:
    | "default"
    | "primary"
    | "default-outline"
    | "primary-outline"
    | "list";
  children: ReactNode;
  size?: "small" | "medium" | "large";
  align?: "left" | "center" | "right";
  icon?: ReactNode;
}

const MainButton = ({
  className = "",
  typesBtn = "default",
  size = "medium",
  align = "left",
  children,
  icon,
  ...props
}: MainButtonProps) => {
  return (
    <button
      className={`btn ${typesBtn} ${size} ${className}`.trim()}
      style={{ justifyContent: align, ...(icon ? {gap: "8px"} : {}) }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default MainButton;
