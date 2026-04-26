import { authApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    const initAuth = async () => {
      console.log('start init')
      try {
        console.log('start api')
        const response = await authApi.refreshAccess();
        console.log('qwe');
        console.log(response);
        setUser(true, response.data.access_token);
      } catch {
        setUser(false, null);
      }
    };
    initAuth();
  }, [setUser]);
  return (
    <h1 className="hidden text-6xl uppercase text-center md:block">
      компьютерная версия недоступна, переходи на мобилку лошок
    </h1>
  );
};

export default App;
