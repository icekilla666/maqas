import { useState } from "react";
import { Check, Copy, Send, X } from "lucide-react";
import { toast } from "sonner";
import Avatar from "../Avatar/Avatar";
import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import Loader from "@/components/ui/Loaders/Loader";
import Modal from "@/components/ui/Modals/Modal";
import { useFollowQuery } from "@/lib/usersQueries";
import type { BlackListUserData } from "@/types/api.types";

interface PostShareModalProps {
  postId: string;
  onClose: () => void;
}

const PostShareModal = ({ postId, onClose }: PostShareModalProps) => {
  const { data: followers = [], isPending, isError, refetch } =
    useFollowQuery("followings");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const postUrl = new URL(`/posts/${postId}`, window.location.origin).href;

  const toggleRecipient = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );
  };

  const copyLink = async () => {
    setIsCopying(true);
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(postUrl);
      setIsCopied(true);
      toast.success("Ссылка скопирована");
    } catch {
      setIsCopied(false);
      setCopyError(true);
      toast.error("Не удалось скопировать ссылку. Скопируйте её из поля ниже");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      className="modal--post-share"
      ariaLabel="Поделиться постом"
    >
      <div className="post-share-modal">
        <div className="post-share-modal__header">
          <h2>Поделиться постом</h2>
          <button
            type="button"
            className="post-share-modal__close"
            aria-label="Закрыть окно пересылки"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="post-share-modal__recipients">
          <p className="post-share-modal__label">Ваши подписчики</p>
          {isPending ? (
            <div className="post-share-modal__status">
              <Loader />
            </div>
          ) : isError ? (
            <div className="post-share-modal__status" role="status">
              <p>Не удалось загрузить подписчиков</p>
              <StrokeButton type="button" onClick={() => void refetch()}>
                Повторить
              </StrokeButton>
            </div>
          ) : followers.length > 0 ? (
            <div
              className="post-share-modal__avatars"
              role="group"
              aria-label="Получатели"
            >
              {followers.map((follower: BlackListUserData) => (
                <button
                  key={follower.id}
                  type="button"
                  className="post-share-modal__recipient"
                  aria-label={`Выбрать @${follower.username}`}
                  aria-pressed={selectedIds.includes(follower.id)}
                  title={`@${follower.username}`}
                  onClick={() => toggleRecipient(follower.id)}
                >
                  <Avatar
                    avatar={follower.avatar_url}
                    username={follower.username}
                    width={48}
                    size={24}
                  />
                  {selectedIds.includes(follower.id) && (
                    <span className="post-share-modal__check" aria-hidden="true">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="post-share-modal__status">Подписчиков пока нет</p>
          )}
        </div>

        <StrokeButton
          type="button"
          className="post-share-modal__copy"
          icon={isCopied ? <Check size={18} /> : <Copy size={18} />}
          onClick={copyLink}
          disabled={isCopying}
        >
          {isCopied ? "Ссылка скопирована" : "Скопировать ссылку"}
        </StrokeButton>
        {copyError && (
          <input
            className="post-share-modal__link"
            aria-label="Ссылка на пост для копирования"
            value={postUrl}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        )}
        <MainButton
          type="button"
          typesBtn="primary"
          align="center"
          className="post-share-modal__send"
          icon={<Send size={18} />}
          disabled={selectedIds.length === 0 || isError || isPending}
          onClick={() => toast.info("Отправил")}
        >
          Отправить{selectedIds.length > 0 ? ` · ${selectedIds.length}` : ""}
        </MainButton>
      </div>
    </Modal>
  );
};

export default PostShareModal;
