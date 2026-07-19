import MainButton from "@/components/ui/Buttons/MainButton";
import AccountHeader from "./components/AccountHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loader";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "@/lib/usersQueries";

const AccountPage = () => {
  const { isLoading, data: profile } = useMeQuery();
  const navigate = useNavigate();

  if (isLoading) return <Loader />; // в будущем здесь будет skeletonview
  return (
    <section>
      <div className="container">
        {profile ? (
          <>
            <AccountHeader {...profile} isOwnProfile />
            <MainButton
              className="mt-7"
              onClick={() => navigate("/f6e8cf88-6829-4ef2-b09b-9fe2a3059e1e")}
            >
              go
            </MainButton>
          </>
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={"Не удалось загрузить профиль"}
            variant="error"
          />
        )}
      </div>
    </section>
  );
};

export default AccountPage;
