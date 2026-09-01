import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  typeBtn?: "default" | "primary" | "outline";
  className?: string;
  size?: "small" | "medium" | "large";
}

const IconButton = ({
  children,
  typeBtn = "default",
  className = "",
  size = "medium",
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`icon-btn ${typeBtn} ${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
