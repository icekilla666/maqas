import { useState } from "react";
import MainInput from "../../../components/ui/MainInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <MainInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        placeholder="почта"
        type="email"
      />
      <MainInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        placeholder="пароль"
        type="password"
      />
    </>
  );
};
export default Login;
