import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import { Bookmark, Send } from "lucide-react";

const AddPostAction = () => {
  return (
    <div className="add-post-actions">
      <MainButton
        align="center"
        className="add-post-actions__publish"
        icon={<Send size={18} />}
        type="button"
        typesBtn="primary"
      >
        Опубликовать
      </MainButton>
      <StrokeButton
        className="add-post-actions__draft"
        icon={<Bookmark size={18} />}
        type="button"
      >
        Сохранить черновик
      </StrokeButton>
      <p>
        Публикуя запись, вы подтверждаете, что она соответствует правилам
        сообщества.
      </p>
    </div>
  );
};

export default AddPostAction;
