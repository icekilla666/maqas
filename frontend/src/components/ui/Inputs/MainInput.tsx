import type { InputHTMLAttributes } from "react";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  hint?: string;
}

const MainInput = ({
  className = "",
  error,
  hint,
  ...props
}: MainInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={`${className} input rounded-[30px] p-4.5 border border-grey`.trim()}
        {...props}
      />
      {error || hint ? (
        <span className={`input__hint ${error ? "input__hint--error" : ""}`.trim()}>
          {error || hint}
        </span>
      ) : null}
    </div>
  );
};

export default MainInput;
