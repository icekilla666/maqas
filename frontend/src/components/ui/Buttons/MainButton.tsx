import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  typesBtn?: "default" | "primary" | "default-outline" | "primary-outline" | "list";
  children: ReactNode;
}

const MainButton = ({
  className = "",
  typesBtn = "default",
  children,
  ...props
}: MainButtonProps) => {
  return (
    <button className={`btn ${typesBtn} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default MainButton;
