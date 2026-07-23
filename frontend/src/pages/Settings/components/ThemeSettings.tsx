import SwitchButtons from "@/components/ui/Buttons/SwitchButtons";
import type { SwitchButtonItem } from "@/components/ui/Buttons/SwitchButtons";
import {
  themeColors,
  useThemeStore,
  type ThemeMode,
  type ThemeColorValue,
} from "@/store/theme.store";
import { Moon, Sun } from "lucide-react";
import type { CSSProperties } from "react";

type ThemeColorStyle = CSSProperties & {
  "--theme-color": string;
};

const ThemeSettings = () => {
  const theme = useThemeStore((state) => state.theme);
  const selectedColor = useThemeStore((state) => state.selectedColor);
  const mainColor = useThemeStore((state) => state.mainColor);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setPresetColor = useThemeStore((state) => state.setPresetColor);
  const setCustomColor = useThemeStore((state) => state.setCustomColor);

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

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeMode);
  };

  const handleColorChange = (value: ThemeColorValue) => {
    if (value === "custom") return;
    setPresetColor(value);
  };

  return (
    <div className="theme-settings__wrapper">
      <div>
        <p className="mb-2">тема</p>
        <SwitchButtons
          items={themeButtons}
          name="theme"
          onChange={handleThemeChange}
          value={theme}
        />
      </div>
      <div>
        <p className="mb-2">основной цвет</p>
        <div className="theme-colors">
          {themeColors.map((item) => (
            <label
              className={`theme-color ${
                selectedColor === item.value ? "active" : ""
              }`.trim()}
              key={item.value}
              style={{ "--theme-color": item.color } as ThemeColorStyle}
            >
              <input
                aria-label={item.label}
                checked={selectedColor === item.value}
                className="theme-color__input"
                name="main-color"
                onChange={() => handleColorChange(item.value)}
                type="radio"
                value={item.value}
              />
              <span className="theme-color__swatch" />
            </label>
          ))}
          <label
            className={`theme-color ${
              selectedColor === "custom" ? "active" : ""
            }`.trim()}
            style={{ "--theme-color": mainColor } as ThemeColorStyle}
          >
            <input
              aria-label="свой цвет"
              className="theme-color__input"
              onChange={(event) => setCustomColor(event.target.value)}
              type="color"
              value={mainColor}
            />
            <span className="theme-color__swatch theme-color__swatch--custom" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
