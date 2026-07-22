import TitlePage from "@/components/common/TitlePage";
import { TriangleAlert } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useMeQuery } from "@/lib/usersQueries";
import Loader from "@/components/ui/Loaders/Loader";
import EditForm from "./components/EditForm";

const EditPage = () => {
  const { data: profile, isLoading } = useMeQuery();
  if (isLoading) return <Loader />; // скелет
  return (
    <section>
      <div className="container">
        <TitlePage title="Редактирование профиля" />
        {profile ? (
          <EditForm profile={profile} />
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

export default EditPage;
