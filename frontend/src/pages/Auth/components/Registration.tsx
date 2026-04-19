import { useState, type SubmitEvent } from "react";
import MainInput from "../../../components/ui/MainInput";
import { authApi } from "../../../services/auth.api";
import { useNavigate } from "react-router-dom";
import { VERIFY_EMAIL_PAGE } from "../../../utils/constants";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const responce = await authApi.register({
        username,
        name,
        email,
        password,
        password_confirm,
      });
      navigate(VERIFY_EMAIL_PAGE);
      console.log(responce);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>регистрация</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 max-w-2xl mx-auto"
      >
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

        <MainInput type="submit" />
      </form>
    </>
  );
};

export default Registration;
