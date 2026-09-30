import { useRef, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiError";
import { Check, Copy, LoaderCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import Avatar from "../Avatar/Avatar";
import MainButton from "@/components/ui/Buttons/MainButton";
import StrokeButton from "@/components/ui/Buttons/StrokeButton";
import Loader from "@/components/ui/Loaders/Loader";
import Modal from "@/components/ui/Modals/Modal";
import { useFollowQuery } from "@/lib/usersQueries";
import { useMyChatsQuery, useSharePostMutation } from "@/lib/chatsQueries";
import { getPostShareUrl } from "@/utils/sharedPost";
import type { ChatUserData } from "@/types/api.types";

interface PostShareModalProps {
  postId: string;
  onClose: () => void;
}

const PostShareModal = ({ postId, onClose }: PostShareModalProps) => {
  const followersQuery = useFollowQuery("followers");
  const chatsQuery = useMyChatsQuery();
  const sharePost = useSharePostMutation();
  const sendingRef = useRef(false);
  const recipients = [...new Map<string, ChatUserData>([
    ...(chatsQuery.data ?? []).map((chat) => [chat.target_user.id, chat.target_user] as const),
    ...(followersQuery.data ?? []).map((user: ChatUserData) => [user.id, user] as const),
  ]).values()];
  const isPending = !recipients.length && (followersQuery.isPending || chatsQuery.isPending);
  const isError = !recipients.length && (followersQuery.isError || chatsQuery.isError);
  const error = followersQuery.error ?? chatsQuery.error;
  const refetch = () => Promise.all([followersQuery.refetch(), chatsQuery.refetch()]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const postUrl = getPostShareUrl(postId);

  const handleClose = () => {
    if (!sendingRef.current) onClose();
  };

  const sendPost = async () => {
    if (sendingRef.current || !selectedIds.length) return;
    sendingRef.current = true;
    try {
      const { sentUserIds, failures } = await sharePost.mutateAsync({ postId, userIds: selectedIds });
      setSentIds((previous) => [...previous, ...sentUserIds]);
      // Повторная попытка отправит пост только тем, кому он ещё не доставлен.
      setSelectedIds(failures.map(({ userId }) => userId));
      if (failures.length) {
        const reason = getApiErrorMessage(failures[0].error, "Не удалось отправить публикацию");
        toast.error(sentUserIds.length ? `Отправлено: ${sentUserIds.length}. Не отправлено: ${failures.length}. ${reason}` : reason);
      } else {
        onClose();
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось отправить публикацию"));
    } finally {
      sendingRef.current = false;
    }
  };

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
      onClose={handleClose}
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
            onClick={handleClose}
            disabled={sharePost.isPending}
          >
            <X size={18} />
          </button>
        </div>

        <div className="post-share-modal__recipients">
          <p className="post-share-modal__label">Чаты и подписчики</p>
          {isPending ? (
            <div className="post-share-modal__status">
              <Loader />
            </div>
          ) : isError ? (
            <div className="post-share-modal__status" role="status">
              <p>{getApiErrorMessage(error, "Не удалось загрузить получателей")}</p>
              <StrokeButton type="button" onClick={() => void refetch()}>
                Повторить
              </StrokeButton>
            </div>
          ) : recipients.length > 0 ? (
            <div
              className="post-share-modal__avatars"
              role="group"
              aria-label="Получатели"
            >
              {recipients.map((follower) => (
                <button
                  key={follower.id}
                  type="button"
                  className="post-share-modal__recipient"
                  aria-label={sentIds.includes(follower.id) ? `Отправлено @${follower.username}` : `Выбрать @${follower.username}`}
                  aria-pressed={selectedIds.includes(follower.id)}
                  title={`@${follower.username}`}
                  onClick={() => toggleRecipient(follower.id)}
                  disabled={sharePost.isPending || sentIds.includes(follower.id)}
                >
                  <Avatar
                    avatar={follower.avatar_url ?? undefined}
                    username={follower.username}
                    width={48}
                    size={24}
                  />
                  {(selectedIds.includes(follower.id) || sentIds.includes(follower.id)) && (
                    <span
                      className="post-share-modal__check"
                      aria-hidden="true"
                    >
                      <Check size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="post-share-modal__status">Чатов и подписчиков пока нет</p>
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
          icon={sharePost.isPending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
          disabled={selectedIds.length === 0 || isError || isPending || sharePost.isPending}
          onClick={() => void sendPost()}
        >
          {sharePost.isPending ? "Отправка…" : `Отправить${selectedIds.length > 0 ? ` · ${selectedIds.length}` : ""}`}
        </MainButton>
      </div>
    </Modal>
  );
};

export default PostShareModal;
