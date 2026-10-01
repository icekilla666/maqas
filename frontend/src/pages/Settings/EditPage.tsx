import TitlePage from "@/components/common/TitlePage";
import { TriangleAlert } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useMeQuery } from "@/lib/usersQueries";
import EditProfileSkeleton from "@/components/common/Skeletons/EditProfileSkeleton";
import EditForm from "./components/EditForm";

const EditPage = () => {
  const { data: profile, isLoading, error } = useMeQuery();
  return (
    <section className="wrapper">
      <div className="container">
        <TitlePage title="Редактирование профиля" />
        {isLoading ? (
          <EditProfileSkeleton />
        ) : profile ? (
          <EditForm profile={profile} />
        ) : (
          <EmptyState
            icon={<TriangleAlert />}
            text={"Не удалось загрузить профиль"}
            error={error}
            variant="error"
          />
        )}
      </div>
    </section>
  );
};

export default EditPage;
