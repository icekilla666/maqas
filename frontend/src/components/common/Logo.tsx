import logoLight from "@/assets/images/logo-light.svg";
import logoDark from "@/assets/images/logo-dark.svg";
import { useThemeStore } from "@/store/theme.store";

const Logo = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <img
      src={theme === "dark" ? logoDark : logoLight}
      alt="maqas"
      className="block"
    />
  );
};

export default Logo;
