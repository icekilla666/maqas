import type { InputHTMLAttributes } from "react";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const MainInput = ({ className = "", ...props }: MainInputProps) => {
  return (
    <input
      className={`${className} input rounded-[30px] p-4.5 border border-grey`.trim()}
      {...props}
    />
  );
};

export default MainInput;
