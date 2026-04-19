import type { ButtonHTMLAttributes, ReactNode } from "react";

interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  typesBtn: "default" | "primary" | "default-outline" | "primary-outline";
  children: ReactNode;
}

const MainButton = ({
  className = "",
  typesBtn,
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
