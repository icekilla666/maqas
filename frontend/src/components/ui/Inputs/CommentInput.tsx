import { SendHorizontal } from "lucide-react";
import {
  type FormEvent,
  type TextareaHTMLAttributes,
  useId,
} from "react";

interface CommentInputProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "onSubmit" | "value"
  > {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  submitLabel?: string;
  className?: string;
}

const CommentInput = ({
  value,
  onChange,
  onSubmit,
  submitLabel = "Отправить",
  className = "",
  disabled,
  placeholder = "Написать комментарий",
  ...props
}: CommentInputProps) => {
  const inputId = useId();
  const trimmedValue = value.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedValue || disabled) return;

    onSubmit(trimmedValue);
  };

  return (
    <form className={`comment-input ${className}`.trim()} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Комментарий
      </label>
      <textarea
        className="comment-input__field input"
        disabled={disabled}
        id={inputId}
        maxLength={1000}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={1}
        value={value}
        {...props}
      />
      <button
        aria-label={submitLabel}
        className="comment-input__submit"
        disabled={!trimmedValue || disabled}
        type="submit"
      >
        <SendHorizontal size={18} />
      </button>
    </form>
  );
};

export default CommentInput;
