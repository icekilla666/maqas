import type { InputHTMLAttributes } from "react";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

const MainInput = ({ className = "", error, ...props }: MainInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={`${className} input rounded-[30px] p-4.5 border border-grey`.trim()}
        {...props}
      />
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};

export default MainInput;
