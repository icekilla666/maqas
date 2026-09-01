import { useId, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

const Textarea = ({
  label,
  hint,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={`ui-textarea ${className}`.trim()}>
      {label && (
        <label className="ui-textarea__label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        className="ui-textarea__field input"
        id={textareaId}
        {...props}
      />
      {(hint || error) && (
        <span
          className={`ui-textarea__hint ${error ? "ui-textarea__hint--error" : ""}`.trim()}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  );
};

export default Textarea;
