import type { InputHTMLAttributes } from "react";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const MainInput = ({ className, ...props }: MainInputProps) => {
  return <input className={`${className} text-white border p-3 rounded-2xl border-white`} {...props} />;
};

export default MainInput;
