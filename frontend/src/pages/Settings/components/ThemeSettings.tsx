import SwitchButtons from "@/components/ui/Buttons/SwitchButtons";
import type { SwitchButtonItem } from "@/components/ui/Buttons/SwitchButtons";
import { Moon, Sun } from "lucide-react";
import type { CSSProperties } from "react";

interface ThemeColor {
  value: string;
  label: string;
  color: string;
}

type ThemeColorStyle = CSSProperties & {
  "--theme-color": string;
};

const ThemeSettings = () => {
  const themeButtons: SwitchButtonItem[] = [
    {
      value: "light",
      ariaLabel: "светлая тема",
      children: <Sun size={26} />,
    },
    {
      value: "dark",
      ariaLabel: "темная тема",
      children: <Moon size={26} />,
    },
  ];

  const colors: ThemeColor[] = [
    {
      value: "orange",
      label: "оранжевый",
      color: "var(--color-main)",
    },
    {
      value: "green",
      label: "зеленый",
      color: "#49D82C",
    },
    {
      value: "blue",
      label: "синий",
      color: "#4447FF",
    },
    {
      value: "pink",
      label: "розовый",
      color: "#FF59CA",
    },
    {
      value: "cyan",
      label: "голубой",
      color: "#2BD8DE",
    },
    {
      value: "purple",
      label: "фиолетовый",
      color: "#9B3CDB",
    },
  ];

  return (
    <div className="theme-settings__wrapper">
      <div>
        <p className="mb-2">тема</p>
        <SwitchButtons
          defaultValue="light"
          items={themeButtons}
          name="theme"
          onChange={(value) => console.log(value)}
        />
      </div>
      <div>
        <p className="mb-2">основной цвет</p>
        <div className="theme-colors">
          {colors.map((item) => (
            <label
              className="theme-color"
              key={item.value}
              style={{ "--theme-color": item.color } as ThemeColorStyle}
            >
              <input
                aria-label={item.label}
                className="theme-color__input"
                defaultChecked={item.value === "orange"}
                name="main-color"
                onChange={() => console.log(item.value)}
                type="radio"
                value={item.value}
              />
              <span className="theme-color__swatch" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
