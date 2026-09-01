import { FilePenLine } from "lucide-react";

const AddPostEditorHeader = () => {
  return (
    <header className="add-post-editor__header">
      <span className="add-post-editor__icon" aria-hidden="true">
        <FilePenLine size={22} />
      </span>
      <div>
        <h2>Расскажите что-нибудь интересное</h2>
        <p>Оформите мысль, добавьте темы и изображение</p>
      </div>
    </header>
  );
};

export default AddPostEditorHeader;
