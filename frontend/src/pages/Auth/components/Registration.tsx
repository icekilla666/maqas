import MainInput from "../../../components/ui/MainInput";
// import { authApi } from "../../../services/auth.api";

const Registration = () => {
  // const fetchAuth = async () => {
  //   const resp = await authApi.register({
  //     username,
  //     name,
  //     email,
  //     password,
  //     password_confirm,
  //   });
  //   console.log(resp.data)
  // };
  return (
    <>
      <MainInput
        name="username"
        placeholder="имя"
        type="text"
      />
      <MainInput
        name="name"
        placeholder="юзернейм"
        type="text"
      />
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
      <MainInput
        name="password_confirm"
        placeholder="повторите пароль"
        type="password"
      />
    </>
  );
};

export default Registration;
