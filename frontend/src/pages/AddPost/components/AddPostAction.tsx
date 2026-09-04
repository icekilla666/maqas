import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import { Bookmark, Send } from "lucide-react";

const AddPostAction = ({ handleDraft }: { handleDraft: () => void }) => {
  return (
    <div className="add-post-actions">
      <MainButton
        align="center"
        className="add-post-actions__publish"
        icon={<Send size={18} />}
        type="submit"
        typesBtn="primary"
        form="add-post-form"
      >
        Опубликовать
      </MainButton>
      <StrokeButton
        onClick={handleDraft}
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
