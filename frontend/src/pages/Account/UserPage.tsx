import { useParams } from "react-router-dom";
import AccountHeader from "./components/AccountHeader";
import { useEffect, useState } from "react";
import type { AccountData } from "@/types/entities";
import Loader from "@/components/ui/Loader";
import { usersApi } from "@/services/users.api";

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<AccountData | null>(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!id) return setError("Пользователь не найден");
        const data = await usersApi.getUser(id);
        setProfile(data);
      } catch (error) {
        console.log(error);
        setError("Не удалось получить доступ к профилю");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);
  if (loading) return <Loader />; // скелет
  return (
    <section>
      <div className="container">
        {profile ? (
          <AccountHeader {...profile} publications={0} lvl="лошок" />
        ) : (
          <h1 className="text-red text-center">{error}</h1>
        )}
      </div>
    </section>
  );
};

export default UserPage;
