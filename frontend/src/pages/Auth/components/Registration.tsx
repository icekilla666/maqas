import { useState } from "react";
import MainInput from "../../../components/ui/MainInput";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  return (
    <>
      <MainInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="username"
        placeholder="имя"
        type="text"
      />
      <MainInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        placeholder="юзернейм"
        type="text"
      />
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
      <MainInput
        value={password_confirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        name="password_confirm"
        placeholder="повторите пароль"
        type="password"
      />
    </>
  );
};

export default Registration;
