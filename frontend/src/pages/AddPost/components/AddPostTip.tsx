import { Sparkles } from "lucide-react";

const AddPostTip = () => {
  return (
    <div className="add-post-tip">
      <span className="add-post-tip__icon" aria-hidden="true">
        <Sparkles size={19} />
      </span>
      <div>
        <h3>Хороший пост легко читать</h3>
        <p>
          Добавьте понятный заголовок, разбейте текст на абзацы и выберите
          только подходящие темы.
        </p>
      </div>
    </div>
  );
};

export default AddPostTip;
