import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export const themeColors = [
  {
    value: "orange",
    label: "оранжевый",
    color: "#ffa64c",
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
] as const;

export type ThemeColorValue = (typeof themeColors)[number]["value"] | "custom";

interface ThemeState {
  theme: ThemeMode;
  selectedColor: ThemeColorValue;
  mainColor: string;
  setTheme: (theme: ThemeMode) => void;
  setPresetColor: (color: Exclude<ThemeColorValue, "custom">) => void;
  setCustomColor: (color: string) => void;
}

interface ThemePreferences {
  theme: ThemeMode;
  mainColor: string;
}

const DEFAULT_MAIN_COLOR = themeColors[0].color;

const applyThemePreferences = ({ theme, mainColor }: ThemePreferences) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty("--color-main", mainColor);
  root.style.colorScheme = theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      selectedColor: "orange",
      mainColor: DEFAULT_MAIN_COLOR,

      setTheme: (theme) => {
        set({ theme });
      },

      setPresetColor: (value) => {
        const selectedColor = themeColors.find((color) => color.value === value);
        if (!selectedColor) return;

        set({
          selectedColor: value,
          mainColor: selectedColor.color,
        });
      },

      setCustomColor: (mainColor) => {
        set({
          selectedColor: "custom",
          mainColor,
        });
      },
    }),
    {
      name: "theme-settings",
      partialize: ({ theme, selectedColor, mainColor }) => ({
        theme,
        selectedColor,
        mainColor,
      }),
    },
  ),
);

export const useApplyTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const mainColor = useThemeStore((state) => state.mainColor);

  useEffect(() => {
    applyThemePreferences({ theme, mainColor });
  }, [theme, mainColor]);
};
