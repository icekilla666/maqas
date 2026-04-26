import logoLight from "@/assets/images/logo-light.svg";
import logoDark from "@/assets/images/logo-dark.svg";

const Logo = () => {
  return (
    <>
      <img src={logoLight} alt="logo" className="block dark:hidden" />
      <img src={logoDark} alt="logo" className="hidden dark:block" />
    </>
  );
};

export default Logo;
