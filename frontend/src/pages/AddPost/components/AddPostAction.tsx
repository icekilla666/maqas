import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import Loader from "@/components/ui/Loaders/Loader";
import { Bookmark, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ModalActions from "@/components/ui/Modals/ModalActions";
import { useDraftStore } from "@/store/draft.store";
import { ACCOUNT_PAGE } from "@/utils/constants";

interface ActionProps {
  handleDraft: () => void;
  isPending: boolean;
  isUnconfirmed: boolean;
}

const AddPostAction = ({ handleDraft, isPending, isUnconfirmed }: ActionProps) => {
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false);
  return (
    <div className="add-post-actions">
      {isUnconfirmed && !isPending && (
        <div className="add-post-delivery-notice" role="status">
          <strong>Не удалось подтвердить публикацию</strong>
          <p>Сервер мог сохранить пост. Проверьте свои публикации перед повторной отправкой. Текст черновика сохранён.</p>
          <Link to={`${ACCOUNT_PAGE}#publications`}>Мои публикации</Link>
          <StrokeButton type="button" onClick={() => setIsRetryConfirmOpen(true)}>
            Разрешить повторную отправку
          </StrokeButton>
        </div>
      )}
      <MainButton
        align="center"
        className="add-post-actions__publish"
        icon={!isPending && <Send size={18} />}
        type="submit"
        typesBtn="primary-outline"
        form="add-post-form"
        disabled={isPending || isUnconfirmed}
      >
        {isPending ? <Loader width={32} /> : "Опубликовать"}
      </MainButton>
      <StrokeButton
        onClick={handleDraft}
        className="add-post-actions__draft"
        icon={<Bookmark size={18} />}
        type="button"
        disabled={isPending || isUnconfirmed}
      >
        Сохранить черновик
      </StrokeButton>
      <p>
        Публикуя запись, вы подтверждаете, что она соответствует правилам
        сообщества.
      </p>
      <ModalActions
        open={isRetryConfirmOpen}
        onCancel={() => setIsRetryConfirmOpen(false)}
        onConfirm={() => {
          useDraftStore.getState().setPublicationUnconfirmed(false);
          setIsRetryConfirmOpen(false);
        }}
        isPending={isPending}
        text="Первая отправка могла создать пост или ещё выполняться. Повторная публикация может создать копию. Разблокировать отправку?"
        confirmText="Разблокировать"
        cancelText="Назад"
      />
    </div>
  );
};

export default AddPostAction;
