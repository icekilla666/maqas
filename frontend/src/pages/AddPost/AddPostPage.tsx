import TitlePage from "@/components/common/TitlePage";
import AddPostLayout from "./components/AddPostLayout";

const AddPostPage = () => {
  return (
    <section className="add-post-page">
      <div className="container">
        <TitlePage title="Новая публикация" />

        <AddPostLayout />
      </div>
    </section>
  );
};

export default AddPostPage;
