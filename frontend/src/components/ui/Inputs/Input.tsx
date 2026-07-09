import { PenLine } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "readOnly" | "value"
> {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  showEditButton?: boolean;
  editButton?: ReactNode;
  className?: string;
}

const Input = ({
  label,
  value,
  onChange,
  showEditButton = true,
  editButton,
  className = "",
  onBlur,
  disabled,
  ...props
}: InputProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange?.(event.target.value);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    onBlur?.(event);
  };

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className={`ui-input ${className}`.trim()}>
      <div
        className={`ui-input__row ${isEditing ? "active" : ""}`.trim()}
      >
        <div className="ui-input__content">
          <label className="ui-input__label" htmlFor={inputId}>
            {label}
          </label>
          <input
            className="ui-input__field"
            disabled={disabled}
            id={inputId}
            onBlur={handleBlur}
            onChange={handleChange}
            readOnly={!isEditing}
            ref={inputRef}
            value={inputValue}
            {...props}
          />
        </div>
        {showEditButton && (
          <button
            aria-label={`изменить ${label}`}
            className={`ui-input__edit ${isEditing ? "active" : ""}`.trim()}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleEdit}
            type="button"
          >
            {editButton ?? <PenLine size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
