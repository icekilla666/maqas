import type { CSSProperties, ReactNode } from "react";

export interface SwitchButtonItem {
  value: string;
  children: ReactNode;
  ariaLabel?: string;
}

interface SwitchButtonsProps {
  name: string;
  items: SwitchButtonItem[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
}

type SwitchButtonsStyle = CSSProperties & {
  "--switch-items": number;
};

const SwitchButtons = ({
  name,
  items,
  defaultValue,
  className = "",
  onChange,
}: SwitchButtonsProps) => {
  if (!items.length) return null;

  const activeValue = defaultValue ?? items[0].value;
  const switchStyle: SwitchButtonsStyle = {
    "--switch-items": items.length,
  };

  return (
    <div
      className={`switch-buttons__wrapper ${className}`.trim()}
      style={switchStyle}
    >
      <span className="switch-buttons__indicator" />
      {items.map((item) => (
        <label className="switch-buttons__item" key={item.value}>
          <input
            aria-label={item.ariaLabel ?? item.value}
            className="switch-buttons__input"
            defaultChecked={item.value === activeValue}
            name={name}
            onChange={() => onChange?.(item.value)}
            type="radio"
            value={item.value}
          />
          <span className="switch-buttons__button">{item.children}</span>
        </label>
      ))}
    </div>
  );
};

export default SwitchButtons;
