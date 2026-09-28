import UsersList from "@/components/common/UsersList/UsersList";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/ui/Modals/Modal";
import type { LikersData } from "@/types/api.types";
import { Heart, TriangleAlert, X } from "lucide-react";

interface PostLikersModalProps {
  open: boolean;
  likers: LikersData[];
  onClose: () => void;
  error?: unknown;
}

const PostLikersModal = ({
  open,
  likers,
  onClose,
  error,
}: PostLikersModalProps) => {
  return (
    <Modal className="modal--post-likers" onClose={onClose} open={open}>
      <div className="post-likers-modal">
        <div className="post-likers-modal__header">
          <div className="post-likers-modal__title">
            <Heart size={18} />
            <h2>Понравилось</h2>
          </div>
          <button
            aria-label="Закрыть список лайкнувших"
            className="post-likers-modal__close"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {error ? (
          <EmptyState icon={<TriangleAlert />} text="Не удалось загрузить список лайкнувших" error={error} isError />
        ) : likers.length > 0 ? (
          <UsersList users={likers} />
        ) : (
          <p className="post-likers-modal__empty">Лайков пока нет</p>
        )}
      </div>
    </Modal>
  );
};

export default PostLikersModal;
