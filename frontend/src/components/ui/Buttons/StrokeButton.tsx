import type { ButtonHTMLAttributes, ReactNode } from "react";

interface StrokeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const StrokeButton = ({
  children,
  className = "",
  ...props
}: StrokeButtonProps) => {
  return (
    <button className={`qwe ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default StrokeButton;
