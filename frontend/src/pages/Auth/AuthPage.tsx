import { useAuthStore } from "../../store/authStore";
import Login from "./components/Login";
import Registration from "./components/Registration";

const AuthPage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <>
    {user ? <Login /> : <Registration />};
    </>
  )
};

export default AuthPage;