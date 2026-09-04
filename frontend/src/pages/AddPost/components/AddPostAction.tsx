import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import Loader from "@/components/ui/Loaders/Loader";
import { Bookmark, Send } from "lucide-react";

interface ActionProps {
  handleDraft: () => void;
  isPending: boolean;
}

const AddPostAction = ({ handleDraft, isPending }: ActionProps) => {
  return (
    <div className="add-post-actions">
      <MainButton
        align="center"
        className="add-post-actions__publish"
        icon={!isPending && <Send size={18} />}
        type="submit"
        typesBtn="primary-outline"
        form="add-post-form"
        disabled={isPending}
      >
        {isPending ? <Loader width={32} /> : "Опубликовать"}
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
