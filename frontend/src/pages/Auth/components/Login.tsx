import MainInput from "../../../components/ui/MainInput";

const Login = () => {
  return (
    <>
      <MainInput
        name="email"
        placeholder="почта"
        type="email"
      />
      <MainInput
        name="password"
        placeholder="пароль"
        type="password"
      />
    </>
  );
};
export default Login;
